'use client';
import { memberSchema } from '@/lib/formValidationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
export default function MemberChildParentForm() {
  const [childern, setChildren] = useState([{ fullName: '', birthday: '' }]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(memberSchema),
  });

  const onSubmit = async (data) => {
    console.log('Form data submitted:', data);
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Handle form submission logic, e.g., send data to an API
    alert(JSON.stringify(data, null, 2));

    // Optionally reset the form after successful submission
    reset();
  };

  return (
    <form className='m-5 bg-white p-2' onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-2'>
        <div className='border-b border-gray-500/10 pb-2'>
          <h2 className='text-base/7 text-[#00ACAC] font-semibold'>
            Identification Details
          </h2>
          <div className='mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
            <div className='sm:col-span-2'>
              <label
                htmlFor='id'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Id
              </label>
              <div className='mt-2'>
                <input
                  {...register('id')}
                  type='text'
                  placeholder='Identification No'
                  id='id'
                  name='id'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.id?.message}
                </p>
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='nationalId'
                className='block text-sm/6 font-medium text-gray-500'
              >
                National Id
              </label>
              <div className='mt-2'>
                <input
                  {...register('nationalId')}
                  type='text'
                  placeholder='National Id'
                  id='nationalId'
                  name='nationalId'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.nationalId?.message}
                </p>
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='IdType'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Type of Id
              </label>
              <div className='mt-2'>
                <select
                  {...register('IdType')}
                  name='IdType'
                  id='IdType'
                  className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
                >
                  <option value='GhCard'>Ghana Card</option>
                  <option value='Passport'>Passport</option>
                </select>
                {/* <p>{errors.IdType?.message}</p> */}
              </div>
            </div>
          </div>
        </div>
        <div className='border-b border-gray-500/10 pb-2'>
          <h2 className='text-base/7 font-semibold text-[#00ACAC]'>
            Personal Details
          </h2>
          <div className='mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
            <div className='sm:col-span-2'>
              <label
                htmlFor='firstName'
                className='block text-sm/6 font-medium text-gray-500'
              >
                First Name
              </label>
              <div className='mt-2'>
                <input
                  {...register('firstName')}
                  type='text'
                  placeholder='First Name'
                  id='firstName'
                  name='firstName'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.firstName?.message}
                </p>
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='middleName'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Middle Name
              </label>
              <div className='mt-2'>
                <input
                  {...register('middleName')}
                  type='text'
                  placeholder='Middle Name'
                  id='middleName'
                  name='middleName'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.middleName?.message}
                </p>
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='lastName'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Last Name
              </label>
              <div className='mt-2'>
                <input
                  {...register('lastName')}
                  type='text'
                  placeholder='last Name'
                  id='lastName'
                  name='lastName'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.lastName?.message}
                </p>
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='birthday'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Birthday
              </label>
              <div className='mt-2'>
                <input
                  {...register('birthday')}
                  type='date'
                  id='birthday'
                  name='birthday'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.birthday?.message}
                </p>
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='gender'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Gender
              </label>
              <div className='mt-2'>
                <select
                  {...register('gender')}
                  name='gender'
                  id='gender'
                  className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
                >
                  <option value='Female'>Male</option>
                  <option value='Male'>Female</option>
                </select>
                <p>{errors.IdType?.message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='border-b border-gray-500/10 pb-2'>
          <h2 className='text-base/7 font-semibold text-[#00ACAC]'>
            Contact Details
          </h2>
          <div className='mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
            <div className='sm:col-span-2'>
              <label
                htmlFor='email'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Email
              </label>
              <div className='mt-2'>
                <input
                  {...register('email')}
                  type='text'
                  placeholder='Email '
                  id='email'
                  name='email'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.email?.message}
                </p>
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='telephone'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Telephone
              </label>
              <div className='mt-2'>
                <input
                  {...register('telephone')}
                  type='text'
                  placeholder='Telephone'
                  id='telephone'
                  name='telephone'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.telephone?.message}
                </p>
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='residence'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Address
              </label>
              <div className='mt-2'>
                <input
                  {...register('residence')}
                  type='text'
                  placeholder='Address'
                  id='residence'
                  name='residence'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.residence?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='border-b border-gray-500/10 pb-2'>
          <h2 className='text-base/7 font-semibold text-[#00ACAC]'>
            Spouse Details
          </h2>
          <div className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
            <div className='sm:col-span-2'>
              <label
                htmlFor='spouseFullName'
                className='block text-sm/6 font-medium text-gray-500'
              >
                spouseFullName
              </label>
              <div className='mt-2'>
                <input
                  {...register('spouseFullName')}
                  type='text'
                  placeholder='spouseFullName '
                  id='spouseFullName'
                  name='spouseFullName'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.spouseFullName?.message}
                </p>
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='spousebirthday'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Spouse Birthday
              </label>
              <div className='mt-2'>
                <input
                  {...register('spousebirthday')}
                  type='date'
                  placeholder='spousebirthday'
                  id='spousebirthday'
                  name='spousebirthday'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {errors.spousebirthday?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='border-b border-gray-500/10 pb-2'>
          <h2 className='text-base/7 font-semibold text-[#00ACAC]'>
            Children Details
          </h2>
          <button type='button' onClick={() => alert('add child')}>
            Add Book
          </button>
          <div className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
            {childern.map((child, index) => (
              <div key={index}>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='children'
                    className='block text-sm/6 font-medium text-gray-500'
                  >
                    Child 1
                  </label>
                  <div className='mt-2'>
                    <input
                      // {...register('FullName')}
                      type='text'
                      placeholder='children '
                      id='children'
                      name='children'
                      className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                    />
                    <p className='text-red-500 text-xs italic'>
                      {/* {errors.children?.message} */}
                    </p>
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='childrenbirthday'
                    className='block text-sm/6 font-medium text-gray-500'
                  >
                    Child Birthday
                  </label>
                  <div className='mt-2'>
                    <input
                      // {...register('childrenbirthday')}
                      type='date'
                      placeholder='childrenbirthday'
                      id='childrenbirthday'
                      name='childrenbirthday'
                      className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                    />
                    <p className='text-red-500 text-xs italic'>
                      {/* {errors.childrenbirthday?.message} */}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='border-b border-gray-500/10 pb-2'>
          <h2 className='text-base/7 font-semibold text-[#00ACAC]'>
            Parents Details
          </h2>
          <div className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
            <div className='sm:col-span-2'>
              <label
                htmlFor='parentsFullName'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Parent FullName
              </label>
              <div className='mt-2'>
                <input
                  // {...register('parentsFullName')}
                  type='text'
                  placeholder='parentsFullName '
                  id='parentsFullName'
                  name='parentsFullName'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {/* {errors.parentsFullName?.message} */}
                </p>
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='parentbirthday'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Parent Birthday
              </label>
              <div className='mt-2'>
                <input
                  // {...register('parentbirthday')}
                  type='date'
                  placeholder='parentbirthday'
                  id='parentbirthday'
                  name='parentbirthday'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                <p className='text-red-500 text-xs italic'>
                  {/* {errors.parentbirthday?.message} */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='border-b border-gray-500/10 pb-2'>
          <h2 className='text-base/7 font-semibold text-[#00ACAC]'>
            Undertaking
          </h2>
          <div className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
            <div className='sm:col-span-4'>
              <label
                htmlFor='underlying'
                className='block text-sm/6 font-medium text-gray-500'
              >
                <input
                  className='mr-2 leading-tight'
                  type='checkbox'
                  name='underlying'
                  id='underlying'
                  {...register('underlying')}
                />
                <span className='text-sm'>
                  select if there are any known health conditions!
                </span>
              </label>
            </div>
            <div className='sm:col-span-4'>
              <label
                htmlFor='conditions'
                className='block text-sm/6 font-medium text-gray-500'
              >
                Known Health Conditions
              </label>
              <div className='mt-2'>
                <textarea
                  {...register('conditions')}
                  rows='2'
                  placeholder='conditions '
                  id='conditions'
                  name='conditions'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
                {/* <p className='text-red-500 text-xs italic'>
                  {errors.conditions?.message}
                </p> */}
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='declaration'
                className='block text-sm/6 font-medium text-gray-500'
              >
                <input
                  className='mr-2 leading-tight'
                  type='checkbox'
                  name='declaration'
                  id='declaration'
                  {...register('declaration')}
                />
                I declare that the information given if accurate
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button type='button' className='text-sm/6 font-semibold text-gray-500'>
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          type='submit'
          className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          {isSubmitting ? 'Submitting...' : 'Register'}
        </button>
      </div>
    </form>
  );
}
