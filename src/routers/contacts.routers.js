import { Router } from 'express';

import {
  getAllContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.controller.js';

const contactsRouter = Router();

contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);
contactsRouter.post('/contacts', createContactController);
contactsRouter.patch('/:contactId', patchContactController);
contactsRouter.put('/:contactId', upsertContactController);
contactsRouter.delete('/:contactId', deleteContactController);

export default contactsRouter;
