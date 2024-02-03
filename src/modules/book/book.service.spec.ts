import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from '../../database/prisma.service';
import { BookRepository } from './repository/book.repository';
import { BookAuthorRepository } from './repository/book-author.repository';
import { BookGenreRepository } from './repository/book-genre.repository';
import { BookMapper } from './mapper/book.mapper';
import { BookSeeder } from './seed/book.seeder';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
