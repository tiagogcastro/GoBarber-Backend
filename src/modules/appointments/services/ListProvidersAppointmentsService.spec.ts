import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppontimentRepository';

import ListProvidersAppointments from './ListProvidersAppointmentsService';

let fakeAppontimentRepository: FakeAppointmentsRepository;
let listProvidersAppointments: ListProvidersAppointments;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersAppointments', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeAppontimentRepository = new FakeAppointmentsRepository();
    listProvidersAppointments = new ListProvidersAppointments(fakeAppontimentRepository, fakeCacheProvider);
  });
  
  it('Should be able to list the appointments on a specific day', async () => {
    
    const appointment1 = await fakeAppontimentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 4, 20, 14, 0, 0)
    });

    const appointment2 = await fakeAppontimentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 4, 20, 15, 0, 0)
    });

    const appointments = await listProvidersAppointments.execute({
      provider_id: 'provider',
      year: 2021,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});