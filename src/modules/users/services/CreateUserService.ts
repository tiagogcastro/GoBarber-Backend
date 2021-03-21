import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}
export default class CreateUserService {
  constructor (
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