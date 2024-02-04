import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateAuthorDto } from '../src/modules/author/dto/create-author.dto';

describe('AuthorController (e2e)', () => {
  const data: CreateAuthorDto = {
    name: 'Albert Camus',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/authors (POST)', () => {
    it('should create author', () => {
      return request(app.getHttpServer())
        .post('/authors')
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

    // it('should return error on duplicate author', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/authors')
    //     .send(data)
    //     .expect(400);
    //
    //   console.log(response);
    // });
  });

  it('/authors/search (GET)', () => {
    return request(app.getHttpServer())
      .get('/authors/search')
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
