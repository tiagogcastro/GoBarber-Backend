import AppError from '@shared/errors/AppError';

import ResetPasswordService from './ResetPasswordService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    
    resetPassword = new ResetPasswordService (fakeUsersRepository, fakeUserTokensRepository);
  });

  it('Should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@example.com',
      password: '123456'
    })

    const {token} = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
  });
});

// Hash
// 2h de expiração
// user e userToken inexistente