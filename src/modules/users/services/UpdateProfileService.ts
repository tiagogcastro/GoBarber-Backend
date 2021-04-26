import { injectable, inject } from 'tsyringe';

import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfile {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  
  public async execute({ user_id, name, email, password, old_password}: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('Você precisa está logado para atualizar o perfil', 401);
    }

    const userWithUpdatedEmail =  await this.usersRepository.findByEmail(email);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Este e-mail já existe');
    }

    if(password && !old_password) {
      throw new AppError('Você precisa informar sua senha antiga para atualizar sua senha');
    }
  
    if(password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError('Old password not matched');
      }
  
      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}