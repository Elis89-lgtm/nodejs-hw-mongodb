import createHttpError from 'http-errors';
import {
  getAllContactsService,
  getContactByIdService,
  deleteContactByIdService,
  createContactService,
  updateContact,
  uploadContactsAvatar,
} from '../services/contacts.js';
import {
  parseFiltersContacts,
  parsePaginationParams,
  parseSortParams,
} from '../utils/parse.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { type, isFavourite } = req.query;

  const filters = parseFiltersContacts(req.query);
  const result = await getAllContactsService({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
    filters,
  });
  res.json({
    status: 200,
    message: 'Successfully retrieved contacts!',
    data: result.data,
  });
};
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully retrieved contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const payload = {
    ...req.body,
    userId: req.user._id,
  };
  const newContact = await createContactService(payload, req.file);
  if (!newContact) {
    throw createHttpError(500, 'Failed to create contact');
  }
  res.status(201).json({
    status: 201,
    message: `Successfully created contact with id ${newContact._id}!`,
    data: newContact,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { contact, isNew } = await updateContact(contactId, req.body, {
    upsert: true,
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }
  const status = isNew ? 201 : 200;

  return res.status(status).json({
    message: `Successfully updated contact with id ${contactId}!`,
    status,
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  const { contact } = await updateContact(contactId, req.body, {
    upsert: false,
    userId: req.user._id,
    file: req.file,
  });
  console.log(req.body);
  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully updated contact with id ${contactId}!`,
    data: contact,
  });
};

export const uploadContactsAvatarController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await uploadContactsAvatar(contactId, req.file);

  return res.json({
    message: `Successfully updated contacts photo with id ${contactId}!`,
    status: 200,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContactByIdService(
    contactId,
    req.user._id,
  );
  if (!deletedContact) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }
  res.status(204).send();
};
