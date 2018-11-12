import { GraphQLResolveInfo } from "graphql";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const commentResolvers = {
    Comment: {
        user: (parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
                return context.dataloaders.userLoader.load({key: parent.get('user'), info }).catch(handleError);
            },
        post: (parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
                return context.dataloaders.postLoader.load({key: parent.get('post'), info }).catch(handleError);
        },    
    },
        

    Query: {
        commentsByPost: async (parent, {postId, limit = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                postId = parseInt(postId);
                const comment = await context.db.Comment.findAll({
                    where: {post: postId},
                    limit: limit,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info)
                });
                return comment;
            } catch (error) {
                console.error(error);
                throwError(true, error.message);
            }
        }
    },

    Mutation: {
        createComment: compose(...authResolvers)(async (parent, { input }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                input.user = context.authUser.id;
                return await context.db.Comment.create(input);
            }
            catch (error) {
                console.error(error);
                throwError(true, error.message);
            }
        }),
        updateComment: compose(...authResolvers)(async (parent, { id, input }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                id = parseInt(id);
                const comment = await context.db.Comment.findById(id);
                throwError(!comment, `Comment with id: ${id} not found!`);
                throwError(comment.get('user') != context.authUser.id, 'Unauthorized! You can only edit comment by yourself!');
                input.user = context.authUser.id;
                return await comment.update(input);
            }
            catch (error) {
                console.error(error);
                throwError(true, error.message);
            }
        }),
        deleteComment: compose(...authResolvers)(async (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try {
                id = parseInt(id);
                const comment = await context.db.Comment.findById(id);
                throwError(!comment, `Comment with id: ${id} not found!`);
                throwError(comment.get('user') != context.authUser.id, 'You can only delete Comments created by yourself!');
                comment.destroy();
                return true;          
            }catch (error) {
                console.error(error);
                throwError(true, error.message);
            }
        }),
    }
}       
      
    

