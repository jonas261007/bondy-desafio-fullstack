import { gql } from 'graphql-tag';
import mongoose, { Schema, model } from 'mongoose';

export const typeDefs = gql`
  type Pet {
    id: ID!
    name: String!
    age: Int
    type: String
  }

  type Query {
    pets: [Pet]
  }

  type Mutation {
    addPet(name: String!, age: Int, type: String): Pet
  }
`;

// Modelo Mongoose
const petSchema = new Schema({
  name: String,
  age: Number,
  type: String,
});

const Pet = model('Pet', petSchema);

export const resolvers = {
  Query: {
    pets: async () => await Pet.find(),
  },
  Mutation: {
    addPet: async (_: any, { name, age, type }: any) => {
      const newPet = new Pet({ name, age, type });
      await newPet.save();
      return newPet;
    },
  },
};
