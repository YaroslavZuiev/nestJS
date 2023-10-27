import { DataSource } from 'typeorm/data-source/DataSource';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});
