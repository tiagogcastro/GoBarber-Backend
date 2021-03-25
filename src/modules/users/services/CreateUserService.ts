import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}
@injectable()
export default class CreateUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}
  
  public async execute({ name, email, password }: IRequest): Promise<User> {

    const checkUserExistis = await this.usersRepository.findByEmail(email);

    if(checkUserExistis) {
      throw new AppError(`Email address already user.`);
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

    return user;
  }
}