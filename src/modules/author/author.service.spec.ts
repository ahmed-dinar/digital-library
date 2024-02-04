import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { AuthorRepository } from './repository/author.repository';
import { AuthorMapper } from './mapper/author.mapper';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateAuthorDto } from './dto/create-author.dto';

describe('AuthorService', () => {
  const data: CreateAuthorDto = {
    name: 'Albert Camus',
  };

  let service: AuthorService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, AuthorService, AuthorRepository, AuthorMapper],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create author', async () => {
    await expect(service.create(data)).resolves.not.toThrow();
    await expect(service.delete(data.name)).resolves.not.toThrow();

    const author = await service.create(data);
    expect(author).toBeDefined();
    expect(author).toHaveProperty('id');
    expect(author).toHaveProperty('name');
    expect(author.name).toEqual(data.name);

    await expect(service.delete(data.name)).resolves.not.toThrow();
  });

  it('should throw duplicate error on create duplicate author', async () => {
    await expect(service.create(data)).resolves.not.toThrow();
    await expect(service.create(data)).rejects.toThrow(
      Prisma.PrismaClientKnownRequestError,
    );
    await expect(service.delete(data.name)).resolves.not.toThrow();
  });

  it('should update author', async () => {
    const author = await service.create(data);
    const newName = 'Haruki Murakami';

    await expect(
      service.update(author.id, { name: newName }),
    ).resolves.not.toThrow();

    const newAuthor = await service.search(newName);

    expect(newAuthor).toBeInstanceOf(Array);
    expect(newAuthor.length).toEqual(1);
    expect(newAuthor[0]).toHaveProperty('name');
    expect(newAuthor[0].name).toEqual(newName);

    await expect(service.delete(newName)).resolves.not.toThrow();
  });

  it('should search author', async () => {
    await expect(service.create(data)).resolves.not.toThrow();

    const authors = await service.search('alb');

    expect(authors).toBeInstanceOf(Array);
    expect(authors.length).toEqual(1);
    expect(authors[0]).toHaveProperty('name');
    expect(authors[0].name).toEqual(data.name);
  });
});
