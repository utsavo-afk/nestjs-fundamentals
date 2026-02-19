import { Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  //   providers: [
  //     {
  //       provide: 'CONNECTION',
  //       useValue: new DataSource({
  //         type: 'postgres',
  //         host: 'localhost',
  //         port: 5432,
  //         password: 'postgres',
  //       }),
  //     },
  //   ],
})
export class DatabaseTestModule {
  static register(options: DataSourceOptions) {
    return {
      module: DatabaseTestModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: new DataSource(options),
        },
      ],
    };
  }
}
