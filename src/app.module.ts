import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './modules/book/book.module';
import { GenreModule } from './modules/genre/genre.module';
import { AuthorModule } from './modules/author/author.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookModule,
    GenreModule,
    AuthorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
