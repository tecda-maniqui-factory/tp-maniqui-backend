/**
 * @file env.ts
 * @description Validación y tipado fuerte de las variables de entorno de la aplicación utilizando Zod.
 */

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Esquema de validación para las variables de entorno de la aplicación.
 * Define los tipos requeridos, valores por defecto y transformaciones necesarias.
 */
const envSchema = z.object({
  /** Entorno de ejecución de Node.js (development, production, test) */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  /** Puerto en el cual el servidor Express escuchará las peticiones, transformado a número */
  PORT: z.string().default('8082').transform(Number),
  
  /** Clave secreta para la firma y verificación de tokens JWT (mínimo 16 caracteres) */
  JWT_SECRET: z.string().min(16, "JWT_SECRET debe tener al menos 16 caracteres"),
  
  /** Nombre de la base de datos MySQL */
  DB_NAME: z.string(),
  
  /** Usuario para la base de datos MySQL */
  DB_USER: z.string(),
  
  /** Contraseña del usuario de la base de datos MySQL */
  DB_PASS: z.string(),
  
  /** Host o dirección IP del servidor de base de datos */
  DB_HOST: z.string(),
  
  /** Puerto de comunicación de la base de datos MySQL, transformado a número */
  DB_PORT: z.string().default('3306').transform(Number),
});

/**
 * Intento de validación y análisis de las variables de entorno cargadas en process.env.
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Error de configuración en variables de entorno:', parsed.error.format());
  process.exit(1);
}

/**
 * Objeto que contiene las variables de entorno validadas, transformadas y tipadas estáticamente.
 * Se debe importar en todo el proyecto para interactuar de forma segura con la configuración.
 */
export const env = parsed.data;

