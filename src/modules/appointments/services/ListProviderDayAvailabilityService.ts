import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getHours } from 'date-fns';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}
  
  public async execute({ provider_id, year, month, day }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      year,
      month,
      day
    });

    const hourStart = 8;

    const eachHourArray = Array.from(
      {length: 10},
      (value, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment => (
        getHours(appointment.date) === hour
      ));
      return {
        hour,
        available: !hasAppointmentInHour,
      };
    });

    return availability;
  }
}