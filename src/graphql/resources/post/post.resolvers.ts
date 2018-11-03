import * as graphqlFields from 'graphql-fields'
import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";
import { RequestedFields } from '../../ast/RequestedFields';

export const postResolvers = {

    Post: {
        author: (parent, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.User.findById(parent.get('author')).catch(handleError);
        },
        comments: (parent, {first = 10, offset = 0 }, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: {post: parent.get('id')},
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info)
            }).catch(handleError);
        }
    },

    Query: {
        posts: (parent, {first = 10, offset = 0 }, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
            }).catch(handleError);
        },
        post: (parent, {id}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.Post.findById(id, {
                attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
            })
                    .then((post: PostInstance) => {
                        if (!post) throw new Error(`Post with id: ${id} not found!`);
                        return post;
                    }).catch(handleError);
        },
    },
    Mutation: {
        createPost: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, {transaction: t});
            }).catch(handleError);
        },
        updatePost: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
              return db.Post.findById(id).then((post: PostInstance) => {
                if (!post) throw new Error(`Post with id: ${id} not found!`);
                    return post.update(input, {transaction: t});
              })
            }).catch(handleError);
        },
        deletePost: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
              return db.Post.findById(id).then((post: PostInstance) => {
                if (!post) throw new Error(`Post with id: ${id} not found!`);
                    return post.destroy({transaction: t})
                        .then(post => true)
              })
            }).catch(handleError);
        },
    }
}