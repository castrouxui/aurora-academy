import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 
async function main() { 
  const totalRevenue = await prisma.purchase.aggregate({ _sum: { amount: true }, where: { status: 'approved' } });
  const recentSales = await prisma.purchase.findMany({ 
    take: 5, 
    orderBy: { createdAt: 'desc' }, 
    include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
    where: { status: 'approved' }
  });
  console.log('Revenue:', totalRevenue._sum.amount);
  console.log('Recent Sales:', JSON.stringify(recentSales, null, 2));
} 
main().finally(() => prisma.$disconnect());
