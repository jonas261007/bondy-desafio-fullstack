import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    name: String!
    email: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    login(email: String!, password: String!): User
  }
`;

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
  Mutation: {
    login: (_: any, { email, password }: { email: string; password: string }) => {
      if (email === "teste@bondy.com" && password === "1234") {
        return { name: "Jonas Ramos", email };
      }
      throw new Error("Credenciais inválidas");
    },
  },
};
