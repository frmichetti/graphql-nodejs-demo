import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const userResolvers = {

    User: {
        posts: (parent, {first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
           return context.db.Post.findAll({
               where: {author: parent.get('id')},
               limit: first,
               offset: offset,
               attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
           }).catch(handleError);
        }
    },

    Query: {
        users: (parent, {first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User.findAll({
                limit: first,
                offset: offset,
                attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
            }).catch(handleError);
        },

        user: (parent, {id}, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.User.findById(id, {
                attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
            })
            .then((user: UserInstance) => {
                throwError(!user, `User with id: ${id} not found!`);
                return user;
            }).catch(handleError);
        },
        currentUser: compose(...authResolvers)((parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User.findById(context.authUser.id)
            .then((user: UserInstance) => {
                throwError(!user, `User with id: ${context.authUser.id} not found!`);
                return user;
            }).catch(handleError);
        }),

    },
    Mutation: {
        createUser: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
           return db.sequelize.transaction((t: Transaction) => {
               return db.User.create(input, {transaction: t});
           }).catch(handleError);
        },
        updateUser: compose(...authResolvers)((parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
           return context.db.sequelize.transaction((t: Transaction) => {
               return context.db.User.findById(context.authUser.id)
                        .then((user: UserInstance) => {
                            throwError(!user, `User with id: ${context.authUser.id} not found!`);
                            return user.update(input, {transaction: t});
                        });
           }).catch(handleError);
         }),
         updateUserPassword: compose(...authResolvers)((parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.User.findById(context.authUser.id)
                         .then((user: UserInstance) => {
                             throwError(!user, `User with id: ${context.authUser.id} not found!`);
                             return user.update(input, {transaction: t})
                             .then((user: UserInstance) => !!user);
                         });
            }).catch(handleError);
          }),
          deleteUser: compose(...authResolvers)((parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.User.findById(context.authUser.id).then((user: UserInstance) => {
                    throwError(!user, `User with id: ${context.authUser.id} not found!`);
                    return user.destroy({transaction: t})
                        .then(user => true);
                });
            }).catch(handleError);
           
          }),
    }
}