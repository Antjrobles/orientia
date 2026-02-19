import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";
import { getOptOutEmailSet } from "@/lib/communications-optout";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function escapeLike(value: string) {
  return value.replace(/[%_]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 403 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const q = (searchParams.get("q") || "").trim();
  const role = (searchParams.get("role") || "all").trim();
  const verified = (searchParams.get("verified") || "all").trim();
  const comms = (searchParams.get("comms") || "all").trim();

  let query = supabase
    .from("users")
    .select("id, name, email, role, emailVerified")
    .order("name", { ascending: true });

  if (role === "admin" || role === "usuario") {
    query = query.eq("role", role);
  }

  if (verified === "verified") {
    query = query.not("emailVerified", "is", null);
  } else if (verified === "unverified") {
    query = query.is("emailVerified", null);
  }

  if (q.length > 0) {
    const escaped = escapeLike(q);
    query = query.or(`name.ilike.%${escaped}%,email.ilike.%${escaped}%`);
  }

  const { data, error } = await query.limit(1000);

  if (error) {
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar los contactos." },
      { status: 500 },
    );
  }

  const optOutSet = await getOptOutEmailSet();

  const users = (data || [])
    .map((item) => {
      const email = (item.email as string | null)?.trim().toLowerCase() || null;
      const communicationsOptOut = email ? optOutSet.has(email) : false;
      return {
        id: item.id as string,
        name: (item.name as string | null) ?? null,
        email,
        role: (item.role as "admin" | "usuario") ?? "usuario",
        emailVerified: (item.emailVerified as string | null) ?? null,
        communicationsOptOut,
      };
    })
    .filter((item) => {
      if (comms === "active") return !item.communicationsOptOut;
      if (comms === "optout") return item.communicationsOptOut;
      return true;
    });

  return NextResponse.json({
    success: true,
    users,
    total: users.length,
  });
}
