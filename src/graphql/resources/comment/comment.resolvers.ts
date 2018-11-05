import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../models/CommentModel";
import { handleError, throwError } from "../../../utils/utils";
import { RequestedFields } from "../../ast/RequestedFields";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";

export const commentResolvers = {
    Comment: {
        user: (parent, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
                return db.User.findById(parent.get('user')).catch(handleError);
            },
        post: (parent, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.Post.findById(parent.get('post')).catch(handleError);
        },    
    },
        

    Query: {
        commentsByPost: (parent, {postId, first = 10, offset = 0 }, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            postId = parseInt(postId);
            return db.Comment.findAll({
                where: {post: postId},
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info)
            }).catch(handleError);
        }
    },

    Mutation: {
        createComment: compose(...authResolvers)((parent, {input }, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            input.user = authUser.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, {transaction: t})
            }).catch(handleError);
        }),
        updateComment: compose(...authResolvers)((parent, {id, input }, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(id).then((comment: CommentInstance) => {
                    throwError(!comment, `Comment with id: ${id} not found!`);
                    throwError(comment.get('user') != authUser.id, 'Unauthorized! You can only edit comment by yourself!');
                    input.user = authUser.id;
                    return comment.update(input, {transaction: t});
                });
            }).catch(handleError);
        }),
        deleteComment: compose(...authResolvers)((parent, {id}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(id).then((comment: CommentInstance) => {
                    throwError(!comment, `Comment with id: ${id} not found!`);
                    throwError(comment.get('user') != authUser.id, 'You can only delete Comments created by yourself!');
                    return comment.destroy({transaction: t}).then(comment => true);
                });
            }).catch(handleError);
        }),
    }
}       
      
    

