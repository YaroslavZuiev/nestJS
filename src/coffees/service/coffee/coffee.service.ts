import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { DataSource } from 'typeorm/data-source/DataSource';

import { CoffeeEntity } from '../../entities/coffee.entity/coffee.entity';
import { CreateCoffeeDto } from '../../dto/create-coffee.dto/create-coffee.dto';
import { Flavor } from '../../entities/flavor.entity/flavor.entity';
import { UpdateCoffeeDto } from '../../dto/update-coffee.dto/update-coffee.dto';
import { PaginationDto } from '../../dto/pagination.dto/pagination.dto';
import { Event } from '../../events/event.entity/event.entity';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(CoffeeEntity)
    private readonly coffeeRepository: Repository<CoffeeEntity>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: DataSource,
  ) {}

  public async findAll(pagination: PaginationDto) {
    const { take, skip } = pagination;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip,
      take,
    });
  }

  public async findOne(id: number): Promise<CoffeeEntity | NotFoundException> {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffee) {
      return new NotFoundException('The coffee was not found');
    }
    return coffee;
  }

  public async create(createCoffeeDto: CreateCoffeeDto): Promise<CoffeeEntity> {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return await this.coffeeRepository.save(coffee);
  }

  public async update(
    id: number,
    updateCoffee: UpdateCoffeeDto,
  ): Promise<CoffeeEntity | NotFoundException> {
    const flavors =
      updateCoffee.flavors &&
      (await Promise.all(
        updateCoffee.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffee,
      flavors,
    });
    if (!coffee) {
      return new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  public async remove(id: number): Promise<CoffeeEntity> {
    const coffee = (await this.findOne(id)) as CoffeeEntity;
    return await this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }

  private async recommendCoffee(coffee: CoffeeEntity): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      recommendEvent.name = 'recommended_coffee';

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
