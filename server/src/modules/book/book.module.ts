import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookMapper } from './mapper/book.mapper';
import { PrismaService } from '../../database/prisma.service';
import { BookSeeder } from './seed/book.seeder';
import { BookRepository } from './repository/book.repository';
import { BookAuthorRepository } from './repository/book-author.repository';
import { BookGenreRepository } from './repository/book-genre.repository';

@Module({
  controllers: [BookController],
  providers: [
    PrismaService,
    BookService,
    BookRepository,
    BookAuthorRepository,
    BookGenreRepository,
    BookMapper,
    BookSeeder,
  ],
})
export class BookModule {}
