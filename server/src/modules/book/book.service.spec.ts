import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from '../../database/prisma.service';
import { BookRepository } from './repository/book.repository';
import { BookAuthorRepository } from './repository/book-author.repository';
import { BookGenreRepository } from './repository/book-genre.repository';
import { BookMapper } from './mapper/book.mapper';
import { BookSeeder } from './seed/book.seeder';
import { AuthorService } from '../author/author.service';
import { GenreService } from '../genre/genre.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateGenreDto } from '../genre/dto/create-genre.dto';
import { CreateAuthorDto } from '../author/dto/create-author.dto';
import { Prisma } from '@prisma/client/default';
import { AuthorRepository } from '../author/repository/author.repository';
import { AuthorMapper } from '../author/mapper/author.mapper';
import { GenreRepository } from '../genre/repository/genre.repository';
import { GenreMapper } from '../genre/mapper/genre.mapper';
import {
  PageQueryDto,
  SortDto,
} from '../../common/interfaces/query.interfaces';
import { BookFilterDto } from './dto/book.dto';

describe('BookService', () => {
  const authorData: CreateAuthorDto = {
    name: 'George R. R. Martin',
  };

  const genreData: CreateGenreDto = {
    name: 'Fantasy',
  };

  const data: CreateBookDto = {
    title: 'A Song of Ice and Fire',
    publicationYear: 1990,
    summary: '',
  };

  let service: BookService;
  let authorService: AuthorService;
  let genreService: GenreService;

  beforeAll(async () => {
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

    const authorModule: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, AuthorService, AuthorRepository, AuthorMapper],
    }).compile();

    authorService = authorModule.get<AuthorService>(AuthorService);

    const genreModule: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, GenreService, GenreRepository, GenreMapper],
    }).compile();

    genreService = genreModule.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create book', () => {
    it('should create book without author & genre', async () => {
      await expect(service.create(data)).resolves.not.toThrow();
      await expect(service.removeByTitle(data.title)).resolves.not.toThrow();

      const book = await service.create(data);
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('summary');
      expect(book.title).toEqual(data.title);
      expect(book.summary).toEqual(data.summary);

      await expect(service.remove(book.id)).resolves.not.toThrow();
    });

    it('should create book with author', async () => {
      const author = await authorService.create(authorData);

      const bookData: CreateBookDto = { ...data, authorIds: [author.id] };
      const book = await service.create(bookData);

      expect(book).toHaveProperty('id');
      expect(book.title).toEqual(data.title);
      expect(book.summary).toEqual(data.summary);
      expect(book.authors).toBeDefined();
      expect(book.authors.length).toEqual(1);
      expect(book.authors[0].name).toEqual(author.name);

      await expect(service.remove(book.id)).resolves.not.toThrow();
      await expect(authorService.delete(author.name)).resolves.not.toThrow();
    });

    it('should create book with author & genre', async () => {
      const author = await authorService.create(authorData);
      const genre = await genreService.create(genreData);

      const bookData: CreateBookDto = {
        ...data,
        authorIds: [author.id],
        genreIds: [genre.id],
      };

      const book = await service.create(bookData);

      expect(book).toHaveProperty('id');
      expect(book.title).toEqual(data.title);
      expect(book.summary).toEqual(data.summary);
      expect(book.authors).toBeDefined();
      expect(book.authors.length).toEqual(1);
      expect(book.authors[0].name).toEqual(author.name);
      expect(book.genres).toBeDefined();
      expect(book.genres.length).toEqual(1);
      expect(book.genres[0].name).toEqual(genre.name);

      await expect(service.remove(book.id)).resolves.not.toThrow();
      await expect(authorService.delete(author.name)).resolves.not.toThrow();
      await expect(genreService.delete(genre.name)).resolves.not.toThrow();
    });

    it('should throw error on duplicate title', async () => {
      const book = await service.create(data);
      await expect(service.create(data)).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
      await expect(service.remove(book.id)).resolves.not.toThrow();
    });
  });

  describe('List book', () => {
    let pageQuery: PageQueryDto;
    let bookFilterDto: BookFilterDto;
    let sortDto: SortDto;

    beforeAll(async () => {
      await service.seed();
    });

    afterAll(async () => {
      await service.clearSeed();
    });

    beforeEach(() => {
      pageQuery = new PageQueryDto();
      pageQuery.page = 1;
      pageQuery.limit = 10;

      bookFilterDto = new BookFilterDto();

      sortDto = new SortDto();
      sortDto.sort = [];
    });

    it('should list first 10 books', async () => {
      const books = await service.list(pageQuery, bookFilterDto, sortDto);

      expect(books).toBeDefined();
      expect(books.items).toBeInstanceOf(Array);
      expect(books.items.length).toEqual(10);
    });

    it('should filter with title', async () => {
      bookFilterDto.title = 'The';
      const books = await service.list(pageQuery, bookFilterDto, sortDto);

      expect(books).toBeDefined();
      expect(books.items).toBeInstanceOf(Array);
      expect(books.items.length).toBeGreaterThan(0);

      books.items.forEach((book) => {
        expect(book.title.toLowerCase()).toContain(bookFilterDto.title?.toLowerCase());
      });
    });

    it('should filter with author', async () => {
      bookFilterDto.author = 'Franz';
      const books = await service.list(pageQuery, bookFilterDto, sortDto);

      expect(books).toBeDefined();
      expect(books.items).toBeInstanceOf(Array);
      expect(books.items.length).toBeGreaterThan(0);

      books.items.forEach((book) => {
        expect(book.authors).toBeInstanceOf(Array);
        expect(book.authors.length).toBeGreaterThan(0);

        book.authors.forEach((author) => {
          expect(author.name).toMatch(/^Franz/);
        });
      });
    });

    it('should filter with genre', async () => {
      bookFilterDto.genre = 'Fantasy';
      const books = await service.list(pageQuery, bookFilterDto, sortDto);

      expect(books).toBeDefined();
      expect(books.items).toBeInstanceOf(Array);
      expect(books.items.length).toBeGreaterThan(0);

      books.items.forEach((book) => {
        expect(book.genres).toBeInstanceOf(Array);
        expect(book.genres.length).toBeGreaterThan(0);

        book.genres.forEach((genre) => {
          expect(genre.name).toMatch(/^Fantasy/);
        });
      });
    });

    it('should filter with isbn', async () => {
      bookFilterDto.isbn = '978-1-57731-152-2';
      const books = await service.list(pageQuery, bookFilterDto, sortDto);

      expect(books).toBeDefined();
      expect(books.items).toBeInstanceOf(Array);
      expect(books.items.length).toBeGreaterThan(0);

      books.items.forEach((book) => {
        expect(book.editions).toBeInstanceOf(Array);
        expect(book.editions.length).toBeGreaterThan(0);

        book.editions.forEach((edition) => {
          expect(edition.isbn).toEqual(bookFilterDto.isbn);
        });
      });
    });
  });
});
