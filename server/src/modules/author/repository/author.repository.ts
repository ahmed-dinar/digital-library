import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../../database/prisma.service';
import {Author, Genre, Prisma} from '@prisma/client';

@Injectable()
export class AuthorRepository {
  constructor(private prisma: PrismaService) {
  }

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
      where: {id},
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

  /**
   *
   * @param name
   */
  async deleteByName(name: string): Promise<void> {
    await this.prisma.author.delete({
      where: {
        name,
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
  ): Promise<{ items: Author[]; count: number }> {
    const [authors, count] = await this.prisma.$transaction([
      this.prisma.author.findMany({
        skip: Math.max(page - 1, 0) * limit,
        take: limit,
      }),
      this.prisma.author.count(),
    ]);

    return {items: authors, count};
  }
}
