'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { memberSchema, memberDefaultValues } from '@/lib/formValidationSchemas';

// MUI Icons
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BadgeIcon from '@mui/icons-material/Badge';

// MUI Components
import {
	Box,
	Paper,
	Typography,
	Button,
	Grid,
	TextField,
	MenuItem,
	IconButton,
	Snackbar,
	Alert,
	Divider,
	Checkbox,
	FormControlLabel,
	FormHelperText,
	Stack,
	CircularProgress,
	InputAdornment,
} from '@mui/material';

export default function RegistrationForm() {
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const router = useRouter();

	// Constants
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
		mode: 'onBlur', // Validates when user leaves the field
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
		if (reason === 'clickaway') return;
		setOpenSnackbar(false);
		if (reason !== 'timeout') {
			router.push('/members');
		}
	};

	const createMemberMutation = useMutation({
		mutationFn: (newMember) =>
			fetch(`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newMember),
			}).then((res) => res.json()),
		onSuccess: () => {
			setOpenSnackbar(true);
			reset(); // Optional: clear form on success
		},
	});

	const onSubmit = (formData) => {
		createMemberMutation.mutate(formData);
	};

	// Helper to render section headers
	const SectionHeader = ({ title, icon }) => (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
			{icon}
			<Typography variant='h6' color='primary.main' fontWeight='600'>
				{title}
			</Typography>
		</Box>
	);

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: 'grey.50',
				py: 4,
				px: { xs: 2, md: 0 },
			}}>
			<Paper
				component='form'
				onSubmit={handleSubmit(onSubmit)}
				elevation={2}
				sx={{
					maxWidth: '1000px',
					margin: '0 auto',
					p: { xs: 3, md: 5 },
					borderRadius: 3,
				}}>
				{/* Header */}
				<Box sx={{ textAlign: 'center', mb: 5 }}>
					<Typography
						variant='h4'
						component='h1'
						fontWeight='bold'
						color='primary'
						gutterBottom>
						Insurance Policy Registration
					</Typography>
					<Typography variant='body1' color='text.secondary'>
						Please fill out the details below to register a new member.
					</Typography>
				</Box>

				<Snackbar
					open={openSnackbar}
					autoHideDuration={2500}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
					<Alert
						onClose={handleClose}
						severity='success'
						variant='filled'
						sx={{ width: '100%' }}>
						Record created successfully! Redirecting...
					</Alert>
				</Snackbar>

				{/* 1. Identification Details */}
				<SectionHeader
					title='Identification'
					icon={<BadgeIcon color='primary' />}
				/>
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label='National ID'
							placeholder='Enter ID Number'
							{...register('nationalId')}
							error={!!errors.nationalId}
							helperText={errors.nationalId?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							select
							fullWidth
							label='Type of Identification'
							defaultValue=''
							{...register('idType')}
							error={!!errors.idType}
							helperText={errors.idType?.message}>
							<MenuItem value='GhCard'>Ghana Card</MenuItem>
							<MenuItem value='Passport'>Passport</MenuItem>
						</TextField>
					</Grid>
				</Grid>

				<Divider sx={{ my: 3 }} />

				{/* 2. Personal Details */}
				<SectionHeader
					title='Personal Details'
					icon={<PersonIcon color='primary' />}
				/>
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							label='First Name'
							{...register('firstName')}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							label='Middle Name'
							{...register('middleName')}
							error={!!errors.middleName}
							helperText={errors.middleName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							label='Last Name'
							{...register('lastName')}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							type='date'
							label='Date of Birth'
							InputLabelProps={{ shrink: true }}
							{...register('birthday')}
							error={!!errors.birthday}
							helperText={errors.birthday?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							select
							fullWidth
							label='Gender'
							defaultValue=''
							{...register('gender')}
							error={!!errors.gender}
							helperText={errors.gender?.message}>
							<MenuItem value='Male'>Male</MenuItem>
							<MenuItem value='Female'>Female</MenuItem>
						</TextField>
					</Grid>
				</Grid>

				<Divider sx={{ my: 3 }} />

				{/* 3. Contact Details */}
				<SectionHeader
					title='Contact Details'
					icon={<ContactMailIcon color='primary' />}
				/>
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							type='email'
							label='Email Address'
							{...register('email')}
							error={!!errors.email}
							helperText={errors.email?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							type='tel'
							label='Telephone'
							{...register('telephone')}
							error={!!errors.telephone}
							helperText={errors.telephone?.message}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label='Residential Address'
							{...register('residence')}
							error={!!errors.residence}
							helperText={errors.residence?.message}
						/>
					</Grid>
				</Grid>

				<Divider sx={{ my: 3 }} />

				{/* 4. Spouse Details */}
				<SectionHeader
					title='Spouse Details'
					icon={<FamilyRestroomIcon color='primary' />}
				/>
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label='Spouse Full Name'
							{...register('spouseFullname')}
							error={!!errors.spouseFullname}
							helperText={errors.spouseFullname?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							type='date'
							label='Spouse Birthday'
							InputLabelProps={{ shrink: true }}
							{...register('spousebirthday')}
							error={!!errors.spousebirthday}
							helperText={errors.spousebirthday?.message}
						/>
					</Grid>
				</Grid>

				<Divider sx={{ my: 3 }} />

				{/* 5. Children Details */}
				<Box sx={{ mb: 4 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}>
						<SectionHeader
							title='Children Details'
							icon={<EscalatorWarningIcon color='primary' />}
						/>
						<Button
							variant='contained'
							size='small'
							onClick={() => appendChild({ fullName: '', birthday: '' })}
							disabled={childFields.length >= MAX_DEPENDANTS}
							startIcon={<EscalatorWarningIcon />}>
							Add Child
						</Button>
					</Box>

					{childFields.length === 0 && (
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{ fontStyle: 'italic', ml: 4 }}>
							No children added.
						</Typography>
					)}

					<Stack spacing={2}>
						{childFields.map((field, index) => (
							<Paper
								key={field.id}
								variant='outlined'
								sx={{ p: 2, bgcolor: 'grey.50', position: 'relative' }}>
								<Box sx={{ position: 'absolute', top: 8, right: 8 }}>
									<IconButton
										size='small'
										color='error'
										onClick={() => removeChild(index)}
										aria-label='remove child'>
										<DeleteIcon fontSize='small' />
									</IconButton>
								</Box>
								<Grid container spacing={2} alignItems='flex-start'>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											size='small'
											label={`Child ${index + 1} Full Name`}
											{...register(`children.${index}.fullName`)}
											error={!!errors.children?.[index]?.fullName}
											helperText={
												errors.children?.[index]?.fullName
													? 'Full name is required'
													: ''
											}
										/>
									</Grid>
									<Grid item xs={12} sm={5}>
										<TextField
											fullWidth
											size='small'
											type='date'
											label='Birthday'
											InputLabelProps={{ shrink: true }}
											{...register(`children.${index}.birthday`)}
											error={!!errors.children?.[index]?.birthday}
											helperText={
												errors.children?.[index]?.birthday
													? 'Birthday is required'
													: ''
											}
										/>
									</Grid>
								</Grid>
							</Paper>
						))}
					</Stack>
				</Box>

				<Divider sx={{ my: 3 }} />

				{/* 6. Parent Details */}
				<Box sx={{ mb: 4 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}>
						<SectionHeader
							title='Parent Details'
							icon={<FamilyRestroomIcon color='primary' />}
						/>
						<Button
							variant='contained'
							color='secondary'
							size='small'
							onClick={() =>
								appendParent({ fullName: '', birthday: '', relationship: '' })
							}
							disabled={parentFields.length >= MAX_PARENTS}
							startIcon={<FamilyRestroomIcon />}>
							Add Parent
						</Button>
					</Box>

					{parentFields.length === 0 && (
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{ fontStyle: 'italic', ml: 4 }}>
							No parents added.
						</Typography>
					)}

					<Stack spacing={2}>
						{parentFields.map((field, index) => (
							<Paper
								key={field.id}
								variant='outlined'
								sx={{ p: 2, bgcolor: 'grey.50', position: 'relative' }}>
								<Box sx={{ position: 'absolute', top: 8, right: 8 }}>
									<IconButton
										size='small'
										color='error'
										onClick={() => removeParent(index)}
										aria-label='remove parent'>
										<DeleteIcon fontSize='small' />
									</IconButton>
								</Box>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={5}>
										<TextField
											fullWidth
											size='small'
											label={`Parent ${index + 1} Full Name`}
											{...register(`parents.${index}.fullName`)}
											error={!!errors.parents?.[index]?.fullName}
											helperText={
												errors.parents?.[index]?.fullName ? 'Required' : ''
											}
										/>
									</Grid>
									<Grid item xs={12} sm={3}>
										<TextField
											fullWidth
											size='small'
											type='date'
											label='Birthday'
											InputLabelProps={{ shrink: true }}
											{...register(`parents.${index}.birthday`)}
											error={!!errors.parents?.[index]?.birthday}
											helperText={
												errors.parents?.[index]?.birthday ? 'Required' : ''
											}
										/>
									</Grid>
									<Grid item xs={12} sm={3}>
										<TextField
											select
											fullWidth
											size='small'
											label='Relation'
											defaultValue=''
											{...register(`parents.${index}.relationship`)}
											error={!!errors.parents?.[index]?.relationship}
											helperText={
												errors.parents?.[index]?.relationship ? 'Required' : ''
											}>
											<MenuItem value='Father'>Father</MenuItem>
											<MenuItem value='Mother'>Mother</MenuItem>
											<MenuItem value='Inlaw'>In-law</MenuItem>
										</TextField>
									</Grid>
								</Grid>
							</Paper>
						))}
					</Stack>
				</Box>

				<Divider sx={{ my: 3 }} />

				{/* 7. Undertaking */}
				<Box
					sx={{
						mb: 4,
						p: 2,
						bgcolor: 'warning.50',
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'warning.100',
					}}>
					<Typography variant='h6' gutterBottom color='warning.main'>
						Undertaking & Declaration
					</Typography>

					<Controller
						name='underlying'
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={
									<Checkbox
										{...field}
										checked={!!field.value}
										color='warning'
									/>
								}
								label={
									<Typography variant='body2'>
										Do you or your relatives listed have any ongoing illness or
										condition?
									</Typography>
								}
							/>
						)}
					/>

					<TextField
						fullWidth
						multiline
						rows={3}
						label='Known Health Conditions (If any)'
						placeholder='Please describe details here...'
						sx={{ mt: 2, mb: 2, bgcolor: 'background.paper' }}
						{...register('condition')}
						error={!!errors.condition}
						helperText={errors.condition?.message}
					/>

					<Controller
						name='declaration'
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={
									<Checkbox
										{...field}
										checked={!!field.value}
										color='primary'
									/>
								}
								label={
									<Typography variant='body2' fontWeight='500'>
										I declare that the information provided is true, accurate,
										and complete.
									</Typography>
								}
							/>
						)}
					/>
					{errors.declaration && (
						<FormHelperText error>
							You must accept the declaration
						</FormHelperText>
					)}
				</Box>

				{/* Action Buttons */}
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent='flex-end'
					sx={{ mt: 4 }}>
					<Button
						variant='outlined'
						color='inherit'
						onClick={() => router.push('/members')}>
						Cancel
					</Button>
					<Button variant='outlined' color='secondary' onClick={() => reset()}>
						Reset Form
					</Button>
					<Button
						variant='contained'
						size='large'
						type='submit'
						disabled={createMemberMutation.isLoading || isSubmitting}
						startIcon={
							createMemberMutation.isLoading ? (
								<CircularProgress size={20} color='inherit' />
							) : (
								<SaveIcon />
							)
						}
						sx={{ px: 4 }}>
						{createMemberMutation.isLoading
							? 'Submitting...'
							: 'Register Policy'}
					</Button>
				</Stack>
			</Paper>
		</Box>
	);
}
