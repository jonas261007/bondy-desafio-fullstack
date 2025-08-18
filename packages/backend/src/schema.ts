import { gql } from 'graphql-tag';
import { GraphQLResolveInfo } from 'graphql';

// Tipos GraphQL
export const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Resolvers
export const resolvers = {
  Query: {
    hello: () => 'Hello, Bondy!',
  },
};
