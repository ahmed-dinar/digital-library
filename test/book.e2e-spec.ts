import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateBookDto } from '../src/modules/book/dto/create-book.dto';

describe('BookController (e2e)', () => {
  const data: CreateBookDto = {
    title: 'A Song of Ice and Fire',
    publicationYear: 1990,
    summary: '',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/books (POST)', () => {
    it('should create book without author & genre', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send(data)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('title');
          expect(body.title).toEqual(data.title);
        });
    });
  });
});
