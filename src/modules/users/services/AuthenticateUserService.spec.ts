import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    
    authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('Should be able to authenticate', async () => {
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
    expect(authenticateUser.execute({
      email: 'teste@example.com',
      password: "teste123"
    })).rejects.toBeInstanceOf(AppError);

  });

  it('Should not be able to authenticate with wrong password', async () => {
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