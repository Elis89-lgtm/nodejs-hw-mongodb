import { Contact } from '../db/../models/contact.js';

export const getAllContactsService = async () => {
  return await Contact.find();
};

export const getContactByIdService = async (contactId) => {
  return await Contact.findById(contactId);
};
