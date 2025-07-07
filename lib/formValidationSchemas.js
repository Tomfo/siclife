import * as yup from 'yup';

export const memberSchema = yup.object().shape({
  nationalId: yup
    .string()
    .required('member Id is required')
    .min(3, 'Id must be at least 3 characters long!')
    .max(20, 'Id must be at most 20 characters long!'),
  idType: yup.string().oneOf(['GhCard', 'Passport'], 'Id Type is required'),

  firstName: yup.string().required('First Name is required'),
  // middleName: yup.string().required('Middle Name is required'),
  lastName: yup.string().required('Last Name is required'),
  gender: yup.string().oneOf(['Female', 'Male'], 'Gender is required'),
  birthday: yup
    .date()
    .required('Birth date is required')
    .max(new Date(), "Birth date can't be in the future"),
  spouseFullname: yup.string().required('Spouse Name is required'),
  spousebirthday: yup
    .date()
    .required('Birth date is required')
    .max(new Date(), "Birth date can't be in the future"),
  email: yup
    .string()
    .lowercase()
    .trim()
    .email('Must be a valid email')
    .required('Email is required'),
  telephone: yup.string().required().min(1, 'Phone is required'),
  residence: yup.string().required('Address is reqired'),
  underlying: yup.boolean(),
  condition: yup.string().when('underlying', {
    is: true,
    then: (s) => s.required('provide detaills of illnesses and conditions'),
    otherwise: (s) => s.notRequired(),
  }),

  declaration: yup.boolean(),
  children: yup.array().of(
    yup.object().shape({
      fullName: yup.string().required('Full Name is required'),
      birthday: yup
        .date()
        .required('Birth date is required')
        .max(new Date(), "Birth date can't be in the future"),
    })
  ),
  parents: yup.array().of(
    yup.object().shape({
      fullName: yup.string().required('Full Name is required'),
      birthday: yup
        .date()
        .required('Birth date is required')
        .max(new Date(), "Birth date can't be in the future"),
      relationship: yup.string().required('Select relationship'),
    })
  ),
});

export const memberDefaultValues = {
  nationalId: '',
  idType: 'GhCard',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: 'Male',
  birthday: '',
  spouseFullname: '',
  spousebirthday: '',
  email: '',
  telephone: '',
  residence: '',
  underlying: false,
  condition: '',
  declaration: false,
  children: [{ fullName: '', birthday: '' }],
  parents: [{ fullName: '', birthday: '', relationship: 'Mother' }],
};
