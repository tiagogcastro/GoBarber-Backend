import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  
  public async execute({ user_id }: IRequest): Promise<User[]> {
    const user = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    return user;
  }
}