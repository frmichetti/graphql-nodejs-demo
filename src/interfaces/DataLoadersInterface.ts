import * as DataLoader from 'dataloader';
import { UserInstance } from '../models/UserModel';
import { DataLoaderParam } from './DataLoaderParamInterface';
import { PostInstance } from '../models/PostModel';

export interface DataLoaders {
    postLoader: DataLoader<DataLoaderParam<number>, PostInstance>;
    userLoader: DataLoader<DataLoaderParam<number>, UserInstance>;
}