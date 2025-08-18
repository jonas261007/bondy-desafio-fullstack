import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_PETS = gql`
  query GetPets {
    pets {
      id
      name
      age
      type
    }
  }
`;

const ADD_PET = gql`
  mutation AddPet($name: String!, $age: Int, $type: String) {
    addPet(name: $name, age: $age, type: $type) {
      id
      name
      age
      type
    }
  }
`;

const App = () => {
  const { data, refetch } = useQuery(GET_PETS);
  const [addPet] = useMutation(ADD_PET);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | undefined>();
  const [type, setType] = useState('');

  const handleAddPet = async () => {
    await addPet({ variables: { name, age, type } });
    refetch();
  };

  return (
    <div>
      <h1>Pets</h1>
      <ul>
        {data?.pets?.map((pet: any) => (
          <li key={pet.id}>
            {pet.name} - {pet.age} anos - {pet.type}
          </li>
        ))}
      </ul>

      <h2>Adicionar Pet</h2>
      <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        placeholder="Idade"
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <input placeholder="Tipo" value={type} onChange={(e) => setType(e.target.value)} />
      <button onClick={handleAddPet}>Adicionar</button>
    </div>
  );
};

export default App;
