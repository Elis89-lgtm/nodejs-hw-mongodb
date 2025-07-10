import createHttpError from 'http-errors';
import { Contact } from '../models/contact.js';
import { createPaginationMetadata } from '../utils/create-pagination.js';
import { saveFile } from '../utils/save-file.js';

const allowedTypes = ['work', 'home', 'personal'];

export const getAllContactsService = async ({
  userId,
  page,
  perPage,
  sortOrder,
  sortBy,
  type,
  isFavourite,
  filters,
}) => {
  const offset = (page - 1) * perPage;
  const contactFiltersConditions = Contact.find({ userId });
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

export const getContactByIdService = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  return contact;
};
export const createContactService = async (payload, file) => {
  let photoUrl = '';
  if (file) {
    photoUrl = await saveFile(file.path);
  }
  const newContact = await Contact.create({ ...payload, photo: photoUrl });

  return newContact;
};

export const updateContact = async (
  contactId,
  payload,
  { userId, upsert = false, file } = {},
) => {
  const updatedFields = { ...payload };
  if (file) {
    const photoUrl = await saveFile(file.path);
    updatedFields.photo = photoUrl;
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: updatedFields },

    {
      new: true,
      upsert,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );
  if (!contact) throw createHttpError(404, 'Contact not found!');

  const isNew =
    upsert && contact.createdAt?.getTime() === contact.updatedAt?.getTime();
  return {
    contact,
    isNew,
  };
};
export const upsertContact = async (contactId, payload, userId) => {
  const query = { _id: contactId, userId };
  const contact = await Contact.findOne(query);

  if (contact) {
    contact.set(payload);
    return { isNew: false, contact: await contact.save() };
  } else {
    return {
      isNew: true,
      contact: await Contact.create({ ...payload, userId }),
    };
  }
};

export const uploadContactsAvatar = async (contactId, file) => {
  const url = await saveFile(file);

  const contact = await Contact.findByIdAndUpdate(
    contactId,
    {
      photo: url,
    },
    { new: true },
  );
  return contact;
};

export const deleteContactByIdService = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }
  return contact;
};
