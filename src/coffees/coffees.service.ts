import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Sipwreck Co',
      brand: 'Buddy brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll(limit: number, offset: number) {
    return this.coffees.slice(offset, offset + limit);
  }

  findOne(id: number) {
    const coffee = this.coffees.find((c) => c.id === id);
    if (!coffee) {
      // throw new HttpException(
      //   `Coffee with ID ${id} not found`,
      //   HttpStatus.NOT_FOUND,
      // );
      throw new NotFoundException(`Coffee with ID ${id} not found.`);
    }
    return coffee;
  }

  create(dto: CreateCoffeeDto) {
    this.coffees.push({ id: this.coffees.length + 1, ...dto });
  }

  updateOne(id: number, dto: UpdateCoffeeDto) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      const updatedCoffee = { ...existingCoffee, ...dto };
      return this.coffees.map((c) => (c.id === id ? updatedCoffee : c));
    }
  }

  remove(id: number) {
    this.coffees.filter((c) => c.id !== id);
  }
}
