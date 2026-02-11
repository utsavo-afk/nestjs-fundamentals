import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { FindCoffeesDto } from './dto/find-coffees.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}
  // @Get()
  // findAll(@Res() res) {
  //   // return 'This action returns all coffees';
  //   // res.status(200).send({ message: 'This action returns all coffees' });
  //   res.status(200).send('This action returns all coffees');
  // }
  @Get()
  findAll(@Query() query: FindCoffeesDto) {
    const { limit, offset } = query;
    return this.coffeeService.findAll(Number(limit), Number(offset));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeeService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeeService.create(dto);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() dto: UpdateCoffeeDto) {
    // return `This action updates coffee ID ${id} with ${JSON.stringify(body)}`;
    return this.coffeeService.updateOne(Number(id), dto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    // return `This action removes coffee ID ${id}`;
    return this.coffeeService.remove(Number(id));
  }
}
