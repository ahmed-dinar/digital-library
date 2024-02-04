import { ObjectType } from '../../../common/interfaces/types.interfaces';

export type PreSeedItem = {
  title: string;
  publicationYear: number;
  summary: string;
  authors: Set<string>;
  genres: Set<string>;
  isbns: Set<string>;
  publisher: string;
};

export type PreSeedData = {
  titles: string[];
  authors: string[];
  genres: string[];
  items: ObjectType<PreSeedItem>;
};
