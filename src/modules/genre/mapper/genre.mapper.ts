import { Injectable } from '@nestjs/common';
import { Genre, Prisma } from '@prisma/client';
import { GenreDto } from '../dto/genre.dto';
import { CreateGenreDto } from '../dto/create-genre.dto';

@Injectable()
export class GenreMapper {
  /**
   *
   * @param genres
   */
  fromEntityListToDto(genres: Genre[]): GenreDto[] {
    if (!genres || genres.length == 0) {
      return [];
    }

    return genres.map((genre) => this.fromEntityToDto(genre));
  }

  /**
   *
   * @param genre
   */
  fromEntityToDto(genre: Genre): GenreDto {
    return {
      id: genre.id,
      name: genre.name,
    };
  }

  /**
   *
   * @param createGenreDto
   */
  fromCreateDtoToEntity(
    createGenreDto: CreateGenreDto,
  ): Prisma.GenreCreateInput {
    return { name: createGenreDto.name };
  }
}
