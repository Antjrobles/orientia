import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const PROFILE_BUCKET = "profile-private";
const DOCS_PREFIX = "documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "docx",
  "txt",
  "doc",
  "odt",
  "rtf",
  "md",
]);

function sanitizeFileName(name: string) {
  const safe = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .slice(0, 120);
  return safe || `documento_${Date.now()}`;
}

function splitNameAndExtension(filename: string) {
  const idx = filename.lastIndexOf(".");
  if (idx <= 0) return { base: filename, ext: "" };
  return {
    base: filename.slice(0, idx),
    ext: filename.slice(idx + 1).toLowerCase(),
  };
}

function extensionOf(name: string) {
  const parts = name.split(".");
  if (parts.length < 2) return "";
  return parts.at(-1)?.toLowerCase() || "";
}

async function ensurePrivateBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) return { ok: false as const, error: listError.message };

  const exists = (buckets || []).some((bucket) => bucket.name === PROFILE_BUCKET);
  if (exists) return { ok: true as const };

  const { error: createError } = await supabase.storage.createBucket(PROFILE_BUCKET, {
    public: false,
    fileSizeLimit: MAX_FILE_SIZE,
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    return { ok: false as const, error: createError.message };
  }
  return { ok: true as const };
}

function docsFolder(userId: string) {
  return `${userId}/${DOCS_PREFIX}`;
}

function normalizeRelativePath(value: string) {
  return value.replace(/^\/+/, "").replace(/\\/g, "/");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "No autenticado." }, { status: 401 });
  }

  const bucket = await ensurePrivateBucket();
  if (!bucket.ok) {
    return NextResponse.json(
      { success: false, error: "No se pudo inicializar el almacenamiento personal." },
      { status: 500 },
    );
  }

  const folder = docsFolder(session.user.id);
  const { data, error } = await supabase.storage.from(PROFILE_BUCKET).list(folder, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: "No se pudo cargar el listado de documentos." },
      { status: 500 },
    );
  }

  const files = await Promise.all(
    (data || [])
      .filter((file) => Boolean(file.name))
      .map(async (file) => {
        const fullPath = `${folder}/${file.name}`;
        const signed = await supabase.storage
          .from(PROFILE_BUCKET)
          .createSignedUrl(fullPath, 60 * 30);

        return {
          name: file.name,
          path: fullPath,
          size: file.metadata?.size || 0,
          createdAt: file.created_at || file.updated_at || "",
          url: signed.data?.signedUrl || "",
        };
      }),
  );

  return NextResponse.json({ success: true, files });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "No autenticado." }, { status: 401 });
  }

  const bucket = await ensurePrivateBucket();
  if (!bucket.ok) {
    return NextResponse.json(
      { success: false, error: "No se pudo inicializar el almacenamiento personal." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Selecciona un archivo valido." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { success: false, error: "El archivo supera 10MB." },
      { status: 400 },
    );
  }

  const ext = extensionOf(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      {
        success: false,
        error: "Formato no permitido. Usa PDF, DOCX, DOC, TXT, ODT, RTF o MD.",
      },
      { status: 400 },
    );
  }

  const folder = docsFolder(session.user.id);
  const safeName = sanitizeFileName(file.name);
  const { base, ext: cleanExt } = splitNameAndExtension(safeName);
  const expectedName = cleanExt ? `${base}.${cleanExt}` : base;
  const { data: existingFiles } = await supabase
    .storage
    .from(PROFILE_BUCKET)
    .list(folder, { limit: 1000 });

  const existingNames = new Set((existingFiles || []).map((item) => item.name));
  let finalName = expectedName;
  let suffix = 2;
  while (existingNames.has(finalName)) {
    finalName = cleanExt ? `${base} (${suffix}).${cleanExt}` : `${base} (${suffix})`;
    suffix += 1;
  }

  const path = `${folder}/${finalName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, buffer, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (uploadError) {
    return NextResponse.json(
      { success: false, error: "No se pudo subir el documento." },
      { status: 500 },
    );
  }

  const signed = await supabase.storage
    .from(PROFILE_BUCKET)
    .createSignedUrl(path, 60 * 30);

  return NextResponse.json({
    success: true,
    file: {
      name: finalName,
      path,
      size: file.size,
      createdAt: new Date().toISOString(),
      url: signed.data?.signedUrl || "",
    },
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "No autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const rawPath = typeof body?.path === "string" ? body.path : "";
  const path = normalizeRelativePath(rawPath);
  const expectedPrefix = `${session.user.id}/${DOCS_PREFIX}/`;

  if (!path || !path.startsWith(expectedPrefix)) {
    return NextResponse.json(
      { success: false, error: "Ruta de documento invalida." },
      { status: 400 },
    );
  }

  const { error } = await supabase.storage.from(PROFILE_BUCKET).remove([path]);
  if (error) {
    return NextResponse.json(
      { success: false, error: "No se pudo eliminar el documento." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "No autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const oldRawPath = typeof body?.path === "string" ? body.path : "";
  const newRawName = typeof body?.newName === "string" ? body.newName : "";
  const oldPath = normalizeRelativePath(oldRawPath);
  const newName = sanitizeFileName(newRawName);
  const expectedPrefix = `${session.user.id}/${DOCS_PREFIX}/`;

  if (!oldPath || !oldPath.startsWith(expectedPrefix)) {
    return NextResponse.json(
      { success: false, error: "Ruta de documento invalida." },
      { status: 400 },
    );
  }

  if (!newName || newName.length < 3) {
    return NextResponse.json(
      { success: false, error: "El nuevo nombre es demasiado corto." },
      { status: 400 },
    );
  }

  const oldExt = extensionOf(oldPath);
  const newExt = extensionOf(newName);
  if (!newExt || oldExt !== newExt || !ALLOWED_EXTENSIONS.has(newExt)) {
    return NextResponse.json(
      {
        success: false,
        error:
          "El nuevo nombre debe mantener la misma extension permitida del archivo original.",
      },
      { status: 400 },
    );
  }

  const targetPath = `${expectedPrefix}${newName}`;
  if (targetPath === oldPath) {
    return NextResponse.json({ success: true, path: oldPath, name: newName });
  }

  const { data: existing } = await supabase.storage.from(PROFILE_BUCKET).list(
    docsFolder(session.user.id),
    {
      search: newName,
      limit: 1,
    },
  );
  if ((existing || []).some((file) => file.name === newName)) {
    return NextResponse.json(
      { success: false, error: "Ya existe un documento con ese nombre." },
      { status: 409 },
    );
  }

  const { error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .move(oldPath, targetPath);

  if (error) {
    return NextResponse.json(
      { success: false, error: "No se pudo renombrar el documento." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    path: targetPath,
    name: newName,
  });
}
