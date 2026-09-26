import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

// декоратор - функция высшего порядка, которая прописывается через @ над нужной функцией/классом
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query()
    {
      page,
      pageSize,
      orderBy,
    }: {
      page: number;
      pageSize: number;
      orderBy: string;
    },
  ) {
    return this.productsService.findAll(page, pageSize, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // загрузка файлов
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${randomUUID()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 1024 }
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: `uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
