import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";
import { RequestedFields } from "../../ast/RequestedFields";

export const userResolvers = {

    User: {
        posts: (parent, {first = 10, offset = 0 }, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
           return db.Post.findAll({
               where: {author: parent.get('id')},
               limit: first,
               offset: offset,
               attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
           }).catch(handleError);
        }
    },

    Query: {
        users: (parent, {first = 10, offset = 0 }, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.User.findAll({
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
            }).catch(handleError);
        },
        user: (parent, {id}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.User.findById(id, {
                attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
            })
            .then((user: UserInstance) => {
                if (!user) throw new Error(`User with id: ${id} not found!`);
                return user;
            }).catch(handleError);
        }

    },
    Mutation: {
        createUser: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
           return db.sequelize.transaction((t: Transaction) => {
               return db.User.create(input, {transaction: t});
           }).catch(handleError);
        },
        updateUser: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
           id = parseInt(id);
           return db.sequelize.transaction((t: Transaction) => {
               return db.User.findById(id)
                        .then((user: UserInstance) => {
                            if (!user) throw new Error(`User with id: ${id} not found!`);
                            return user.update(input, {transaction: t});
                        });
           }).catch(handleError);
         },
         updateUserPassword: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id)
                         .then((user: UserInstance) => {
                             if (!user) throw new Error(`User with id: ${id} not found!`);
                             return user.update(input, {transaction: t})
                             .then((user: UserInstance) => !!user);
                         });
            }).catch(handleError);
          },
          deleteUser: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id).then((user: UserInstance) => {
                    if (!user) throw new Error(`User with id: ${id} not found!`);
                    return user.destroy({transaction: t})
                        .then(user => true);
                });
            }).catch(handleError);
           
          },
    }
}