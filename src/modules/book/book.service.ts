import { HttpStatus, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookRepository } from './repository/book.repository';
import { BookMapper } from './mapper/book.mapper';
import { BookDto, BookFilterDto } from './dto/book.dto';
import { APIException } from '../../common/exception/api.exception';
import {
  ItemListDto,
  PageQueryDto,
  PaginationDto,
  SortDto,
} from '../../common/interfaces/query.interfaces';
import { BookSeeder } from './seed/book.seeder';
import { BookWithRelations } from './entity/book.entity.typings';
import { BookAuthorRepository } from './repository/book-author.repository';
import { BookGenreRepository } from './repository/book-genre.repository';

@Injectable()
export class BookService {
  constructor(
    private bookRepository: BookRepository,
    private bookAuthorRepository: BookAuthorRepository,
    private bookGenreRepository: BookGenreRepository,
    private bookMapper: BookMapper,
    private bookSeeder: BookSeeder,
  ) {}

  /**
   * Add a new Book
   * @param createBookDto
   */
  async create(createBookDto: CreateBookDto): Promise<BookDto> {
    const bookData: Prisma.BookCreateInput =
      this.bookMapper.fromCreateDtoToEntity(createBookDto);

    const book = await this.bookRepository.create(bookData);
    return this.bookMapper.fromEntityToDto(book);
  }

  /**
   *
   */
  async seed() {
    return await this.bookSeeder.seed();
  }

  async clearSeed() {
    return await this.bookSeeder.clear();
  }

  /**
   *
   * @param pageDto
   * @param filterDto
   * @param sortDto
   */
  async list(
    pageDto: PageQueryDto,
    filterDto: BookFilterDto,
    sortDto: SortDto,
  ): Promise<ItemListDto<BookDto>> {
    console.log(pageDto);
    console.log(filterDto);
    console.log(sortDto);

    const res = await this.bookRepository.findAll(pageDto.page, pageDto.limit, {
      filterDto,
      sortDto,
    });

    return {
      items: this.bookMapper.fromEntityListToDto(res.items),
      pagination: PaginationDto.ofPage(pageDto, res.count),
    };
  }

  /**
   * If not found, will throw not found error
   *
   * @param id
   */
  async findOne(id: number): Promise<BookDto> {
    const book = await this.getById(id);
    return this.bookMapper.fromEntityToDto(book);
  }

  /**
   *
   * @param id book id
   * @param updateBookDto Data to patch
   */
  async update(id: number, updateBookDto: UpdateBookDto): Promise<BookDto> {
    const book = await this.getById(id);

    const updateData: Prisma.BookUpdateInput =
      this.bookMapper.fromUpdateDtoToEntity(updateBookDto);

    const updatedBook = await this.bookRepository.update(book.id, updateData);

    return this.bookMapper.fromEntityToDto(updatedBook);
  }

  /**
   *
   * @param id
   * @param authorId
   */
  async addAuthor(id: number, authorId: number): Promise<BookDto> {
    const updateData: Prisma.BookUpdateInput = {
      authors: {
        create: {
          authorId,
        },
      },
    };

    const updatedBook = await this.bookRepository.update(id, updateData);
    return this.bookMapper.fromEntityToDto(updatedBook);
  }

  /**
   *
   * @param id
   * @param authorId
   */
  async deleteAuthor(id: number, authorId: number): Promise<BookDto> {
    await this.bookAuthorRepository.delete(id, authorId);
    const updatedBook = await this.getById(id);
    return this.bookMapper.fromEntityToDto(updatedBook);
  }

  /**
   *
   * @param id
   * @param genreId
   */
  async addGenre(id: number, genreId: number): Promise<BookDto> {
    const updateData: Prisma.BookUpdateInput = {
      genres: {
        create: {
          genreId,
        },
      },
    };

    const updatedBook = await this.bookRepository.update(id, updateData);
    return this.bookMapper.fromEntityToDto(updatedBook);
  }

  /**
   *
   * @param id
   * @param genreId
   */
  async deleteGenre(id: number, genreId: number): Promise<BookDto> {
    await this.bookGenreRepository.delete(id, genreId);
    const updatedBook = await this.getById(id);
    return this.bookMapper.fromEntityToDto(updatedBook);
  }

  /**
   *
   * @param id book id
   */
  async remove(id: number) {
    const book = await this.getById(id);
    await this.bookRepository.delete(book.id);
  }

  /**
   * Find a book by id, if not found throws not found error
   * @param id
   * @private
   */
  private async getById(id: number): Promise<BookWithRelations> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new APIException('No book found of id ' + id, HttpStatus.NOT_FOUND);
    }

    return book;
  }
}
