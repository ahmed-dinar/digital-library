import {HttpStatus, Injectable, Logger} from '@nestjs/common';

import {CreateAuthorDto} from './dto/create-author.dto';
import {UpdateAuthorDto} from './dto/update-author.dto';
import {AuthorDto} from './dto/author.dto';
import {AuthorRepository} from './repository/author.repository';
import {AuthorMapper} from './mapper/author.mapper';
import {Author, Prisma} from '@prisma/client';
import {APIException} from '../../common/exception/api.exception';
import {PageQueryDto, PaginationDto} from "../../common/interfaces/query.interfaces";

@Injectable()
export class AuthorService {
  private readonly logger = new Logger(AuthorService.name);

  constructor(
    private authorRepository: AuthorRepository,
    private authorMapper: AuthorMapper,
  ) {
  }

  /**
   *
   * @param createAuthorDto
   */
  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorDto> {
    this.logger.log('Creating new author...');

    const authorData: Prisma.AuthorCreateInput =
      this.authorMapper.fromCreateDtoToEntity(createAuthorDto);

    const author = await this.authorRepository.save(authorData);

    return this.authorMapper.fromEntityToDto(author);
  }

  /**
   *
   * @param id
   * @param updateAuthorDto
   */
  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    let author = await this.getById(id);

    if (updateAuthorDto.name) {
      author = await this.authorRepository.update(id, {
        name: updateAuthorDto.name,
      });
    }

    return this.authorMapper.fromEntityToDto(author);
  }

  /**
   *
   * @param pageDto
   */
  async list(pageDto: PageQueryDto) {
    const authors = await this.authorRepository.list(pageDto.page, pageDto.limit);

    return {
      items: this.authorMapper.fromEntityListToDto(authors.items),
      pagination: PaginationDto.ofPage(pageDto, authors.count),
    };
  }

  /**
   * Search prefix
   * @param text
   */
  async search(text: string): Promise<AuthorDto[]> {
    const authors = await this.authorRepository.findByName(text);
    return this.authorMapper.fromEntityListToDto(authors);
  }

  /**
   *
   * @param name
   */
  async delete(name: string): Promise<void> {
    await this.authorRepository.deleteByName(name);
  }

  private async getById(id: number): Promise<Author> {
    const author = await this.authorRepository.findById(id);

    if (!author) {
      throw new APIException(
        'No author found of id ' + id,
        HttpStatus.NOT_FOUND,
      );
    }

    return author;
  }
}
