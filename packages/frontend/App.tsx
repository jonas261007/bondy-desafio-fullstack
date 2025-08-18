import React, { useState, useEffect } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// --- Configuração Apollo com Auth ---
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// --- Queries e Mutations ---
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      name
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// --- Componentes ---
const UsersList = () => {
  const { data, loading, error, refetch } = useQuery(GET_USERS);

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro ao carregar usuários: {error.message}</p>;

  return (
    <div>
      <h1>Usuários</h1>
      <button onClick={() => refetch()}>Atualizar</button>
      <ul>
        {data?.users?.map((user: any) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [login] = useMutation(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login({ variables: { email, password } });
      const token = response.data.login.token;
      localStorage.setItem('token', token);
      onLogin();
    } catch (err: any) {
      alert('Erro no login: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

const AppContent = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Mantém login ao recarregar a página
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true);
    }
  }, []);

  return loggedIn ? (
    <UsersList />
  ) : (
    <LoginForm onLogin={() => setLoggedIn(true)} />
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <AppContent />
  </ApolloProvider>
);

export default App;
