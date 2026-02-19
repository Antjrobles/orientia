import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const PROFILE_BUCKET = "profile-private";
const DOCS_PREFIX = "documents";

function normalizeRelativePath(value: string) {
  return value.replace(/^\/+/, "").replace(/\\/g, "/");
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "No autenticado." }, { status: 401 });
  }

  const rawPath = request.nextUrl.searchParams.get("path") || "";
  const path = normalizeRelativePath(rawPath);
  const expectedPrefix = `${session.user.id}/${DOCS_PREFIX}/`;
  const asDownload = request.nextUrl.searchParams.get("download") === "1";

  if (!path || !path.startsWith(expectedPrefix)) {
    return NextResponse.json(
      { success: false, error: "Ruta de documento invalida." },
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

  const filename = path.split("/").at(-1) || "documento";
  const contentType = data.type || "application/octet-stream";
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "private, no-store");
  headers.set(
    "Content-Disposition",
    `${asDownload ? "attachment" : "inline"}; filename="${filename}"`,
  );

  return new NextResponse(data, { status: 200, headers });
}
