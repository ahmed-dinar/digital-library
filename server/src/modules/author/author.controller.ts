import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import {
  ItemListDto,
  PageQueryDto,
} from '../../common/interfaces/query.interfaces';
import { AuthorDto } from './dto/author.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  /**
   * Create a new author
   * @param createAuthorDto
   */
  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return await this.authorService.create(createAuthorDto);
  }

  /**
   *  List author
   * @param pageDto
   */
  @Get('list')
  async list(@Query() pageDto: PageQueryDto): Promise<ItemListDto<AuthorDto>> {
    return await this.authorService.list(pageDto);
  }

  /**
   * Search author with PREFIX match, Case insensitive
   * @param text
   */
  @Get('search')
  async search(@Query('text') text: string) {
    return await this.authorService.search(text);
  }

  /**
   * Patch an author
   * @param id
   * @param updateAuthorDto
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return await this.authorService.update(+id, updateAuthorDto);
  }
}
