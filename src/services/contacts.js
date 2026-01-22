import createHttpError from 'http-errors';
import { Contact } from '../db/../models/contact.js';

export const getAllContactsService = async () => {
  const contacts = await Contact.find();

  return contacts;
};

export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  return contact;
};
export const createContactService = async (payload) => {
  const newContact = await Contact.create(payload);

  return newContact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const result = await Contact.findByIdAndUpdate({ _id: contactId }, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
    runValidators: true,
  });
  if (!result.value) {
    throw createHttpError(404, 'Contact not found!');
  }
  return {
    contact: result.value,
    isNew: !result.lastErrorObject.updatedExisting,
  };
};

export const deleteContactByIdService = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
