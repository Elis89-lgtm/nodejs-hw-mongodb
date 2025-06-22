import { Router } from 'express';

import {
  getAllContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.controller.js';
import { validateMongoDBId } from '../middlewares/validate-mongo-id.js';
import { validateBody } from '../middlewares/validate-body-middleware.js';
import { createContactSchema } from '../validation/createContact.js';
import { updateContactSchema } from '../validation/updateContact.js';

const contactsRouter = Router();
contactsRouter.use('/:contactId', validateMongoDBId('contactId'));

contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  createContactController,
);
contactsRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  patchContactController,
);
contactsRouter.put(
  '/:contactId',
  validateBody(createContactSchema),
  upsertContactController,
);
contactsRouter.delete('/:contactId', deleteContactController);

export default contactsRouter;
