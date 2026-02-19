import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule } from 'src/coffees/coffees.module';
// import { DatabaseTestModule } from 'src/database-test/database-test.module';

@Module({
  imports: [
    CoffeesModule,
    // DatabaseTestModule.register({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'postgres',
    //   // autoLoadEntities: true,
    //   synchronize: true,
    // }),
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
