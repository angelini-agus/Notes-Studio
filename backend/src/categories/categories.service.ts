import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const normalizedName = createCategoryDto.name.trim();
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    const category = this.categoriesRepository.create({
      name: normalizedName,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findManyByIds(ids: string[]): Promise<Category[]> {
    if (!ids.length) {
      return [];
    }

    const categories = await this.categoriesRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (categories.length !== ids.length) {
      throw new NotFoundException('One or more categories were not found');
    }

    return categories;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.remove(category);
  }
}
