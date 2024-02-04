import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BookRepository } from '../repository/book.repository';
import * as seedData from './book-seed.json';
import { PreSeedData, PreSeedItem } from './book-seed.interfaces';
import { ObjectType } from '../../../common/interfaces/types.interfaces';

@Injectable()
export class BookSeeder {
  constructor(private bookRepository: BookRepository) {}

  /**
   *
   */
  async clear() {
    console.log('Clear seed');
    const seedItems = this.prepareData();
    await this.bookRepository.deleteSeedItems(seedItems);
  }

  /**
   *
   */
  async seed() {
    await this.clear();

    const seedItems = this.prepareData();
    console.log('To seed books: ' + Object.keys(seedItems.items).length);

    const authorSeed = await this.seedAuthor(seedItems);
    const genreSeed = await this.seedGenre(seedItems);
    const isbnList = new Set();

    const newBooks = Object.values(seedItems.items)
      // .filter((item, idx) => idx < 2)
      .map((seedItem: PreSeedItem) => {
        const data = {
          title: seedItem.title,
          publicationYear: seedItem.publicationYear,
          summary: seedItem.summary,
          publisher: seedItem.publisher,
        } as Prisma.BookCreateInput;

        const authorIds = Array.from(seedItem.authors)
          .filter((author) => !!authorSeed[author])
          .map((author) => authorSeed[author]);

        if (authorIds.length > 0) {
          data.authors = {
            create: authorIds.map((authorId) => ({
              author: {
                connect: {
                  id: authorId,
                },
              },
            })),
          };
        }

        const genreIds = Array.from(seedItem.genres)
          .filter((genre) => !!genreSeed[genre])
          .map((genre) => genreSeed[genre]);

        if (genreIds.length > 0) {
          data.genres = {
            create: genreIds.map((genreId) => ({
              genre: {
                connect: {
                  id: genreId,
                },
              },
            })),
          };
        }

        if (seedItem.isbns.size > 0) {
          const uniqueISBNs = Array.from(seedItem.isbns).filter((isbn) => {
            if (isbnList.has(isbn)) {
              return false;
            }
            isbnList.add(isbn);
            return true;
          });

          if (uniqueISBNs.length > 0) {
            data.editions = {
              create: uniqueISBNs.map((isbn, index) => ({
                isbn,
                value: `${String(index)} edition`,
              })),
            };
          }
        }

        return data;
      });

    await Promise.all(
      newBooks.map((newBook) => {
        return this.bookRepository.save(newBook);
      }),
    );

    console.log('Seed books saved: ' + newBooks.length);

    return newBooks.length;
  }

  private async seedAuthor(
    preSeedData: PreSeedData,
  ): Promise<ObjectType<number>> {
    const authorList: Prisma.AuthorCreateInput[] = preSeedData.authors.map(
      (authorName) =>
        ({
          name: authorName,
        }) as Prisma.AuthorCreateInput,
    );

    console.log(authorList.length + ' Authors to seed');

    const createdAuthors = await this.bookRepository.saveManyAuthor(authorList);

    return Object.fromEntries(
      createdAuthors.map((author) => [author.name, author.id]),
    );
  }

  private async seedGenre(
    preSeedData: PreSeedData,
  ): Promise<ObjectType<number>> {
    const genreList: Prisma.GenreCreateInput[] = preSeedData.genres.map(
      (authorName) =>
        ({
          name: authorName,
        }) as Prisma.GenreCreateInput,
    );

    console.log(genreList.length + ' Genres to seed');

    const createdGenres = await this.bookRepository.saveManyGenre(genreList);

    return Object.fromEntries(
      createdGenres.map((genre) => [genre.name, genre.id]),
    );
  }

  private prepareData(): PreSeedData {
    console.log('Preparing seed data ' + seedData.length);

    const seedItems: ObjectType<PreSeedItem> = {};
    const seedDataItems = seedData as any;
    const titleSet = new Set<string>();
    const authorSet = new Set<string>();
    const genreSet = new Set<string>();

    for (const item of seedDataItems) {
      titleSet.add(item.title);
      authorSet.add(item.author);
      genreSet.add(item.genre);

      if (seedItems[item.title]) {
        const savedItem = seedItems[item.title];

        savedItem.authors.add(item.author);
        savedItem.genres.add(item.genre);
        savedItem.isbns.add(item.isbn);

        seedItems[item.title] = savedItem;
      } else {
        const savedItem = { ...item };
        savedItem.authors = new Set();
        savedItem.authors.add(item.author);

        savedItem.genres = new Set();
        savedItem.genres.add(item.genre);

        savedItem.isbns = new Set();
        savedItem.isbns.add(item.isbn);

        delete savedItem.author;
        delete savedItem.genre;
        delete savedItem.isbn;

        seedItems[item.title] = savedItem as PreSeedItem;
      }
    }

    return {
      titles: Array.from(titleSet),
      authors: Array.from(authorSet),
      genres: Array.from(genreSet),
      items: seedItems,
    };
  }
}
