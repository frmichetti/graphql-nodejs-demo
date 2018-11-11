import { GraphQLResolveInfo } from "graphql";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const postResolvers = {

    Post: {
        author: (parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.dataloaders.userLoader.load({key: parent.get('author'), info}).catch(handleError);
        },
        comments: async (parent, {limit = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try{
                const comments = await context.db.Comment.findAll({
                    where: {post: parent.get('id')},
                    limit: limit,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info)
                });
                return comments;
            }catch(error){
                console.error(error);
            }
        }
    },

    Query: {
        posts: async (parent, {limit = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            try{
                const posts = await context.db.Post.findAll({
                    limit: limit,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                });
                return posts;
            }catch(error){
                console.error(error);
            }            
        },
        post: async (parent, {id}, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            try {
                const post = await context.db.Post.findById(id, {
                    attributes: context.requestedFields.getFields(info, { keep: ['id'], exclude: ['comments'] })
                });
                throwError(!post, `Post with id: ${id} not found!`);
                return post;
            }
            catch (error) {
                console.error(error);
            }
        },
    },
    Mutation: {
        createPost: compose(...authResolvers)(async (parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
            input.author = context.authUser.id;
            try {
                return await context.db.Post.create(input);
            }
            catch (error) {
                console.error(error);
            }
        }),
        updatePost: compose(...authResolvers)(async (parent, {id, input}, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);

            try{
                const post = await context.db.Post.findById(id);
                throwError(!post, `Post with id: ${id} not found!`);
                throwError(post.get('author') != context.authUser.id, 'Unauthorized! You can only edit posts by yourself!');
                input.author = context.authUser.id;
                return await post.update(input);
                
            }catch(error){
                console.error(error);
            }
         
        }),
        deletePost: compose(...authResolvers)(async (parent, {id}, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            try {
                const post = await context.db.Post.findById(id);
                throwError(!post, `Post with id: ${id} not found!`);
                throwError(post.get('author') != context.authUser.id, 'Unauthorized! You can only delete posts by yourself!');
                await post.destroy();
                return true;                
            }
            catch (error) {
                console.error(error);
            }
        }),
    }
}