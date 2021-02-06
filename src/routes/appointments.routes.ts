import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
})

appointmentsRouter.post('/', async (request, response) => {
  try {
    const {provider_id, date} = request.body;

    // parseIso só esta transformando o dado
    const parsedDate = parseISO(date)

    const createAppointmentService = new CreateAppointmentService()

    const appointment = await createAppointmentService.execute({
      date: parsedDate, 
      provider_id
    });

    return response.json(appointment);
  } catch(err) {
    return response.status(400).json({
      error: err.message
    })
  }
});

export default appointmentsRouter;