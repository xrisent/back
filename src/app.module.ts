import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    ProductsModule,
    // подключение к базе данных
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5452,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [Product],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
