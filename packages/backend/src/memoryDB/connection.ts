import mongoose from 'mongoose';
import { UserModel } from '../models/User.js'; // Modelo real
import bcrypt from 'bcrypt';

const userMock = {
  name: 'Usuário teste',
  email: 'desafio@bondy.com.br',
  company: 'Desafio Bondy',
};

export const connection = async () => {
  const connState = mongoose.connection.readyState;
  if (connState !== 1) {
    await mongoose.connect('mongodb+srv://test:99mM35scnc@test.5wrvlov.mongodb.net/', {
      dbName: 'test',
    });

    const userPassword = await bcrypt.hash('123456', 8);
    await UserModel.findOneAndUpdate(
      { email: userMock.email },
      { ...userMock, password: userPassword },
      { upsert: true }
    );
  }
};
