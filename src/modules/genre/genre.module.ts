import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { GenreRepository } from './repository/genre.repository';
import { GenreMapper } from './mapper/genre.mapper';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [GenreController],
  providers: [PrismaService, GenreService, GenreRepository, GenreMapper],
})
export class GenreModule {}
