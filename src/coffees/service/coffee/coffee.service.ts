import { Injectable } from '@nestjs/common';
import { CoffeeEntity } from '../../entities/coffee.entity';

@Injectable()
export class CoffeeService {
  private coffees: CoffeeEntity[] = [
    {
      id: 1,
      name: 'Latte',
      brand: 'StarBacks',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  public findAll() {
    return this.coffees;
  }

  public findOne(id: number) {
    return this.coffees.find((item) => item.id === id);
  }

  public create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  public update(id: number, body) {
    const coffee = this.findOne(id);
    if (coffee) {
      //update
    }
  }

  public remove(id: number) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
