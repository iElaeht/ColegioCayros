import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export async function seedUsuario(prisma: PrismaClient) {
  const usuarioDefault = process.env.DEFAULT_ADMIN_USER?.trim() || "Admin";
  const passwordPlano = process.env.DEFAULT_ADMIN_PASS || "Admin";

  const hashedPassword = await bcrypt.hash(passwordPlano, 10);

  const admin = await prisma.usuario.upsert({
    where: { usuario: usuarioDefault },
    update: {
      password: hashedPassword,
    },
    create: {
      usuario: usuarioDefault,
      password: hashedPassword,
    },
  });

  console.log(`Usuario administrador listo: ${admin.usuario}`);
}