import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Author, Prisma } from '@prisma/client';

@Injectable()
export class AuthorRepository {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param data
   */
  async save(data: Prisma.AuthorCreateInput): Promise<Author> {
    return this.prisma.author.create({
      data,
    });
  }

  /**
   *
   * @param id
   */
  async findById(id: number): Promise<Author | null> {
    return this.prisma.author.findUnique({
      where: { id },
    });
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: Prisma.AuthorUpdateInput): Promise<Author> {
    return this.prisma.author.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   *
   * @param text
   */
  async findByName(text: string): Promise<Author[]> {
    return this.prisma.author.findMany({
      take: 100,
      where: {
        name: {
          startsWith: text,
          mode: 'insensitive',
        },
      },
    });
  }
}
