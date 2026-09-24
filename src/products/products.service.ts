import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(page = 1, pageSize = 2, orderBy = 'id') {
    const [items, total] = await this.productsRepository.findAndCount({
      // сколько элементов пропустить (находясь на 2 странице он будет пропускать первые 2 элемента и возвращать 3 и 4 элементы)
      skip: (page - 1) * pageSize,
      // лимит элементов на странице
      take: pageSize,
      // сортировка по возрастанию(ASC)/убыванию(DESC)
      order: { [orderBy]: 'ASC' },
    });

    return {
      // по ключику items массив элементов
      items,
      // общее кол-во элементов
      total,
      // страница на которой находимся
      page,
      // общее кол-во страниц
      totalPages: Math.ceil(total / pageSize),
    };
  }

  findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  create(createProductDto: CreateProductDto) {
    return this.productsRepository.save(createProductDto);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}
