import * as express from 'express';
import * as graphqlHTTP from 'express-graphql'

import schema from './graphql/schema';
import db from './models'
import { RequestedFields } from './graphql/ast/RequestedFields';
import { DataLoaderFactory } from './graphql/dataloaders/DataLoaderFactory';
import { extractJwtMiddleware } from './middlewares/extract-jwt.middleware';

class App {
     public express: express.Application;
     private dataLoaderFactory: DataLoaderFactory;
     private requestedFields: RequestedFields;

     constructor(){
         this.express = express();
         this.init();
     }

     private init(){
        this.requestedFields = new RequestedFields();
        this.dataLoaderFactory = new DataLoaderFactory(db);
        this.middleware();
     }

     private middleware(): void {

        // this.express.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        //        res.send({hello: 'hello world!'})
        // });

         this.express.use('/graphql', 

         extractJwtMiddleware(),

            (req, res, next) => {
                req['context']['db'] = db;
                req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders();
                req['context']['requestedFields'] = this.requestedFields;
                next();
            },

            graphqlHTTP((req) => ({
                schema: schema,
                graphiql: true,
                context: req['context']
            }))
         );

         
     
    }
}
    export default new App().express;