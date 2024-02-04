import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { PrismaService } from '../../database/prisma.service';
import { GenreRepository } from './repository/genre.repository';
import { GenreMapper } from './mapper/genre.mapper';
import { Prisma } from '@prisma/client';
import { CreateGenreDto } from './dto/create-genre.dto';

describe('GenreService', () => {
  const data: CreateGenreDto = {
    name: 'Fiction',
  };

  let service: GenreService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, GenreService, GenreRepository, GenreMapper],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create genre', async () => {
    await expect(service.create(data)).resolves.not.toThrow();
    await expect(service.delete(data.name)).resolves.not.toThrow();

    const genre = await service.create(data);
    expect(genre).toBeDefined();
    expect(genre).toHaveProperty('id');
    expect(genre).toHaveProperty('name');
    expect(genre.name).toEqual(data.name);

    await expect(service.delete(genre.name)).resolves.not.toThrow();
  });

  it('should throw duplicate error on create duplicate genre', async () => {
    await expect(service.create(data)).resolves.not.toThrow();
    await expect(service.create(data)).rejects.toThrow(
      Prisma.PrismaClientKnownRequestError,
    );
    await expect(service.delete(data.name)).resolves.not.toThrow();
  });

  it('should search genre', async () => {
    await expect(service.create(data)).resolves.not.toThrow();

    const genres = await service.search('fic');

    expect(genres).toBeInstanceOf(Array);
    expect(genres.length).toEqual(1);
    expect(genres[0]).toHaveProperty('name');
    expect(genres[0].name).toEqual(data.name);
  });
});
