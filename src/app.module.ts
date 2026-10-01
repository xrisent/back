import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    UsersModule,
    // подключение к базе данных
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5452,
      username: 'postgres',
      password: process.env.BD_PASSWORD,
      database: 'postgres',
      entities: [Product, User],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
