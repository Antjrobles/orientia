"use server";

import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return {
      ok: false as const,
      message: "No tienes permisos para realizar esta acci¢n.",
    };
  }
  return { ok: true as const };
}

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "usuario",
) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { success: false, message: guard.message };
  }
  const { error } = await supabaseAdmin
    .from("users")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    return { success: false, message: "No se pudo actualizar el rol." };
  }

  revalidatePath("/admin");
  return { success: true, message: "Rol actualizado correctamente." };
}

export async function deleteUser(userId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { success: false, message: guard.message };
  }
  const { error } = await supabaseAdmin.from("users").delete().eq("id", userId);

  if (error) {
    console.error("Error al eliminar el usuario:", error);
    return {
      success: false,
      message: `No se pudo eliminar el usuario. Error: ${error.message}`,
    };
  }

  revalidatePath("/admin");
  return { success: true, message: "Usuario eliminado correctamente." };
}

export async function verifyUserEmail(userId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { success: false, message: guard.message };
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update({ emailVerified: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error al verificar el email del usuario:", error);
    return { success: false, message: "No se pudo verificar el email." };
  }

  revalidatePath("/admin");
  return { success: true, message: "Email verificado correctamente." };
}

export async function revokeTrustedDevices(userId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { success: false, message: guard.message };
  }

  const { error } = await supabaseAdmin
    .from("trusted_devices")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error al revocar dispositivos confiables:", error);
    return {
      success: false,
      message: "No se pudieron revocar los dispositivos.",
    };
  }

  revalidatePath("/admin");
  return { success: true, message: "Dispositivos revocados correctamente." };
}
