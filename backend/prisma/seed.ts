// backend/prisma/seed.ts
import "dotenv/config";
import { prisma } from "../db";

import { seedUsuario } from "./seeders/usuario.seeder";
import { seedMensajes } from "./seeders/mensajes.seeder";
// import { seedGaleria } from "./seeders/galeria.seeder"; 

async function main() {
  console.log("Iniciando proceso de siembra de datos...");

  await seedUsuario(prisma);
  await seedMensajes(prisma);
  // await seedGaleria(prisma);

  console.log("Proceso de siembra finalizado correctamente.");
}

main()
  .catch((e) => {
    console.error("Error en el proceso de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });