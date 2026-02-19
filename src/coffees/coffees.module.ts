import { Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { DataSource as Connection } from 'typeorm';

// custom provider
// class MockCoffeesService {}

// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}

// we can load more providers here within this Factory Provider
@Injectable()
class CoffeeBrandsFactory {
  create() {
    return ['nescafe', 'bru'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService, // shorthand
    CoffeeBrandsFactory,
    // { provide: COFFEE_BRANDS, useValue: ['nescafe', 'bru'] },
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (coffeeBrandsFactory: CoffeeBrandsFactory) =>
    //     coffeeBrandsFactory.create(),
    //   inject: [CoffeeBrandsFactory],
    // },
    {
      provide: COFFEE_BRANDS,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: async (_conn: Connection): Promise<string[]> => {
        // await conn.query(``)
        return await Promise.resolve(['nescafe', 'bru']);
      },
      inject: [Connection],
    },
    // {
    //   provide: ConfigService,
    //   useClass:
    //     process.env.NODE_ENV === 'development'
    //       ? DevelopmentConfigService
    //       : ProductionConfigService,
    // },
    // {
    //   provide: CoffeesService, // using useValue whenever we call CoffeesService MockCoffeesService will be instantiated, useful for testing!
    //   useValue: new MockCoffeesService(),
    // },
    // {
    //   provide: CoffeesService, // token -> lookup done by IoC i.e module
    //   useClass: CoffeesService, // class -> class injected associated token
    // },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
