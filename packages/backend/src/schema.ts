import { gql } from 'graphql-tag';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from './models/User.js';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(name: String!, email: String!, password: String!): AuthPayload!
  }
`;

export const resolvers = {
  Query: {
    users: async () => await UserModel.find(),
  },
  Mutation: {
    register: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
      const existing = await UserModel.findOne({ email });
      if (existing) throw new Error('Usuário já existe');

      const hashed = await bcrypt.hash(password, 8);
      const user = new UserModel({ name, email, password: hashed });
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });

      return { token, user };
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Usuário não encontrado');

  if (!user.password) throw new Error('Senha não definida para este usuário');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Senha incorreta');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '1h' }
  );

  return { token, user };
},
  },
};
