import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BookAuthorRepository {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param bookId
   * @param authorId
   */
  async delete(bookId: number, authorId: number) {
    await this.prisma.bookAuthor.delete({
      where: {
        bookId_authorId: {
          bookId,
          authorId,
        },
      },
    });
  }
}
