import * as jwt from 'jsonwebtoken';
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { JWT_SECRET } from '../../../utils/utils';

export const tokenResolvers = {
    Mutation: {
        createToken: async (parent, {email, password}, {db}: {db: DbConnection}, info) => {
            const user = await db.User.findOne({
                where: { email: email },
                attributes: ['id', 'password']
            });
            let errorMessage: string = 'Unauthorized, wrong email or password!';
            if (!user || !user.isPassword(user.get('password'), password)) {
                throw new Error(errorMessage);
            }
            const payload = { sub: user.get('id') };
            return {
                token: jwt.sign(payload, JWT_SECRET)
            };
        }
    }
}