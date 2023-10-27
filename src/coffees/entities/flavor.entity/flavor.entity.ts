import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoffeeEntity } from '../coffee.entity/coffee.entity';

@Entity() //sql table === flavor
export class Flavor {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @ManyToMany((type) => CoffeeEntity, (coffee) => coffee.flavors)
  coffees: CoffeeEntity[];
}
