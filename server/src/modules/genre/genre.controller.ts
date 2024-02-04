import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import {
  ItemListDto,
  PageQueryDto,
} from '../../common/interfaces/query.interfaces';
import { GenreDto } from './dto/genre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  /**
   *
   * @param createGenreDto
   */
  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  /**
   *  List genres
   * @param pageDto
   */
  @Get('list')
  async list(@Query() pageDto: PageQueryDto): Promise<ItemListDto<GenreDto>> {
    return await this.genreService.list(pageDto);
  }

  /**
   * Search genre with PREFIX match, Case insensitive
   * @param text
   */
  @Get('search')
  async search(@Query('text') text: string) {
    return await this.genreService.search(text);
  }

  /**
   * Update a genre name
   * @param id
   * @param updateGenreDto
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genreService.update(+id, updateGenreDto);
  }
}
