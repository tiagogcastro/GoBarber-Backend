import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

const appointmentsController = new AppointmentsController();
const providerController = new ProviderAppointmentsController();

appointmentsRouter.post('/', appointmentsController.create);

appointmentsRouter.get('/me', providerController.index);

export default appointmentsRouter;