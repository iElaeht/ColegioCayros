-- CreateTable
CREATE TABLE "galeria" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "alt" CHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galeria_pkey" PRIMARY KEY ("id")
);
