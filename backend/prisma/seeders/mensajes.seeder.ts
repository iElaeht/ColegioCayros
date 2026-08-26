import { PrismaClient } from "@prisma/client";

export async function seedMensajes(prisma: PrismaClient) {
  await prisma.mensajeContacto.deleteMany({});

  const nombresPrueba = [
    "Jimi Juarez",
    "Ana Torres",
    "Carlos Mendoza",
    "Lucia Fernandez",
    "Mateo Gomez",
    "Valeria Rios",
    "Diego Silva",
    "Sofia Castillo",
  ];

  const asuntosPrueba = [
    "ASUNTO TESTEO",
    "CONSULTA DE MATRICULA",
    "INFORMACION SOBRE PENSIONES",
    "REUNION CON LOS PROMOTORES",
    "DUDA SOBRE EL HORARIO ESCOLAR",
  ];

  const mensajesAInsertar = [];
  const ahora = new Date();

  for (let i = 1; i <= 60; i++) {
    const nombreAleatorio = nombresPrueba[i % nombresPrueba.length];
    const asuntoAleatorio = asuntosPrueba[i % asuntosPrueba.length];
    const dniAleatorio = `767${Math.floor(10000 + Math.random() * 90000)}`;
    const telefonoAleatorio = `960${Math.floor(100000 + Math.random() * 900000)}`;

    const diasAleatoriosAtras = Math.floor(Math.random() * 30);
    const fechaMensaje = new Date(ahora);
    fechaMensaje.setDate(ahora.getDate() - diasAleatoriosAtras);

    mensajesAInsertar.push({
      dni: dniAleatorio,
      nombre: `${nombreAleatorio} ${i}`,
      telefono: telefonoAleatorio,
      asunto: `${asuntoAleatorio} #${i}`,
      fecha: fechaMensaje,
    });
  }

  await prisma.mensajeContacto.createMany({
    data: mensajesAInsertar,
  });

  console.log(`Se insertaron ${mensajesAInsertar.length} mensajes de prueba correctamente.`);
}