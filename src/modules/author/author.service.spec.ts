import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { AuthorRepository } from './repository/author.repository';
import { AuthorMapper } from './mapper/author.mapper';
import { PrismaService } from '../../database/prisma.service';

describe('AuthorService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, AuthorService, AuthorRepository, AuthorMapper],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
