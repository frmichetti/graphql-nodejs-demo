import { DbConnection } from "./DbConnectionInterface";
import { DataLoaders } from "./DataLoadersInterface";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export interface ResolverContext {
    db?: DbConnection;
    authorization?: string;
    dataloaders?: DataLoaders;
    requestedFields?: RequestedFields;
}