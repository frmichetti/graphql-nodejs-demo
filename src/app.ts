import * as express from 'express';
import * as graphqlHTTP from 'express-graphql'

import schema from './graphql/schema';
import db from './models'

class App {
     public express: express.Application;

     constructor(){
         this.express = express();
         this.middleware();
     }

     private middleware(): void {

        // this.express.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        //        res.send({hello: 'hello world!'})
        // });

         this.express.use('/graphql', 
            (req, res, next) => {
                req['context'] = {};
                req['context'].db = db;
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