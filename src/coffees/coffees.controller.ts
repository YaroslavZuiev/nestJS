import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeeService } from './service/coffee/coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeeService) {}
  @Get()
  public findAll(@Query() pagination) {
    // const { limit, offset } = pagination;
    return this.coffeeService.findAll();
  }
  @Get(':id')
  public findOne(@Param('id') id: number) {
    const coffee = this.coffeeService.findOne(id);
    if (!coffee) {
      return new NotFoundException('The coffee was not found');
    }
    return coffee;
  }
  @Post()
  public create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.create(createCoffeeDto);
  }
  @Patch(':id')
  public update(
    @Param('id') id: number,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }
  @Delete(':id')
  public remove(@Param('id') id: number) {
    return this.coffeeService.remove(id);
  }
}
