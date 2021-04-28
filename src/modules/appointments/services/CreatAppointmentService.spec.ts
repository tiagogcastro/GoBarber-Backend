import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppontimentRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppontimentRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppontimentRepository = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(fakeAppontimentRepository);
  })
  it('Should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123414',
      user_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123414');
  });

  it('Should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11)

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123414',
      user_id: '123123',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123414',
        user_id: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});