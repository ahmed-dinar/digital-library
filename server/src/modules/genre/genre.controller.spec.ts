import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { PrismaService } from '../../database/prisma.service';
import { GenreRepository } from './repository/genre.repository';
import { GenreMapper } from './mapper/genre.mapper';

describe('GenreController', () => {
  let controller: GenreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [PrismaService, GenreService, GenreRepository, GenreMapper],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
