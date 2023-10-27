import { Module } from '@nestjs/common';
import { CoffeeService } from './service/coffee/coffee.service';
import { CoffeesController } from './coffees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeEntity } from './entities/coffee.entity/coffee.entity';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { Event } from './events/event.entity/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoffeeEntity, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [CoffeeService],
})
export class CoffeeModule {}
