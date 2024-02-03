import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { PrismaService } from '../../database/prisma.service';
import { GenreRepository } from './repository/genre.repository';
import { GenreMapper } from './mapper/genre.mapper';

describe('GenreService', () => {
  let service: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, GenreService, GenreRepository, GenreMapper],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
