"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Este cliente usa la SERVICE_ROLE_KEY para tener permisos de administrador
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "usuario",
) {
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
  // CORRECCIÓN: El error "User not found" ocurría porque intentábamos borrar
  // desde 'auth.users' con un ID de 'public.users'.
  // La acción correcta es borrar el perfil del usuario de la tabla 'users',
  // que es la fuente de datos para tu aplicación.
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
