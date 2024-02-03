import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from '../../database/prisma.service';
import { BookRepository } from './repository/book.repository';
import { BookAuthorRepository } from './repository/book-author.repository';
import { BookGenreRepository } from './repository/book-genre.repository';
import { BookMapper } from './mapper/book.mapper';
import { BookSeeder } from './seed/book.seeder';

describe('BookController', () => {
  let controller: BookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
