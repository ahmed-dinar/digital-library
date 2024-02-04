import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ItemListDto,
  PageQueryDto,
  SortDto,
} from '../../common/interfaces/query.interfaces';
import { BookDto, BookFilterDto } from './dto/book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  /**
   * Add a book
   * @param createBookDto
   */
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.create(createBookDto);
  }

  /**
   * List books
   * This API supports pagination, filter and sorting
   *
   * @param pageDto
   * @param filterDto
   * @param sortDto
   */
  @Get('list')
  list(
    @Query() pageDto: PageQueryDto,
    @Query() filterDto: BookFilterDto,
    @Query() sortDto: SortDto,
  ): Promise<ItemListDto<BookDto>> {
    return this.bookService.list(pageDto, filterDto, sortDto);
  }

  /**
   *
   */
  @Post('seed')
  async seed() {
    return await this.bookService.seed();
  }

  /**
   *
   */
  @Post('seed/clear')
  async clearSeed() {
    return await this.bookService.clearSeed();
  }

  /**
   * Get a single book details
   * @param id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bookService.findOne(+id);
  }

  /**
   * Update basic details of a book
   * @param id
   * @param updateBookDto
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return await this.bookService.update(+id, updateBookDto);
  }

  /**
   * Add an author to a book
   * @param id
   * @param authorId
   */
  @Post(':id/author/:authorId')
  async addAuthor(
    @Param('id') id: string,
    @Param('authorId') authorId: string,
  ) {
    return await this.bookService.addAuthor(+id, +authorId);
  }

  /**
   * Delete am author from a book
   * @param id
   * @param authorId
   */
  @Delete(':id/author/:authorId')
  async deleteAuthor(
    @Param('id') id: string,
    @Param('authorId') authorId: string,
  ) {
    return await this.bookService.deleteAuthor(+id, +authorId);
  }

  /**
   * Add a genre to a book
   * @param id
   * @param genreId
   */
  @Post(':id/genre/:genreId')
  async addGenre(@Param('id') id: string, @Param('genreId') genreId: string) {
    return await this.bookService.addGenre(+id, +genreId);
  }

  /**
   * Delete a genre from a book
   * @param id
   * @param genreId
   */
  @Delete(':id/genre/:genreId')
  async deleteGenre(
    @Param('id') id: string,
    @Param('genreId') genreId: string,
  ) {
    return await this.bookService.deleteGenre(+id, +genreId);
  }

  /**
   * Delete a book
   * @param id
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bookService.remove(+id);
  }
}
