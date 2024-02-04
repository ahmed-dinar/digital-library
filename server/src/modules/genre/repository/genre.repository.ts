import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Genre, Prisma } from '@prisma/client';

@Injectable()
export class GenreRepository {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param data
   */
  async save(data: Prisma.GenreCreateInput): Promise<Genre> {
    return this.prisma.genre.create({
      data,
    });
  }

  /**
   *
   * @param id
   */
  async findById(id: number): Promise<Genre | null> {
    return this.prisma.genre.findUnique({
      where: { id },
    });
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: Prisma.GenreUpdateInput): Promise<Genre> {
    return this.prisma.genre.update({
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
  async findByName(text: string): Promise<Genre[]> {
    return this.prisma.genre.findMany({
      where: {
        name: {
          startsWith: text,
          mode: 'insensitive',
        },
      },
    });
  }

  /**
   *
   * @param page
   * @param limit
   */
  async list(
    page: number,
    limit: number,
  ): Promise<{ items: Genre[]; count: number }> {
    const [genres, count] = await this.prisma.$transaction([
      this.prisma.genre.findMany({
        skip: Math.max(page - 1, 0) * limit,
        take: limit,
      }),
      this.prisma.genre.count(),
    ]);

    return { items: genres, count };
  }

  /**
   *
   * @param name
   */
  async delete(name: string): Promise<void> {
    await this.prisma.genre.delete({
      where: {
        name,
      },
    });
  }
}
