import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getHours } from 'date-fns';
import isAfter from 'date-fns/isAfter';

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
export default class ListProviderDayAvailabilityService {
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
    
    const currentDate = new Date(Date.now());
    
    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment => (
        getHours(appointment.date) === hour
      ));

      // 2021-05-20 08:00:00
      const compareDate = new Date(year, month -1, day, hour);
      
      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}