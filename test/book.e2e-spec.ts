import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CreateBookDto } from '../src/modules/book/dto/create-book.dto';
import * as seedData from '../src/modules/book/seed/book-seed.json';
import { AllExceptionsFilter } from '../src/common/filters/exeception-filters/all-exception-filter';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

describe('BookController (e2e)', () => {
  const data: CreateBookDto = {
    title: seedData[0].title,
    publicationYear: seedData[0].publicationYear,
    summary: seedData[0].summary,
  };

  let bookId: any = null;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors();

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
          bookId = body.id;
        });
    });
  });

  describe('/books/:id (GET)', () => {
    it('should get book by id', () => {
      return request(app.getHttpServer())
        .get('/books/' + bookId)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('title');
          expect(body.title).toEqual(data.title);
        });
    });

    it('should throw 404 error invalid id', async () => {
      const response = await request(app.getHttpServer())
        .get('/books/' + 121313)
        .expect(404);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('No book found');
    });
  });
});
