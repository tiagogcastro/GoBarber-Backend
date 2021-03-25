import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUserRepository);

    const user = await createUser.execute({
      name: 'Teste name',
      email: 'teste@example.com',
      password: "teste123"
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a new user with same email from another', async () => {
    const fakeUserRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUserRepository);

    await createUser.execute({
      name: 'Teste name',
      email: 'teste@example.com',
      password: "teste123"
    });

    expect(
      await createUser.execute({
        name: 'Teste name',
        email: 'teste@example.com',
        password: "teste123"
      })
    ).rejects.toBeInstanceOf(AppError);

  });
});