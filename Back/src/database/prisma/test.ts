import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()



async function main() {
  // Insertar un estudiante de prueba
  const estudiante = await prisma.estudiantes.create({
    data: {
      id_estudiante: 50,  // ojo: usa un ID que no exista ya
      nombre: 'Prueba',
      apellido: 'Supabase',
      correo: 'prueba.supabase@example.com',
      codigo_estudiantil: '676778'
    }
  })

  console.log('✅ Estudiante insertado:', estudiante)
}

main()
  .catch((e) => {
    console.error('❌ Error al insertar:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })