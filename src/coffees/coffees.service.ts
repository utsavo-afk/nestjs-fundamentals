import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginaionQueryDto } from 'src/common/dto/paginationQuery.dto';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class CoffeesService {
  private readonly logger = new Logger(CoffeesService.name);
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly conn: DataSource,
  ) {}
  // private coffees: Coffee[] = [
  //   {
  //     id: 1,
  //     name: 'Sipwreck Co',
  //     brand: 'Buddy brew',
  //     flavors: ['chocolate', 'vanilla'],
  //   },
  // ];

  findAll(query: PaginaionQueryDto) {
    const { limit, offset } = query;
    // return this.coffees.slice(offset, offset + limit);
    return this.coffeeRepository.find({
      skip: offset,
      take: limit,
      relations: ['flavors'],
    });
  }

  async findOne(id: number) {
    const _found = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    // const coffee = this.coffees.find((c) => c.id === id);
    if (!_found) {
      // throw new HttpException(
      //   `Coffee with ID ${id} not found`,
      //   HttpStatus.NOT_FOUND,
      // );
      throw new NotFoundException(`Coffee with ID ${id} not found.`);
    }
    return _found;
  }

  async create(dto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      dto.flavors?.map((name) => this.preloadFlavorByName(name)) || [],
    );
    const _new = this.coffeeRepository.create({ ...dto, flavors });
    return this.coffeeRepository.save(_new);
  }

  async updateOne(id: number, dto: UpdateCoffeeDto) {
    let flavors: Flavor[] = [];
    if (dto.flavors?.length) {
      flavors = await Promise.all(
        dto.flavors?.map((name) => this.preloadFlavorByName(name)) || [],
      );
    }
    const _updated = await this.coffeeRepository.preload({
      id,
      ...dto,
      flavors,
    });

    if (!_updated) {
      throw new NotFoundException(`Coffee #${id} does not exist`);
    }

    return this.coffeeRepository.save(_updated);
  }

  async remove(id: number) {
    return (await this.coffeeRepository.delete({ id })).affected;
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const _found = await this.flavorRepository.findOne({ where: { name } });
    if (_found) {
      return _found;
    }
    return this.flavorRepository.create({ name });
  }
}
