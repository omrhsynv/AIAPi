const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.assistant.findMany({
  select: { id: true, name: true, systemInstruction: true, model: true, isActive: true }
}).then(assistants => {
  assistants.forEach(a => {
    console.log('=== Assistant:', a.id, '===');
    console.log('Name:', a.name);
    console.log('Model:', a.model);
    console.log('Active:', a.isActive);
    console.log('System Instruction:', a.systemInstruction ? a.systemInstruction.substring(0, 500) : '(empty)');
    console.log('---');
  });
}).catch(console.error).finally(() => prisma.$disconnect());
