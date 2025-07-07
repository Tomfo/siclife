'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DeleteModal({
  itemName,
  onDelete,
  onCancel,
  isLoading = false,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      confirmation: '',
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    onCancel();
    reset();
  };

  const onSubmit = () => {
    onDelete();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Overlay */}
      <div className='fixed inset-0 bg-black/50' aria-hidden='true' />

      {/* Modal container */}
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
          {/* Modal header */}
          <div className='mb-4'>
            <h2 className='text-xl font-bold text-gray-900'>
              Confirm Deletion
            </h2>
            <p className='mt-2 text-gray-600'>
              Are you sure you want to delete <strong>{itemName}</strong>? This
              action cannot be undone.
            </p>
          </div>

          {/* Modal body with form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4'>
              <label
                htmlFor='confirmation'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Type <span className='font-mono bg-gray-100 px-1'>DELETE</span>{' '}
                to confirm
              </label>
              <input
                id='confirmation'
                type='text'
                {...register('confirmation', {
                  validate: (value) =>
                    value === 'DELETE' || 'You must type "DELETE" to confirm',
                })}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                  errors.confirmation ? 'border-red-500' : 'border'
                }`}
                disabled={isLoading}
              />
              {errors.confirmation && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.confirmation.message}
                </p>
              )}
            </div>

            {/* Modal footer with action buttons */}
            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={handleClose}
                disabled={isLoading}
                className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isLoading}
                className={`flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isLoading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading && (
                  <svg
                    className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                )}
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
