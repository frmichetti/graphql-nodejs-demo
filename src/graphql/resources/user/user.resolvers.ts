import { GraphQLResolveInfo } from "graphql";
import { throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const userResolvers = {

    User: {
        posts: async (parent, {limit = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try{
                const post = await context.db.Post.findAll({
                    where: {author: parent.get('id')},
                    limit: limit,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                });
                return post;
            }catch(error){
                console.error(error);
            }
        }
    },

    Query: {
        users: async (parent, {limit = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                const users = await context.db.User.findAll({
                    limit: limit,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                });
                return users;
            } catch (error) {
                console.error(error);
            }
        },

        user: async (parent, {id}, context: ResolverContext, info: GraphQLResolveInfo) => {

            try {
                id = parseInt(id);

                const user = await context.db.User.findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                });
                throwError(!user, `User with id: ${id} not found!`);
                return user;
            } catch (error) {
                console.error(error);
            }         
        },
        currentUser: compose(...authResolvers)(async (parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                const user = await context.db.User.findById(context.authUser.id);
                throwError(!user, `User with id: ${context.authUser.id} not found!`);
                return user;
            }
            catch (error) {
                console.error(error);
            }
        }),

    },
    Mutation: {
        createUser: async (parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
            try{
                return await context.db.User.create(input);
            }catch(error){
                console.error(error);
            }
        },
        updateUser: compose(...authResolvers)(async (parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
           try {
               const user = await context.db.User.findById(context.authUser.id);
               throwError(!user, `User with id: ${context.authUser.id} not found!`);
               return await user.update(input);
            }
            catch (error) {
                console.error(error);
            }
         }),
         updateUserPassword: compose(...authResolvers)(async (parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                const user = await context.db.User.findById(context.authUser.id);
                throwError(!user, `User with id: ${context.authUser.id} not found!`);
                await user.update(input);
                return !!user;                         
             }
             catch (error) {
                console.error(error);
             }
          }),
          deleteUser: compose(...authResolvers)(async (parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                    const user = await context.db.User.findById(context.authUser.id);
                    throwError(!user, `User with id: ${context.authUser.id} not found!`);
                    user.destroy();
                    return true;
              }
              catch (error) {
                console.error(error);
              }
           
          }),
    }
}