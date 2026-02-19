import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import mammoth from "mammoth";

const PROFILE_BUCKET = "profile-private";
const DOCS_PREFIX = "documents";

function normalizeRelativePath(value: string) {
  return value.replace(/^\/+/, "").replace(/\\/g, "/");
}

function extensionOf(name: string) {
  const parts = name.split(".");
  if (parts.length < 2) return "";
  return parts.at(-1)?.toLowerCase() || "";
}

function sanitizePreviewHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "No autenticado." }, { status: 401 });
  }

  const rawPath = request.nextUrl.searchParams.get("path") || "";
  const path = normalizeRelativePath(rawPath);
  const expectedPrefix = `${session.user.id}/${DOCS_PREFIX}/`;

  if (!path || !path.startsWith(expectedPrefix)) {
    return NextResponse.json(
      { success: false, error: "Ruta de documento invalida." },
      { status: 400 },
    );
  }

  const ext = extensionOf(path);
  if (ext !== "docx") {
    return NextResponse.json(
      { success: false, error: "Solo se admite vista previa DOCX en este endpoint." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.storage.from(PROFILE_BUCKET).download(path);
  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "No se pudo cargar el documento." },
      { status: 404 },
    );
  }

  try {
    const arrayBuffer = await data.arrayBuffer();
    let result: mammoth.Result<{ value: string }>;
    try {
      result = await mammoth.convertToHtml({ arrayBuffer });
    } catch {
      const buffer = Buffer.from(arrayBuffer);
      result = await mammoth.convertToHtml({ buffer });
    }
    const html = sanitizePreviewHtml(result.value || "<p>Documento sin contenido legible.</p>");

    return NextResponse.json({
      success: true,
      html,
      warnings: result.messages || [],
    });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Error desconocido al convertir DOCX.";
    return NextResponse.json(
      {
        success: false,
        error:
          "No se pudo convertir el DOCX para vista previa. Verifica que el archivo no este dañado y sea DOCX valido.",
        detail,
      },
      { status: 500 },
    );
  }
}
