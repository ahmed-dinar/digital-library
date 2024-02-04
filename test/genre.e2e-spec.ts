import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateGenreDto } from '../src/modules/genre/dto/create-genre.dto';

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
