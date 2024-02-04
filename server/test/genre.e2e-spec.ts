import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CreateGenreDto } from '../src/modules/genre/dto/create-genre.dto';
import { AllExceptionsFilter } from '../src/common/filters/exeception-filters/all-exception-filter';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

describe('GenreController (e2e)', () => {
  const data: CreateGenreDto = {
    name: 'Fantasy',
  };

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

  describe('/genres (POST)', () => {
    it('should create genre', () => {
      return request(app.getHttpServer())
        .post('/genres')
        .send(data)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('name');
          expect(body.name).toEqual(data.name);
        });
    });

    it('should return error on duplicate genre', async () => {
      const response = await request(app.getHttpServer())
        .post('/genres')
        .send(data)
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already exists');
    });
  });

  it('/genres/search (GET)', () => {
    return request(app.getHttpServer())
      .get('/genres/search')
      .query({
        text: data.name,
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toEqual(1);
        expect(body[0]).toHaveProperty('name');
        expect(body[0].name).toEqual(data.name);
      });
  });
});
