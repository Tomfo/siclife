'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { memberSchema, memberDefaultValues } from '@/lib/formValidationSchemas';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function RegistrationForm() {
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const router = useRouter();
	const MAX_DEPENDANTS = 4;
	const MAX_PARENTS = 2;

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
		setOpenSnackbar(false);
		router.push('/members');
	};

	const createMemberMutation = useMutation({
		mutationFn: (newMember) =>
			fetch(`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newMember),
			}).then((res) => res.json()),
		onSuccess: (data) => {
			setOpenSnackbar(true);
		},
	});

	const onSubmit = (formData) => {
		createMemberMutation.mutate(formData);
	};

	return (
		<Box
			component='form'
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				maxWidth: '1200px',
				margin: '0 auto',
				padding: { xs: 2, sm: 3, md: 4 },
			}}>
			<Paper
				elevation={3}
				sx={{ padding: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
				<Typography
					variant='h4'
					component='h1'
					gutterBottom
					align='center'
					sx={{
						fontWeight: 'bold',
						color: 'primary.main',
						mb: 4,
						fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
					}}>
					Insurance Policy Registration Form
				</Typography>

				<Snackbar
					open={openSnackbar}
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

				{/* Identification Details */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant='h6'
						component='h2'
						sx={{ color: 'secondary.main', mb: 2 }}>
						Identification Details
					</Typography>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
							gap: 3,
						}}>
						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								National Id
							</Typography>
							<Box
								component='input'
								{...register('nationalId')}
								type='text'
								placeholder='National Id'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.nationalId ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
										boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
									},
								}}
							/>
							{errors.nationalId && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.nationalId.message}
								</Typography>
							)}
						</Box>

						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Type of Identification
							</Typography>
							<Box
								component='select'
								{...register('idType')}
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: 'divider',
									backgroundColor: 'background.paper',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}>
								<option value='GhCard'>Ghana Card</option>
								<option value='Passport'>Passport</option>
							</Box>
						</Box>
					</Box>
				</Box>

				{/* Personal Details */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant='h6'
						component='h2'
						sx={{ color: 'secondary.main', mb: 2 }}>
						Personal Details
					</Typography>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								sm: '1fr 1fr',
								md: '1fr 1fr 1fr',
							},
							gap: 3,
						}}>
						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								First Name
							</Typography>
							<Box
								component='input'
								{...register('firstName')}
								type='text'
								placeholder='First Name'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.firstName ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.firstName && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.firstName.message}
								</Typography>
							)}
						</Box>

						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Middle Name
							</Typography>
							<Box
								component='input'
								{...register('middleName')}
								type='text'
								placeholder='Middle Name'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.middleName ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.middleName && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.middleName.message}
								</Typography>
							)}
						</Box>

						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Last Name
							</Typography>
							<Box
								component='input'
								{...register('lastName')}
								type='text'
								placeholder='Last Name'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.lastName ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.lastName && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.lastName.message}
								</Typography>
							)}
						</Box>

						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Birthday
							</Typography>
							<Box
								component='input'
								{...register('birthday')}
								type='date'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.birthday ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.birthday && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.birthday.message}
								</Typography>
							)}
						</Box>

						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Gender
							</Typography>
							<Box
								component='select'
								{...register('gender')}
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.gender ? 'error.main' : 'divider',
									backgroundColor: 'background.paper',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}>
								<option value='Male'>Male</option>
								<option value='Female'>Female</option>
							</Box>
							{errors.gender && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.gender.message}
								</Typography>
							)}
						</Box>
					</Box>
				</Box>

				{/* Contact Details */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant='h6'
						component='h2'
						sx={{ color: 'secondary.main', mb: 2 }}>
						Contact Details
					</Typography>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
							gap: 3,
						}}>
						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Email
							</Typography>
							<Box
								component='input'
								{...register('email')}
								type='text'
								placeholder='Email'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.email ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.email && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.email.message}
								</Typography>
							)}
						</Box>

						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Telephone
							</Typography>
							<Box
								component='input'
								{...register('telephone')}
								type='text'
								placeholder='Telephone'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.telephone ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.telephone && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.telephone.message}
								</Typography>
							)}
						</Box>

						<Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Address
							</Typography>
							<Box
								component='input'
								{...register('residence')}
								type='text'
								placeholder='Address'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.residence ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.residence && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.residence.message}
								</Typography>
							)}
						</Box>
					</Box>
				</Box>

				{/* Spouse Details */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant='h6'
						component='h2'
						sx={{ color: 'secondary.main', mb: 2 }}>
						Spouse Details
					</Typography>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
							gap: 3,
						}}>
						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Spouse Full Name
							</Typography>
							<Box
								component='input'
								{...register('spouseFullname')}
								type='text'
								placeholder='Spouse Full Name'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.spouseFullname ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.spouseFullname && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.spouseFullname.message}
								</Typography>
							)}
						</Box>

						<Box>
							<Typography
								variant='body2'
								component='label'
								sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
								Spouse Birthday
							</Typography>
							<Box
								component='input'
								{...register('spousebirthday')}
								type='date'
								sx={{
									width: '100%',
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid',
									borderColor: errors.spousebirthday ? 'error.main' : 'divider',
									'&:focus': {
										outline: 'none',
										borderColor: 'primary.main',
									},
								}}
							/>
							{errors.spousebirthday && (
								<Typography
									variant='caption'
									color='error'
									sx={{ display: 'block', mt: 1 }}>
									{errors.spousebirthday.message}
								</Typography>
							)}
						</Box>
					</Box>
				</Box>

				{/* Children Details */}
				<Box sx={{ mb: 4 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}>
						<Typography
							variant='h6'
							component='h2'
							sx={{ color: 'secondary.main' }}>
							Children Details
						</Typography>
						<Button
							onClick={() => appendChild({ fullName: '', birthday: '' })}
							variant='contained'
							color='primary'
							type='button'
							disabled={childFields.length >= MAX_DEPENDANTS}
							startIcon={<EscalatorWarningIcon />}
							size='small'>
							Add Child
						</Button>
					</Box>

					{childFields.map((field, index) => (
						<Paper key={field.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
									gap: 3,
								}}>
								<Box>
									<Typography
										variant='body2'
										component='label'
										sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
										Full Name
									</Typography>
									<Box
										component='input'
										{...register(`children.${index}.fullName`)}
										type='text'
										placeholder={`Child ${index + 1} Full Name`}
										sx={{
											width: '100%',
											padding: '12px',
											borderRadius: '4px',
											border: '1px solid',
											borderColor: errors.children?.[index]?.fullName
												? 'error.main'
												: 'divider',
											'&:focus': {
												outline: 'none',
												borderColor: 'primary.main',
											},
										}}
									/>
									{errors.children?.[index]?.fullName && (
										<Typography
											variant='caption'
											color='error'
											sx={{ display: 'block', mt: 1 }}>
											Full name is required
										</Typography>
									)}
								</Box>

								<Box>
									<Typography
										variant='body2'
										component='label'
										sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
										Birthday
									</Typography>
									<Box
										component='input'
										{...register(`children.${index}.birthday`)}
										type='date'
										sx={{
											width: '100%',
											padding: '12px',
											borderRadius: '4px',
											border: '1px solid',
											borderColor: errors.children?.[index]?.birthday
												? 'error.main'
												: 'divider',
											'&:focus': {
												outline: 'none',
												borderColor: 'primary.main',
											},
										}}
									/>
									{errors.children?.[index]?.birthday && (
										<Typography
											variant='caption'
											color='error'
											sx={{ display: 'block', mt: 1 }}>
											Birthday is required
										</Typography>
									)}
								</Box>
							</Box>
							<IconButton
								color='error'
								onClick={() => removeChild(index)}
								aria-label='delete'
								sx={{ position: 'absolute', top: 8, right: 8 }}>
								<DeleteIcon fontSize='small' />
							</IconButton>
						</Paper>
					))}
				</Box>

				{/* Parent Details */}
				<Box sx={{ mb: 4 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}>
						<Typography
							variant='h6'
							component='h2'
							sx={{ color: 'secondary.main' }}>
							Parent Details
						</Typography>
						<Button
							variant='contained'
							color='secondary'
							type='button'
							disabled={parentFields.length >= MAX_PARENTS}
							onClick={() =>
								appendParent({ fullName: '', birthday: '', relationship: '' })
							}
							startIcon={<FamilyRestroomIcon />}
							size='small'>
							Add Parent
						</Button>
					</Box>

					{parentFields.map((field, index) => (
						<Paper key={field.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
									gap: 3,
								}}>
								<Box>
									<Typography
										variant='body2'
										component='label'
										sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
										Full Name
									</Typography>
									<Box
										component='input'
										{...register(`parents.${index}.fullName`)}
										type='text'
										placeholder={`Parent ${index + 1} Full Name`}
										sx={{
											width: '100%',
											padding: '12px',
											borderRadius: '4px',
											border: '1px solid',
											borderColor: errors.parents?.[index]?.fullName
												? 'error.main'
												: 'divider',
											'&:focus': {
												outline: 'none',
												borderColor: 'primary.main',
											},
										}}
									/>
									{errors.parents?.[index]?.fullName && (
										<Typography
											variant='caption'
											color='error'
											sx={{ display: 'block', mt: 1 }}>
											Full name is required
										</Typography>
									)}
								</Box>

								<Box>
									<Typography
										variant='body2'
										component='label'
										sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
										Birthday
									</Typography>
									<Box
										component='input'
										{...register(`parents.${index}.birthday`)}
										type='date'
										sx={{
											width: '100%',
											padding: '12px',
											borderRadius: '4px',
											border: '1px solid',
											borderColor: errors.parents?.[index]?.birthday
												? 'error.main'
												: 'divider',
											'&:focus': {
												outline: 'none',
												borderColor: 'primary.main',
											},
										}}
									/>
									{errors.parents?.[index]?.birthday && (
										<Typography
											variant='caption'
											color='error'
											sx={{ display: 'block', mt: 1 }}>
											Birthday is required
										</Typography>
									)}
								</Box>

								<Box>
									<Typography
										variant='body2'
										component='label'
										sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
										Relation
									</Typography>
									<Box
										component='select'
										{...register(`parents.${index}.relationship`)}
										sx={{
											width: '100%',
											padding: '12px',
											borderRadius: '4px',
											border: '1px solid',
											borderColor: errors.parents?.[index]?.relationship
												? 'error.main'
												: 'divider',
											backgroundColor: 'background.paper',
											'&:focus': {
												outline: 'none',
												borderColor: 'primary.main',
											},
										}}>
										<option value='Father'>Father</option>
										<option value='Mother'>Mother</option>
										<option value='Inlaw'>In-law</option>
									</Box>
									{errors.parents?.[index]?.relationship && (
										<Typography
											variant='caption'
											color='error'
											sx={{ display: 'block', mt: 1 }}>
											Relation is required
										</Typography>
									)}
								</Box>
							</Box>
							<IconButton
								color='error'
								onClick={() => removeParent(index)}
								aria-label='delete'
								sx={{ position: 'absolute', top: 8, right: 8 }}>
								<DeleteIcon fontSize='small' />
							</IconButton>
						</Paper>
					))}
				</Box>

				{/* Undertaking */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant='h6'
						component='h2'
						sx={{ color: 'secondary.main', mb: 2 }}>
						Undertaking
					</Typography>

					<FormControlLabel
						control={
							<Controller
								name='underlying'
								control={control}
								render={({ field }) => (
									<Checkbox
										{...field}
										checked={!!field.value}
										sx={{
											color: 'warning.main',
											'&.Mui-checked': {
												color: 'warning.main',
											},
										}}
									/>
								)}
							/>
						}
						label={
							<Typography variant='body2' sx={{ fontStyle: 'italic' }}>
								Do you or your relatives listed have any ongoing illness or
								condition?
							</Typography>
						}
						sx={{ mb: 2 }}
					/>

					<Box sx={{ mb: 3 }}>
						<Typography
							variant='body2'
							component='label'
							sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
							Known Health Conditions
						</Typography>
						<Box
							component='textarea'
							{...register('condition')}
							rows={3}
							placeholder='Conditions'
							sx={{
								width: '100%',
								padding: '12px',
								borderRadius: '4px',
								border: '1px solid',
								borderColor: errors.condition ? 'error.main' : 'divider',
								'&:focus': {
									outline: 'none',
									borderColor: 'primary.main',
								},
							}}
						/>
						{errors.condition && (
							<Typography
								variant='caption'
								color='error'
								sx={{ display: 'block', mt: 1 }}>
								{errors.condition.message}
							</Typography>
						)}
					</Box>

					<FormControlLabel
						control={
							<Controller
								name='declaration'
								control={control}
								render={({ field }) => (
									<Checkbox
										{...register('declaration')}
										checked={!!field.value}
										sx={{
											color: 'warning.main',
											'&.Mui-checked': {
												color: 'warning.main',
											},
										}}
									/>
								)}
							/>
						}
						label={
							<Typography variant='body2' sx={{ fontStyle: 'italic' }}>
								I declare that the information provided is true, accurate and
								complete to the best of my belief and knowledge
							</Typography>
						}
					/>
				</Box>

				{/* Form Actions */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						gap: 2,
						justifyContent: 'flex-end',
						mt: 4,
					}}>
					<Button
						variant='outlined'
						color='error'
						onClick={() => router.push('/members')}
						fullWidth={{ xs: true, sm: false }}>
						Cancel
					</Button>
					<Button
						variant='outlined'
						color='secondary'
						onClick={() => reset()}
						fullWidth={{ xs: true, sm: false }}>
						Reset
					</Button>
					<Button
						variant='contained'
						disabled={createMemberMutation.isLoading}
						type='submit'
						fullWidth={{ xs: true, sm: false }}
						sx={{
							backgroundColor: 'primary.main',
							'&:hover': {
								backgroundColor: 'primary.dark',
							},
						}}>
						{createMemberMutation.isLoading ? 'Submitting...' : 'Register'}
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}
