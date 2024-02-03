import { Injectable } from '@nestjs/common';
import { Author, Prisma } from '@prisma/client';
import { AuthorDto } from '../dto/author.dto';
import { CreateAuthorDto } from '../dto/create-author.dto';

@Injectable()
export class AuthorMapper {
  /**
   *
   * @param authors
   */
  fromEntityListToDto(authors: Author[]): AuthorDto[] {
    if (!authors || authors.length == 0) {
      return [];
    }
    return authors.map((author) => this.fromEntityToDto(author));
  }

  /**
   *
   * @param author
   */
  fromEntityToDto(author: Author): AuthorDto {
    return {
      id: author.id,
      name: author.name,
    };
  }

  /**
   *
   * @param createAuthorDto
   */
  fromCreateDtoToEntity(
    createAuthorDto: CreateAuthorDto,
  ): Prisma.AuthorCreateInput {
    return { name: createAuthorDto.name };
  }
}
