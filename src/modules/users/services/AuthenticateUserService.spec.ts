import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
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
    await fakeUsersRepository.create({
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