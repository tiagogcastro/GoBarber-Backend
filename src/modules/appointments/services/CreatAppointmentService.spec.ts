import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppontimentRepository';

import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('Should be able to create a new appointment', async () => {
    const fakeAppontimentRepository = new FakeAppointmentsRepository();

    const createAppointment = new CreateAppointmentService(fakeAppontimentRepository);

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123414',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123414');
  });

  it('Should not be able to create two appointment on the same time', async () => {
    const fakeAppontimentRepository = new FakeAppointmentsRepository();

    const createAppointment = new CreateAppointmentService(fakeAppontimentRepository);

    const appointmentDate = new Date(2020, 4, 10, 11)

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123414',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123414',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});