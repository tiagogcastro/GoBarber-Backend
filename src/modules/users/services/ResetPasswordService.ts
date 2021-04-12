import "reflect-metadata";

import { injectable, inject } from 'tsyringe';
// import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  password: string;
  token: string;
}
@injectable()
export default class ResetPasswordService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokenRepository,
  ) {}
  
  public async execute({password, token}: IRequest): Promise<void> {

    const userToken = await this.userTokensRepository.findByToken(token);

    if(!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if(!user) {
      throw new AppError('User token does not exists');
    }

    user.password = password;

    await this.usersRepository.save(user);

  }
}