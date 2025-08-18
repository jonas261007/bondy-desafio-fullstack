import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema';
import mongoose from 'mongoose';

const PORT = Number(process.env.PORT) || 4000;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bondy')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Erro ao conectar MongoDB', err));

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, { listen: { port: PORT } }).then(({ url }) => {
  console.log(`🚀 Server running at ${url}`);
});
