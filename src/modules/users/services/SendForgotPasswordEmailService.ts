import "reflect-metadata";
import path from 'path';

import { injectable, inject } from 'tsyringe';
// import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokenRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}
@injectable()
export default class SendForgotPasswordEmailService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokenRepository,
  ) {}
  
  public async execute({email}: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    
    if(!user) {
      throw new AppError('User does not exists');
    }

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`
        },
      },
    });
  }
}