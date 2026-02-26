import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed demo user
  const hash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@secureblog.dev' },
    update: {},
    create: {
      email: 'demo@secureblog.dev',
      passwordHash: hash,
      name: 'Demo User',
    },
  });

  console.log('Seeded user:', user.email);

  // Seed demo blogs
  const blogs = [
    {
      title: 'Getting Started with NestJS',
      content:
        'NestJS is a progressive Node.js framework for building efficient, scalable server-side applications...\n\n' +
        'It uses TypeScript by default and combines elements of OOP, FP, and FRP.\n\n' +
        'With decorators, modules, and dependency injection, NestJS makes large-scale apps manageable.',
      isPublished: true,
    },
    {
      title: 'Prisma ORM: The Future of Database Access',
      content:
        'Prisma is a next-generation ORM that makes working with databases easy and type-safe.\n\n' +
        'The Prisma schema is your single source of truth for both the database schema and TypeScript types.\n\n' +
        'With features like migrations, studio, and the client, Prisma accelerates development significantly.',
      isPublished: true,
    },
    {
      title: 'Draft Post — Work in Progress',
      content:
        'This is a draft post that is not yet published.\n\nStill working on the content...',
      isPublished: false,
    },
  ];

  for (const blog of blogs) {
    const slug =
      blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      `-${Date.now()}`;

    await prisma.blog.upsert({
      where: { slug },
      update: {},
      create: {
        userId: user.id,
        title: blog.title,
        slug,
        content: blog.content,
        summary: blog.content.slice(0, 150) + '...',
        isPublished: blog.isPublished,
      },
    });

    console.log('Seeded blog:', blog.title);
  }

  console.log('\n✅ Seed complete!');
  console.log('Login with: demo@secureblog.dev / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
