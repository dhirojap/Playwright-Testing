import { UserDataType } from '../types';

export const wrongUser: UserDataType = {
  email: 'invalidemail',
  firstName: '123',
  lastName: '321',
  password: 'invalidpass',
  confirmPassword: 'invalidandwrongconfirmpass',
};

export const correctUser: UserDataType = {
  email: 'newuser1@gmail.com',
  firstName: 'new',
  lastName: 'user',
  password: '#Pass123',
  confirmPassword: '#Pass123',
};

export const existUser: UserDataType = {
  email: 'existinguser@gmail.com',
  firstName: 'exist',
  lastName: 'user',
  password: '#Pass123',
  confirmPassword: '#Pass123',
};
