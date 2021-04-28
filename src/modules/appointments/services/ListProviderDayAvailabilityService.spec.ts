import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppontimentRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppontimentRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProvidersMonthAvailability', () => {
  beforeEach(() => {
    fakeAppontimentRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppontimentRepository);
  });
  
  it('Should be able to list the day availability from provider', async () => {
    
    await fakeAppontimentRepository.create({
      provider_id: 'user',
      date: new Date(2021, 4, 20, 8, 0, 0)
    });

    await fakeAppontimentRepository.create({
      provider_id: 'user',
      date: new Date(2021, 4, 20, 10, 0, 0)
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2021,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false},
        { hour: 9, available: true},
        { hour: 10, available: false},
        { hour: 11, available: true},
      ])
    );
  });
});