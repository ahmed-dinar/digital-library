import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorMapper } from './mapper/author.mapper';
import { AuthorRepository } from './repository/author.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AuthorController],
  providers: [PrismaService, AuthorService, AuthorRepository, AuthorMapper],
})
export class AuthorModule {}
