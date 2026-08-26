import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export async function seedUsuario(prisma: PrismaClient) {
  const passwordPlano = "ADMINPROMOTOR";
  const hashedPassword = await bcrypt.hash(passwordPlano, 10);

  const admin = await prisma.usuario.upsert({
    where: { dni: "76728856" },
    update: {},
    create: {
      usuario: "AdminPromotor",
      dni: "76728856",
      password: hashedPassword,
    },
  });

  console.log("Usuario administrador procesado con exito:", admin.dni);
}