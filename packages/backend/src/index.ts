import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema.js';
import { connection } from './memoryDB/connection.js';

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await connection();
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`🚀 Servidor rodando em ${url}`);
}

startServer();
