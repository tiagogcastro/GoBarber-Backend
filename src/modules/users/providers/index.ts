import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

export default container.registerSingleton<IHashProvider>(
  'HashProvider',
  BCryptHashProvider
);