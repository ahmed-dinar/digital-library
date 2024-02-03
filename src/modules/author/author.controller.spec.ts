import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { PrismaService } from '../../database/prisma.service';
import { AuthorRepository } from './repository/author.repository';
import { AuthorMapper } from './mapper/author.mapper';

describe('AuthorController', () => {
  let controller: AuthorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [PrismaService, AuthorService, AuthorRepository, AuthorMapper],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
