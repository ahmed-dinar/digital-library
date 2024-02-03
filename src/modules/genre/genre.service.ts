import { HttpStatus, Injectable } from '@nestjs/common';
import { Genre, Prisma } from '@prisma/client';

import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { APIException } from '../../common/exception/api.exception';
import { GenreRepository } from './repository/genre.repository';
import { GenreMapper } from './mapper/genre.mapper';
import { GenreDto } from './dto/genre.dto';
import {
  PageQueryDto,
  PaginationDto,
} from '../../common/interfaces/query.interfaces';

@Injectable()
export class GenreService {
  constructor(
    private genreRepository: GenreRepository,
    private genreMapper: GenreMapper,
  ) {}

  /**
   *
   * @param createGenreDto
   */
  async create(createGenreDto: CreateGenreDto): Promise<GenreDto> {
    const genreCreateInput: Prisma.GenreCreateInput =
      this.genreMapper.fromCreateDtoToEntity(createGenreDto);

    const genre = await this.genreRepository.save(genreCreateInput);

    return this.genreMapper.fromEntityToDto(genre);
  }

  /**
   *
   * @param id
   * @param updateGenreDto
   */
  async update(id: number, updateGenreDto: UpdateGenreDto) {
    let genre = await this.getById(id);

    if (updateGenreDto.name) {
      genre = await this.genreRepository.update(id, {
        name: updateGenreDto.name,
      });
    }

    return this.genreMapper.fromEntityToDto(genre);
  }

  /**
   *
   * @param pageDto
   */
  async list(pageDto: PageQueryDto) {
    const genres = await this.genreRepository.list(pageDto.page, pageDto.limit);

    return {
      items: this.genreMapper.fromEntityListToDto(genres.items),
      pagination: PaginationDto.ofPage(pageDto, genres.count),
    };
  }

  /**
   *
   * @param text
   */
  async search(text: string): Promise<GenreDto[]> {
    const genres = await this.genreRepository.findByName(text);
    return this.genreMapper.fromEntityListToDto(genres);
  }

  private async getById(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findById(id);

    if (!genre) {
      throw new APIException(
        'No genre found of id ' + id,
        HttpStatus.NOT_FOUND,
      );
    }

    return genre;
  }
}
