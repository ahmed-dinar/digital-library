import { Injectable } from '@nestjs/common';
import { Author, Genre, Prisma } from '@prisma/client';

import { PrismaService } from '../../../database/prisma.service';
import { BookFilterDto } from '../dto/book.dto';
import { SortDto } from '../../../common/interfaces/query.interfaces';
import { BookWithRelations } from '../entity/book.entity.typings';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a book
   * @param data
   */
  async create(data: Prisma.BookCreateInput): Promise<BookWithRelations> {
    return this.prisma.book.create({
      data,
      include: {
        authors: {
          include: {
            author: true,
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
        editions: true,
      },
    });
  }

  /**
   *
   * @param id book id
   * @param data data to patch
   */
  async update(
    id: number,
    data: Prisma.BookUpdateInput,
  ): Promise<BookWithRelations> {
    return this.prisma.book.update({
      where: {
        id,
      },
      data,
      include: {
        authors: {
          include: {
            author: true,
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
        editions: true,
      },
    });
  }

  /**
   *
   * @param id book id
   */
  async delete(id: number): Promise<void> {
    await this.prisma.book.delete({
      where: { id },
    });
  }

  /**
   *
   * @param title
   */
  async deleteByTitle(title: string): Promise<void> {
    await this.prisma.book.delete({
      where: { title },
    });
  }

  /**
   *
   * @param id book id
   */
  async findById(id: number): Promise<BookWithRelations | null> {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        authors: {
          include: {
            author: true,
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
        editions: true,
      },
    });
  }

  /**
   *
   * @param page
   * @param limit
   * @param filterDto
   * @param sortDto
   */
  async findAll(
    page: number,
    limit: number,
    {
      filterDto,
      sortDto,
    }: {
      filterDto?: BookFilterDto;
      sortDto?: SortDto;
    },
  ): Promise<{ items: BookWithRelations[]; count: number }> {
    const where: Prisma.BookWhereInput = {};

    // Title summary or author name should be or logic
    if (filterDto?.title || filterDto?.summary || filterDto?.author) {
      where.OR = [];

      if (filterDto?.title) {
        where.OR.push({
          title: {
            contains: filterDto.title,
            mode: 'insensitive',
          },
        });
      }

      if (filterDto?.summary) {
        where.OR.push({
          summary: {
            contains: filterDto.summary,
            mode: 'insensitive',
          },
        });
      }

      if (filterDto?.author) {
        where.OR.push({
          authors: {
            some: {
              author: {
                name: {
                  contains: filterDto.author,
                  mode: 'insensitive',
                },
              },
            },
          },
        });
      }
    }

    if (filterDto?.publisher) {
      where.publisher = {
        contains: filterDto.publisher,
        mode: 'insensitive',
      };
    }

    if (filterDto?.publicationYear) {
      where.publicationYear = {
        equals: filterDto.publicationYear,
      };
    }

    /**
     * Exact match ISBN
     */
    if (filterDto?.isbn) {
      where.editions = {
        some: {
          isbn: {
            equals: filterDto.isbn,
          },
        },
      };
    }

    if (filterDto?.authorId) {
      const authorIds = filterDto?.authorId
        .split(',')
        .map((id) => parseInt(id));

      where.authors = {
        some: {
          author: {
            id: {
              in: authorIds,
            },
          },
        },
      };
    }

    if (filterDto?.genre) {
      where.genres = {
        some: {
          genre: {
            name: {
              startsWith: filterDto.genre,
              mode: 'insensitive',
            },
          },
        },
      };
    } else if (filterDto?.genreId) {
      const genreIds = filterDto?.genreId.split(',').map((id) => parseInt(id));

      where.genres = {
        some: {
          genre: {
            id: {
              in: genreIds,
            },
          },
        },
      };
    }

    const sort =
      sortDto?._sort && sortDto._sort.length > 0
        ? {
            orderBy: sortDto._sort.map((s: any) => ({
              [s.property]: s.direction,
            })),
          }
        : {};

    const query: Prisma.BookFindManyArgs = {
      skip: Math.max(page - 1, 0) * limit,
      take: limit,
      where,
      ...sort,
      include: {
        authors: {
          include: {
            author: true,
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
        editions: true,
      },
    };

    const [books, count] = await this.prisma.$transaction([
      this.prisma.book.findMany(query),
      this.prisma.book.count({
        where,
      }),
    ]);

    return { items: books as any, count };
  }

  async deleteSeedItems(): Promise<void> {
    await this.prisma.book.deleteMany();
    await this.prisma.author.deleteMany();
    await this.prisma.genre.deleteMany();
  }

  async save(data: Prisma.BookCreateInput): Promise<void> {
    await this.prisma.book.create({
      data,
    });
  }

  /**
   *
   * @param data
   */
  async saveManyAuthor(data: Prisma.AuthorCreateInput[]): Promise<Author[]> {
    await this.prisma.author.createMany({
      data,
    });

    return this.prisma.author.findMany({
      where: {
        name: {
          in: data.map((d) => d.name),
        },
      },
    });
  }

  /**
   *
   * @param data
   */
  async saveManyGenre(data: Prisma.GenreCreateInput[]): Promise<Genre[]> {
    await this.prisma.genre.createMany({
      data,
    });

    return this.prisma.genre.findMany({
      where: {
        name: {
          in: data.map((d) => d.name),
        },
      },
    });
  }
}
