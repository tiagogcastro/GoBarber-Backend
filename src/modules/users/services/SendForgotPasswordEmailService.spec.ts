import AppError from '@shared/errors/AppError';

import SendForgotPasswordEmail from './SendForgotPasswordEmailService';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    
    sendForgotPasswordEmail = new SendForgotPasswordEmail (fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
  });

  it('Should be able to recover the password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    
    await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@example.com',
      password: '123456'
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover a non-existing user password', async () => {
    expect(
      sendForgotPasswordEmail.execute({
      email: 'teste@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Shoud generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
    
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@example.com',
      password: '123456'
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });

});