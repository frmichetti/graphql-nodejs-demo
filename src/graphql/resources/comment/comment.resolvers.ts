import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../models/CommentModel";
import { handleError } from "../../../utils/utils";
import { RequestedFields } from "../../ast/RequestedFields";

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
        createComment: (parent, {input }, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, {transaction: t})
            }).catch(handleError);
        },
        updateComment: (parent, {id, input }, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(id).then((comment: CommentInstance) => {
                    if (!comment) throw new Error(`Comment with id: ${id} not found!`);
                    return comment.update(input, {transaction: t});
                });
            }).catch(handleError);
        },
        deleteComment: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(id).then((comment: CommentInstance) => {
                    if (!comment) throw new Error(`Comment with id: ${id} not found!`);
                    return comment.destroy({transaction: t}).then(comment => true);
                });
            }).catch(handleError);
        },
    }
}       
      
    

