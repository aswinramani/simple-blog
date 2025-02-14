
import { DataSource } from 'typeorm';
import { Post } from './post.entity';
import { constants } from '../shared/constants';

export const postProviders = [
  {
    provide: constants.POST_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
    inject: ['DATA_SOURCE'],
  },
];
