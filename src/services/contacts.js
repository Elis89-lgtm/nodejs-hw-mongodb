import createHttpError from 'http-errors';
import { Contact } from '../models/contact.js';
import { createPaginationMetadata } from '../utils/create-pagination.js';

const allowedTypes = ['work', 'home', 'personal'];

export const getAllContactsService = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  type,
  isFavourite,
  filters,
}) => {
  const offset = (page - 1) * perPage;
  const contactFiltersConditions = Contact.find();
  if (filters.name) {
    contactFiltersConditions.where('name').regex(new RegExp(filters.name, 'i'));
  }

  if (filters.phoneNumber) {
    contactFiltersConditions
      .where('phoneNumber')
      .regex(new RegExp(filters.phoneNumber, 'i'));
  }
  if (filters.email) {
    contactFiltersConditions
      .where('email')
      .regex(new RegExp(filters.email, 'i'));
  }
  if (typeof filters.isFavourite === 'boolean') {
    contactFiltersConditions.where('isFavourite').equals(filters.isFavourite);
  }

  if (filters.contactType && Array.isArray(filters.contactType)) {
    const validTypes = filters.contactType.filter((type) =>
      allowedTypes.includes(type),
    );
    contactFiltersConditions.where('contactType').in(validTypes);
  }
  const [contacts, contactsCount] = await Promise.all([
    contactFiltersConditions
      .skip(offset)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      }),
    // Contact.find({ userId }).merge(contactFiltersConditions).countDocuments(),
    contactFiltersConditions.clone().countDocuments(),
  ]);

  const metadata = createPaginationMetadata(page, perPage, contactsCount);

  return {
    data: {
      data: contacts,
      ...metadata,
    },
  };
};

export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById({ contactId });

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
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId },
    payload,

    {
      ...options,
      new: true,
      includeResultMetadata: true,
      runValidators: true,
    },
  );
  if (!result.value) {
    throw createHttpError(404, 'Contact not found!');
  }
  return {
    contact: result.value,
    isNew: !result.lastErrorObject.updatedExisting,
  };
};
export const upsertContact = async (contactId, payload) => {
  const contact = await Contact.findById(contactId);

  if (contact) {
    contact.set(payload);
    return { isNew: false, contact: await contact.save() };
  } else {
    return { isNew: true, contact: await Contact.create(payload) };
  }
};

export const deleteContactByIdService = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
