import { DataSource } from 'typeorm';
import { App } from '../entities/App';
import { Image } from '../entities/Image';
import { Developer } from '../entities/Developer';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../data/database.sqlite'),
  entities: [App, Image, Developer],
  synchronize: true, // Set to false in production
  logging: true,
});
