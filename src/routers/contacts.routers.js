import { Router } from 'express';

import {
  getAllContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  upsertContactController,
  patchContactController,
  uploadContactsAvatarController,
} from '../controllers/contacts.controller.js';
import { isValidId } from '../middlewares/validate-mongo-id.js';
import { validateBody } from '../middlewares/validate-body-middleware.js';
import { createContactSchema } from '../validation/createContact.js';
import { updateContactSchema } from '../validation/updateContact.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);
contactsRouter.use('/:contactId', isValidId('contactId'));

contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  createContactController,
);
contactsRouter.patch(
  '/:contactId',
  upload.none(),
  validateBody(updateContactSchema),
  patchContactController,
);
contactsRouter.post(
  '/:contactId/upload-avatar',
  upload.single('photo'),
  uploadContactsAvatarController,
);
contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  uploadContactsAvatarController,
);
contactsRouter.put(
  '/:contactId',
  validateBody(createContactSchema),
  upsertContactController,
);
contactsRouter.delete('/:contactId', deleteContactController);

export default contactsRouter;
