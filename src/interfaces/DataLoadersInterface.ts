import * as DataLoader from 'dataloader';
import { PostInstance } from '../models/PostModel';
import { UserInstance } from '../models/UserModel';

export interface DataLoaders {
    postLoader: DataLoader<number, PostInstance>;
    userLoader: DataLoader<number, UserInstance>;
}