import typeDefsIndex from '../typeDefs/index.js';
import mutationDefs from '../typeDefs/mutation.js';
import resolvers from '../graphql/resolvers/index.js';
import { connection } from '../memoryDB/connection.js';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { buildSubgraphSchema } from '@apollo/subgraph';
import type { APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';

const { NODE_ENV = 'local' } = process.env;

const typeDefs = [
  ...(Array.isArray(typeDefsIndex) ? typeDefsIndex : [typeDefsIndex]),
  ...(Array.isArray(mutationDefs) ? mutationDefs : [mutationDefs]),
];

const schema = buildSubgraphSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginInlineTraceDisabled()],
  includeStacktraceInErrorResponses: true,
  status400ForVariableCoercionErrors: true,
  introspection: true,
});

const buildContext = async (event: APIGatewayProxyEvent, context: LambdaContext) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(`Connected in ${NODE_ENV} environment`);
  await connection();

  return {
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  };
};

export { apolloServer, buildContext };
