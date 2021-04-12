import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('Should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    
    const authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: "John Doe",
      email: 'teste@example.com',
      password: "teste123"
    });

    const response = await authenticateUser.execute({
      email: 'teste@example.com',
      password: "teste123"
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate with non existing user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

    expect(authenticateUser.execute({
      email: 'teste@example.com',
      password: "teste123"
    })).rejects.toBeInstanceOf(AppError);

  });

  it('Should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    
    const authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

    await createUser.execute({
      name: "John Doe",
      email: 'teste@example.com',
      password: "teste123"
    });
    
    await expect(authenticateUser.execute({
      email: 'teste@example.com',
      password: "wrong-password"
    })).rejects.toBeInstanceOf(AppError);
  });
});