import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma');

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.append('schema', schema);
  return url.toString();
};

export default async function setup() {
  const schema = `test_${uuid()}`;
  const databaseURL = generateDatabaseURL(schema);
  process.env.DATABASE_URL = databaseURL;

  execSync(`${prismaBinary} migrate deploy`);

  return async function cleanup() {
    const prisma = new PrismaClient();
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`
    );
    await prisma.$disconnect();
  };
}