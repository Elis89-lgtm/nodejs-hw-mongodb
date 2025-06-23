import { parseString } from './parseString';

const parseNumber = (value, defaultValue = undefined) => {
  const parsed = Number.parseInt(value);
  if (Number.isNan(parsed)) {
    return defaultValue;
  }
  return parsed;
};
const parseBoolean = (value) => {
  if (['true', 'false'].includes(value)) return JSON.parse(value);
};
const parseSortOrder = (value) => {
  if (['asc', 'desc'].includes(value)) {
    return value;
  }
  return 'asc';
};
const parseSortBy = (value) => {
  if (
    ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType'].includes(
      value,
    )
  ) {
    return value;
  }
  return '_id';
};
export const parseSortParams = (obj) => {
  return {
    sortOrder: parseSortOrder(obj.sortOrder),
    sortBy: parseSortBy(obj.sortBy),
  };
};

export const parseContactType = (value) => {
  const allowed = ['work', 'home', 'personal'];
  return allowed.includes(value) ? value : undefined;
};

export const parseFiltersContacts = (obj) => {
  return {
    name: parseString(obj.name),
    phoneNumber: parseString(obj.phoneNumber),
    email: parseString(obj.email),
    isFavourite: parseBoolean(obj.isFavourite),
    contactType: parseContactType(obj.contactType),
  };
};
export const parsePaginationParams = (obj) => {
  return {
    page: parseNumber(obj.page, 1),
    perPage: parseNumber(obj.perPage, 10),
  };
};
