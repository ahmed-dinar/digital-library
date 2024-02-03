import { PrismaService } from '../../../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookGenreRepository {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param bookId
   * @param genreId
   */
  async delete(bookId: number, genreId: number) {
    await this.prisma.bookGenre.delete({
      where: {
        bookId_genreId: {
          bookId,
          genreId,
        },
      },
    });
  }
}
