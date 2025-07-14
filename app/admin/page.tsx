import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <p className="mt-4">
        ¡Bienvenido, {session?.user?.name}! Esta página solo es visible para administradores.
      </p>
      <p>Tu rol es: <strong>{session?.user?.role}</strong></p>
    </div>
  );
}
