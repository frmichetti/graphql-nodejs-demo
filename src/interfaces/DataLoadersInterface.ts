import * as DataLoader from 'dataloader';
import { UserInstance } from '../models/UserModel';
import { DataLoaderParam } from './DataLoaderParamInterface';

export interface DataLoaders {
    postLoader: DataLoader<DataLoaderParam<number>, UserInstance>;
    userLoader: DataLoader<DataLoaderParam<number>, UserInstance>;
}