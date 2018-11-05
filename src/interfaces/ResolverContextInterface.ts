import { DbConnection } from "./DbConnectionInterface";
import { DataLoaders } from "./DataLoadersInterface";
import { RequestedFields } from "../graphql/ast/RequestedFields";
import { AuthUser } from "./AuthUserInterface";

export interface ResolverContext {
    db?: DbConnection;
    authorization?: string;
    authUser?: AuthUser;
    dataloaders?: DataLoaders;
    requestedFields?: RequestedFields;
}