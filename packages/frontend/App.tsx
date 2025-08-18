import React from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import client from './graphql/client';

const TEST_QUERY = gql`
  query {
    hello
  }
`;

function Content() {
  const { data, loading, error } = useQuery(TEST_QUERY);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return <p>{data.hello}</p>;
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <h1>Frontend conectado ao Backend</h1>
      <Content />
    </ApolloProvider>
  );
}
