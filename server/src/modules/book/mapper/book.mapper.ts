import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BookDto } from '../dto/book.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookWithRelations } from '../entity/book.entity.typings';

@Injectable()
export class BookMapper {
  /**
   *
   * @param book
   */
  fromEntityToDto(book: BookWithRelations): BookDto {
    const bookDto: BookDto = {
      id: book.id,
      publicationYear: book.publicationYear,
      title: book.title,
      summary: book.summary as any,
      authors: [],
      editions: [],
      genres: [],
    };

    if (book.authors?.length > 0) {
      bookDto.authors = book.authors.map((bookAuthor) => ({
        id: bookAuthor.author.id,
        name: bookAuthor.author.name,
      }));
    }

    if (book.genres?.length > 0) {
      bookDto.genres = book.genres.map((bookGenre) => ({
        id: bookGenre.genre.id,
        name: bookGenre.genre.name,
      }));
    }

    if (book.editions?.length > 0) {
      bookDto.editions = book.editions.map((edition) => ({
        id: edition.id,
        isbn: edition.isbn,
        value: edition.value,
      }));
    }

    return bookDto;
  }

  /**
   *
   * @param books
   */
  fromEntityListToDto(books: BookWithRelations[]): BookDto[] {
    return books.map((book) => this.fromEntityToDto(book));
  }

  /**
   * From dto to BookCreateInput
   * @param createBookDto
   */
  fromCreateDtoToEntity(createBookDto: CreateBookDto): Prisma.BookCreateInput {
    const data = {
      publicationYear: createBookDto.publicationYear,
      summary: createBookDto.summary,
      title: createBookDto.title,
      publisher: createBookDto.publisher,
    } as Prisma.BookCreateInput;

    if (createBookDto.authorIds && createBookDto.authorIds.length > 0) {
      data.authors = {
        create: createBookDto.authorIds.map((authorId) => ({
          author: {
            connect: {
              id: authorId,
            },
          },
        })),
      };
    }

    if (createBookDto.genreIds && createBookDto.genreIds.length > 0) {
      data.genres = {
        create: createBookDto.genreIds.map((genreId) => ({
          genre: {
            connect: {
              id: genreId,
            },
          },
        })),
      };
    }

    if (createBookDto.isbns && createBookDto.isbns.length > 0) {
      data.editions = {
        create: createBookDto.isbns.map((isbn, index) => ({
          isbn,
          value: String(index),
        })),
      };
    }

    return data;
  }

  /**
   *
   * @param id
   * @param updateBookDto
   * @param existingAuthors
   * @param existingGenres
   */
  fromUpdateDtoToEntity(
    id: number,
    updateBookDto: UpdateBookDto,
    existingAuthors: Set<number>,
    existingGenres: Set<number>,
  ): Prisma.BookUpdateInput {
    const updateInput: Prisma.BookUpdateInput = {};

    if (updateBookDto.title) {
      updateInput.title = updateBookDto.title;
    }

    if (updateBookDto.publicationYear) {
      updateInput.publicationYear = updateBookDto.publicationYear;
    }

    if (updateInput.summary) {
      updateInput.summary = updateBookDto.summary;
    }

    if (updateInput.publisher) {
      updateInput.publisher = updateBookDto.publisher;
    }

    if (updateBookDto.authorIds && updateBookDto.authorIds.length > 0) {
      const newAuthors = updateBookDto.authorIds.filter(
        (authorId) => !existingAuthors.has(authorId),
      );
      const deletedAuthors = Array.from(existingAuthors).filter(
        (authorId) => !updateBookDto.authorIds?.includes(authorId),
      );

      updateInput.authors = {
        create: newAuthors.map((authorId) => ({
          authorId,
        })),
        delete: deletedAuthors.map((authorId) => ({
          bookId_authorId: {
            authorId,
            bookId: id,
          },
        })),
      };
    }

    if (updateBookDto.genreIds && updateBookDto.genreIds.length > 0) {
      const newAuthors = updateBookDto.genreIds.filter(
        (genreId) => !existingGenres.has(genreId),
      );
      const deletedGenres = Array.from(existingGenres).filter(
        (genreId) => !updateBookDto.genreIds?.includes(genreId),
      );

      updateInput.genres = {
        create: newAuthors.map((genreId) => ({
          genreId,
        })),
        delete: deletedGenres.map((genreId) => ({
          bookId_genreId: {
            genreId,
            bookId: id,
          },
        })),
      };
    } else if (existingGenres.size > 0) {
      updateInput.genres = {
        delete: Array.from(existingGenres).map((genreId) => ({
          bookId_genreId: {
            genreId,
            bookId: id,
          },
        })),
      };
    }

    return updateInput;
  }
}
