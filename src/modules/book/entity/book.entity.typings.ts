import { Prisma } from '@prisma/client/default';

/**
 * Prisma does not generate type with relations
 */
export type BookWithRelations = Prisma.BookGetPayload<{
  include: {
    authors: {
      include: {
        author: true;
      };
    };
    genres: {
      include: {
        genre: true;
      };
    };
    editions: true;
  };
}>;
