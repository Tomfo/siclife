'use client';
import { apiRequest } from '@/lib/api';
import { useState } from 'react';
import { memberSchema, memberDefaultValues } from '@/lib/formValidationSchemas';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { API_URL } from '@/lib/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import {
	faPenToSquare,
	faRemove,
	faChild,
	faMale,
	faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

export default function RegistrationForm() {
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const MAX_DEPENDANTS = 4;
	const MAX_PARENTS = 2;
	//   const [children, setChildren] = useState([{ fullName: '', birthday: '' }]);
	//   const [parents, setParents] = useState([
	//     { fullName: '', birthday: '', relashinship: '' },
	//   ]);

	//Add Field Array

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: memberDefaultValues,
		resolver: yupResolver(memberSchema),
	});

	const {
		fields: childFields,
		append: appendChild,
		remove: removeChild,
	} = useFieldArray({
		control,
		name: 'children',
	});

	const {
		fields: parentFields,
		append: appendParent,
		remove: removeParent,
	} = useFieldArray({
		control,
		name: 'parents',
	});

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
		router.push('/members');
	};

	const onSubmit = async (data) => {
		try {
			//const response = await axios.post(`${API_URL}/api/members`, data);
			const response = await apiRequest('members', 'POST', data);
			// if (!response.ok) throw new Error('Submission failed');

			const result = await response.data;
			setOpen(true);
		} catch (error) {
			console.error('Submission error:', error);
			alert('Failed to submit member. Please try again.');
		}
	};

	return (
		<form className='m-5 bg-[#FAFAFA] p-2' onSubmit={handleSubmit(onSubmit)}>
			<div className='space-y-2'>
				<div className='text-center'>
					<h1 className=' text-[#091b1b] font-bold justify-center text-2xl'>
						Insurance Policy Registration Form
					</h1>
				</div>
				<Snackbar
					open={open}
					autoHideDuration={2000}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
					<Alert
						onClose={handleClose}
						severity='success'
						variant='filled'
						sx={{ width: '100%' }}>
						Record created successfully 🙂
					</Alert>
				</Snackbar>

				<div className='border-b border-gray-500/10 pb-2'>
					<h2 className='text-base/7 text-[#00ACAC] font-bold'>
						Identification Details
					</h2>
					<div className='mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
						<div className='sm:col-span-2'>
							<label
								htmlFor='nationalId'
								className='block text-sm/6 font-medium text-gray-500'>
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
								htmlFor='idType'
								className='block text-sm/6 font-medium text-gray-500'>
								Type of Identification
							</label>
							<div className='mt-2'>
								<select
									{...register('idType')}
									className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
									name='idType'
									id='idType'>
									<option value='GhCard'>Ghana Card</option>
									<option value='Passport'>Passport</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div className='border-b border-gray-500/10 pb-2'>
					<section>
						<h2 className='text-base/7 font-bold text-[#00ACAC]'>
							Personal Details
						</h2>
						<div className='mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
							<div className='sm:col-span-2'>
								<label
									htmlFor='firstName'
									className='block text-sm/6 font-medium text-gray-500'>
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
									className='block text-sm/6 font-medium text-gray-500'>
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
									className='block text-sm/6 font-medium text-gray-500'>
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
									className='block text-sm/6 font-medium text-gray-500'>
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
									className='block text-sm/6 font-medium text-gray-500'>
									Gender
								</label>
								<div className='mt-2'>
									<select
										{...register('gender')}
										className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
										name='gender'
										id='gender'>
										<option value='Male'>Male</option>
										<option value='Female'>Female</option>
									</select>
									<p className='text-red-500 text-xs italic'>
										{errors.gender?.message}
									</p>
								</div>
							</div>
						</div>
					</section>
				</div>
				<div className='border-b border-gray-500/10 pb-2'>
					<section>
						<h2 className='text-base/7 font-bold text-[#00ACAC]'>
							Contact Details
						</h2>
						<div className='mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
							<div className='sm:col-span-2'>
								<label
									htmlFor='email'
									className='block text-sm/6 font-medium text-gray-500'>
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
									className='block text-sm/6 font-medium text-gray-500'>
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
									className='block text-sm/6 font-medium text-gray-500'>
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
					</section>
				</div>
				<div className='border-b border-gray-500/10 pb-2'>
					<section>
						<h2 className='text-base/7 font-bold text-[#00ACAC]'>
							Spouse Details
						</h2>
						<div className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
							<div className='sm:col-span-2'>
								<label
									htmlFor='spouseFullname'
									className='block text-sm/6 font-medium text-gray-500'>
									spouseFullName
								</label>
								<div className='mt-2'>
									<input
										{...register('spouseFullname')}
										type='text'
										placeholder='spouseFullname '
										id='spouseFullname'
										name='spouseFullname'
										className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
									/>
									<p className='text-red-500 text-xs italic'>
										{errors.spouseFullname?.message}
									</p>
								</div>
							</div>

							<div className='sm:col-span-2'>
								<label
									htmlFor='spousebirthday'
									className='block text-sm/6 font-medium text-gray-500'>
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
					</section>
				</div>
				<div className='border-b border-gray-500/10 pb-2'>
					<section>
						<h2 className='text-base/7 font-bold text-[#00ACAC]'>
							Children Details
						</h2>

						{childFields.map((field, index) => (
							<div
								key={field.id}
								className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
								<div className='sm:col-span-2'>
									<label
										htmlFor={`children.${index}.fullName`}
										className='block text-sm/6 font-medium text-gray-500'>
										Full Name:
									</label>

									<div className='mt-2'>
										<input
											{...register(`children.${index}.fullName`)}
											type='text'
											placeholder={`child-[${index + 1}] fullname`}
											id={`children.${index}.fullName`}
											name={`children.${index}.fullName`}
											className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
										/>
										<p className='text-red-500 text-xs italic'>
											{errors.children?.[index]?.fullName && (
												<span>fullname is required</span>
											)}
										</p>
									</div>
								</div>

								<div className='sm:col-span-2'>
									<label
										htmlFor={`children.${index}.birthday`}
										className='block text-sm/6 font-medium text-gray-500'>
										Birthday:
									</label>

									<div className='mt-2'>
										<input
											{...register(`children.${index}.birthday`)}
											type='date'
											id={`children.${index}.birthday`}
											name={`children.${index}.birthday`}
											className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
										/>
										<p className='text-red-500 text-xs italic'>
											{errors.children?.[index]?.birthday && (
												<span>birthday is required</span>
											)}
										</p>
									</div>
								</div>
								<div className='sm:col-span-2'>
									<label className='block text-sm/6 font-medium text-gray-500'>
										&nbsp;
									</label>

									<div className='mt-2'>
										<IconButton
											color='error'
											size='large'
											onClick={() => removeChild(index)}
											aria-label='error-button'>
											<DeleteIcon />
										</IconButton>
									</div>
								</div>
							</div>
						))}
						<button
							className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
							// className='rounded-md bg-green-600 p-2.5 border border-transparent text-left text-sm  text-white transition-all shadow-sm hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
							type='button'
							disabled={childFields.length >= MAX_DEPENDANTS}
							onClick={() => appendChild({ fullName: '', birthday: '' })}>
							<FontAwesomeIcon icon={faChild} size='lg' />
							&nbsp;Add Another Child
						</button>
					</section>
				</div>
				<div className='border-b border-gray-500/10 pb-2'>
					<section>
						<h2 className='text-base/7 font-bold text-[#00ACAC]'>
							Parent Details
						</h2>

						{parentFields.map((field, index) => (
							<div
								key={field.id}
								className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
								<div className='sm:col-span-2'>
									<label
										htmlFor={`parents.${index}.fullName`}
										className='block text-sm/6 font-medium text-gray-500'>
										Full Name:
									</label>

									<div className='mt-2'>
										<input
											{...register(`parents.${index}.fullName`)}
											type='text'
											placeholder={`parent-[${index + 1}] fullname`}
											id={`parents.${index}.fullName`}
											name={`parents.${index}.fullName`}
											className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
										/>
										<p className='text-red-500 text-xs italic'>
											{errors.parents?.[index]?.fullName && (
												<span>fullname is required</span>
											)}
										</p>
									</div>
								</div>

								<div className='sm:col-span-1'>
									<label
										htmlFor={`parents.${index}.birthday`}
										className='block text-sm/6 font-medium text-gray-500'>
										Birthday:
									</label>

									<div className='mt-2'>
										<input
											{...register(`parents.${index}.birthday`)}
											type='date'
											id={`parents.${index}.birthday`}
											name={`parents.${index}.birthday`}
											className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
										/>
										<p className='text-red-500 text-xs italic'>
											{errors.parents?.[index]?.birthday && (
												<span>birthday is required</span>
											)}
										</p>
									</div>
								</div>
								<div className='sm:col-span-1'>
									<label
										htmlFor={`parents.${index}.relationship`}
										className='block text-sm/6 font-medium text-gray-500'>
										Relation:
									</label>
									<div className='mt-2'>
										<select
											{...register(`parents.${index}.relationship`)}
											name={`parents.${index}.relationship`}
											id={`parents.${index}.relationship`}
											className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'>
											<option value='Father'>Father</option>
											<option value='Mother'>Mother</option>
											<option value='Inlaw'>In-law</option>
										</select>
										<p className='text-red-500 text-xs italic'>
											{errors.parents?.[index]?.relationship && (
												<span>relation is required</span>
											)}
										</p>
									</div>
								</div>
								<div className='sm:col-span-1'>
									<label className='block text-sm/6 font-medium text-gray-500'>
										&nbsp;
									</label>

									<div className='mt-2'>
										<IconButton
											color='error'
											size='large'
											onClick={() => removeParent(index)}
											aria-label='error-button'>
											<DeleteIcon />
										</IconButton>
									</div>
								</div>
							</div>
						))}

						<Button
							variant='contained'
							className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
							// className='rounded-md bg-blue-600 p-2.5 border border-transparent text-left text-sm  text-white transition-all shadow-sm hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
							type='button'
							disabled={parentFields.length >= MAX_PARENTS}
							onClick={() =>
								appendParent({ fullName: '', birthday: '', relationship: '' })
							}>
							{/* <FontAwesomeIcon icon={faUserPlus} size='lg' /> */}
							<AddIcon></AddIcon>
							&nbsp;Add Another Parent
						</Button>
					</section>
				</div>
				<div className='border-b border-gray-500/10 pb-2'>
					<section>
						<h2 className='text-base/7 font-bold text-[#00ACAC]'>
							Undertaking
						</h2>
						<div className='mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
							<div className='sm:col-span-4'>
								<FormControlLabel
									control={
										<Checkbox
											name='underlying'
											id='underlying'
											{...register('underlying')}
											sx={{
												color: '#ff5722',
												'&.Mui-checked': {
													color: '#ff5722',
												},
											}}
										/>
									}
									label={
										<Typography
											variant='subtitle2'
											sx={{ fontStyle: 'italic' }}>
											Do you or your relatives listed have any ongoing illness
											or condition?
										</Typography>
									}
								/>
							</div>
							<div className='sm:col-span-4'>
								<label
									htmlFor='condition'
									className='block text-sm/6 font-medium text-gray-500'>
									Known Health Conditions
								</label>
								<div className='mt-2'>
									<textarea
										{...register('condition')}
										rows='2'
										placeholder='conditions '
										id='condition'
										name='condition'
										className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
									/>
									<p className='text-red-500 text-xs italic'>
										{errors.condition?.message}
									</p>
								</div>
							</div>
							<div className='sm:col-span-3'>
								<FormControlLabel
									control={
										<Checkbox
											{...register('declaration')}
											sx={{
												color: '#ff5722',
												'&.Mui-checked': {
													color: '#ff5722',
												},
											}}
										/>
									}
									label={
										<Typography
											variant='subtitle2'
											sx={{ fontStyle: 'italic' }}>
											I declare that the information provided is true, accurate
											and complete to the best of my belief and knowledge
										</Typography>
									}
								/>
							</div>
						</div>
					</section>
				</div>
			</div>
			<div className='mt-6 flex items-center justify-end gap-x-6'>
				<Button
					variant='outlined'
					color='error'
					onClick={() => router.push('/members')}>
					Cancel
				</Button>
				<Button variant='outlined' color='secondary' onClick={() => reset()}>
					Reset
				</Button>
				<Button
					variant='contained'
					disabled={isSubmitting}
					type='submit'
					className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
					{isSubmitting ? 'Submitting...' : 'Register'}
				</Button>
			</div>
		</form>
	);
}
