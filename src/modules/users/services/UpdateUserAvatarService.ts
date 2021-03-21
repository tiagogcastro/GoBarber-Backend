import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}
export default class UpdateUserAvatarService {
  constructor (
    private usersRepository: IUsersRepository
  ) {}
  
  public async execute({ user_id, avatarFilename}: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('Only authenticate users can change avatar.', 401);
    }

    if(user.avatar) {
      // Deletar avatar appointmentsRepository
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      // Verificar se ele existe
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if(userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await this.usersRepository.save(user);

    return user;

  }
}