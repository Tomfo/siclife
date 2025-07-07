// import { PrismaClient } from '@prisma/client';

// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// const prisma = globalThis.prismaGlobal || prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

import { PrismaClient } from '../app/generated/prisma/client';

//const { PrismaClient } = require('../app/generated/prisma/client');

const prismaClientSingleton = () => {
	return new PrismaClient();
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || prismaClientSingleton();

module.exports = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
