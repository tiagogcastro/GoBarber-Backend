import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  provider_id: string;
  date: Date;
  user_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({provider_id, date, user_id}: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if(isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointments on a past date.");
    }

    if(user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.")
    }

    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("You can only create appointments between 8am an 5pm");
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

    if(findAppointmentInSameDate) {
      throw new AppError("This appointment is already booked.");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id
    });

    return appointment;

  }
}

export default CreateAppointmentService;