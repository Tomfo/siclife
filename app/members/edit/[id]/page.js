'use client';
//#region  imports
import { getMemberbyId, updateMember } from '@/helpers/api-request';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { memberSchema, memberDefaultValues } from '@/lib/formValidationSchemas';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AddIcon from '@mui/icons-material/Add';
import {
	Button,
	CircularProgress,
	Box,
	Container,
	Paper,
	Grid,
	Stack,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { useUserStore } from '@/app/store/userStore';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
//#endregion

export default function EditMemberPage() {
	const [open, setOpen] = useState(false);
	const { id } = useUserStore((state) => state.user);
	const queryClient = useQueryClient();
	const params = useParams();
	const router = useRouter();
	const MAX_DEPENDANTS = 4;
	const MAX_PARENTS = 2;

	const { data, isLoading, error } = useQuery({
		queryKey: ['getmemberbyId', id],
		queryFn: () => getMemberbyId(id),
		enabled: !!id, // only run if id is truthy
	});

	const formatData = (member) => {
		if (!member) return {};

		return {
			...data,
			birthday: data.birthday.split('T')[0],
			spousebirthday: data.spousebirthday.split('T')[0],
			children: data.children.map((child) => ({
				id: child.id,
				fullName: child.fullName,
				birthday: child.birthday.split('T')[0],
			})),
			parents: data.parents.map((parent) => ({
				id: parent.id,
				fullName: parent.fullName,
				birthday: parent.birthday.split('T')[0],
			})),
		};
	};

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

	// Field Arrays
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

	// Update form values when userData is available
	useEffect(() => {
		if (data) {
			reset(formatData(data));
		}
	}, [data, reset]);

	// Mutation for updating user
	const updateUserMutation = useMutation({
		mutationFn: (updatedMember) =>
			fetch(`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedMember),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries(['getmemberbyId', id]);
			setOpen(true);
		},
	});

	const onSubmit = (formData) => {
		updateUserMutation.mutate(formData);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
		router.push('/members');
	};

	if (isLoading) {
		return (
			<Box display='flex' justifyContent='center' mt={4}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box mt={4} textAlign='center'>
				<Alert severity='error' sx={{ mb: 2 }}>
					{error.message}
				</Alert>
			</Box>
		);
	}

	return (
		// <Container maxWidth='lg' sx={{ py: 4 }}>
		// 	<Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
		// 		<form onSubmit={handleSubmit(onSubmit)}>
		// 			<Typography
		// 				variant='h4'
		// 				component='h1'
		// 				gutterBottom
		// 				align='center'
		// 				sx={{
		// 					color: 'primary.main',
		// 					fontWeight: 'bold',
		// 					mb: 4,
		// 				}}>
		// 				Insurance Policy Registration Update
		// 			</Typography>

		// 			<Snackbar
		// 				open={open}
		// 				autoHideDuration={2000}
		// 				onClose={handleClose}
		// 				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
		// 				<Alert
		// 					onClose={handleClose}
		// 					severity='success'
		// 					variant='filled'
		// 					sx={{ width: '100%' }}>
		// 					Record updated successfully 🙂
		// 				</Alert>
		// 			</Snackbar>

		// 			{/* Identification Details */}
		// 			<Box sx={{ mb: 4 }}>
		// 				<Typography
		// 					variant='h6'
		// 					component='h2'
		// 					sx={{
		// 						color: 'secondary.main',
		// 						fontWeight: 'bold',
		// 						mb: 2,
		// 					}}>
		// 					Identification Details
		// 				</Typography>
		// 				<Grid container spacing={3}>
		// 					<Grid item xs={12} md={6}>
		// 						<TextField
		// 							fullWidth
		// 							label='National ID'
		// 							variant='outlined'
		// 							{...register('nationalId')}
		// 							error={!!errors.nationalId}
		// 							helperText={errors.nationalId?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={6}>
		// 						<FormControl fullWidth>
		// 							<InputLabel>Type of Identification</InputLabel>
		// 							<Select
		// 								label='Type of Identification'
		// 								{...register('idType')}
		// 								defaultValue='GhCard'>
		// 								<MenuItem value='GhCard'>Ghana Card</MenuItem>
		// 								<MenuItem value='Passport'>Passport</MenuItem>
		// 							</Select>
		// 						</FormControl>
		// 					</Grid>
		// 				</Grid>
		// 			</Box>

		// 			{/* Personal Details */}
		// 			<Box sx={{ mb: 4 }}>
		// 				<Typography
		// 					variant='h6'
		// 					component='h2'
		// 					sx={{
		// 						color: 'secondary.main',
		// 						fontWeight: 'bold',
		// 						mb: 2,
		// 					}}>
		// 					Personal Details
		// 				</Typography>
		// 				<Grid container spacing={3}>
		// 					<Grid item xs={12} md={4}>
		// 						<TextField
		// 							fullWidth
		// 							label='First Name'
		// 							variant='outlined'
		// 							{...register('firstName')}
		// 							error={!!errors.firstName}
		// 							helperText={errors.firstName?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={4}>
		// 						<TextField
		// 							fullWidth
		// 							label='Middle Name'
		// 							variant='outlined'
		// 							{...register('middleName')}
		// 							error={!!errors.middleName}
		// 							helperText={errors.middleName?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={4}>
		// 						<TextField
		// 							fullWidth
		// 							label='Last Name'
		// 							variant='outlined'
		// 							{...register('lastName')}
		// 							error={!!errors.lastName}
		// 							helperText={errors.lastName?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={4}>
		// 						<TextField
		// 							fullWidth
		// 							label='Birthday'
		// 							type='date'
		// 							variant='outlined'
		// 							InputLabelProps={{ shrink: true }}
		// 							{...register('birthday')}
		// 							error={!!errors.birthday}
		// 							helperText={errors.birthday?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={4}>
		// 						<FormControl fullWidth>
		// 							<InputLabel>Gender</InputLabel>
		// 							<Select
		// 								label='Gender'
		// 								{...register('gender')}
		// 								defaultValue='Male'>
		// 								<MenuItem value='Male'>Male</MenuItem>
		// 								<MenuItem value='Female'>Female</MenuItem>
		// 							</Select>
		// 						</FormControl>
		// 					</Grid>
		// 				</Grid>
		// 			</Box>

		// 			{/* Contact Details */}
		// 			<Box sx={{ mb: 4 }}>
		// 				<Typography
		// 					variant='h6'
		// 					component='h2'
		// 					sx={{
		// 						color: 'secondary.main',
		// 						fontWeight: 'bold',
		// 						mb: 2,
		// 					}}>
		// 					Contact Details
		// 				</Typography>
		// 				<Grid container spacing={3}>
		// 					<Grid item xs={12} md={4}>
		// 						<TextField
		// 							fullWidth
		// 							label='Email'
		// 							variant='outlined'
		// 							{...register('email')}
		// 							error={!!errors.email}
		// 							helperText={errors.email?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={4}>
		// 						<TextField
		// 							fullWidth
		// 							label='Telephone'
		// 							variant='outlined'
		// 							{...register('telephone')}
		// 							error={!!errors.telephone}
		// 							helperText={errors.telephone?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={4}>
		// 						<TextField
		// 							fullWidth
		// 							label='Address'
		// 							variant='outlined'
		// 							{...register('residence')}
		// 							error={!!errors.residence}
		// 							helperText={errors.residence?.message}
		// 						/>
		// 					</Grid>
		// 				</Grid>
		// 			</Box>

		// 			{/* Spouse Details */}
		// 			<Box sx={{ mb: 4 }}>
		// 				<Typography
		// 					variant='h6'
		// 					component='h2'
		// 					sx={{
		// 						color: 'secondary.main',
		// 						fontWeight: 'bold',
		// 						mb: 2,
		// 					}}>
		// 					Spouse Details
		// 				</Typography>
		// 				<Grid container spacing={3}>
		// 					<Grid item xs={12} md={6}>
		// 						<TextField
		// 							fullWidth
		// 							label='Spouse Full Name'
		// 							variant='outlined'
		// 							{...register('spouseFullname')}
		// 							error={!!errors.spouseFullname}
		// 							helperText={errors.spouseFullname?.message}
		// 						/>
		// 					</Grid>
		// 					<Grid item xs={12} md={6}>
		// 						<TextField
		// 							fullWidth
		// 							label='Spouse Birthday'
		// 							type='date'
		// 							variant='outlined'
		// 							InputLabelProps={{ shrink: true }}
		// 							{...register('spousebirthday')}
		// 							error={!!errors.spousebirthday}
		// 							helperText={errors.spousebirthday?.message}
		// 						/>
		// 					</Grid>
		// 				</Grid>
		// 			</Box>

		// 			{/* Children Details */}
		// 			<Box sx={{ mb: 4 }}>
		// 				<Typography
		// 					variant='h6'
		// 					component='h2'
		// 					sx={{
		// 						color: 'secondary.main',
		// 						fontWeight: 'bold',
		// 						mb: 2,
		// 					}}>
		// 					Children Details
		// 				</Typography>

		// 				{childFields.map((field, index) => (
		// 					<Grid container spacing={3} key={field.id} sx={{ mb: 2 }}>
		// 						<input type='hidden' {...register(`children.${index}.id`)} />
		// 						<Grid item xs={12} md={5}>
		// 							<TextField
		// 								fullWidth
		// 								label={`Child ${index + 1} Full Name`}
		// 								variant='outlined'
		// 								{...register(`children.${index}.fullName`)}
		// 								error={!!errors.children?.[index]?.fullName}
		// 								helperText={errors.children?.[index]?.fullName?.message}
		// 							/>
		// 						</Grid>
		// 						<Grid item xs={12} md={5}>
		// 							<TextField
		// 								fullWidth
		// 								label='Birthday'
		// 								type='date'
		// 								variant='outlined'
		// 								InputLabelProps={{ shrink: true }}
		// 								{...register(`children.${index}.birthday`)}
		// 								error={!!errors.children?.[index]?.birthday}
		// 								helperText={errors.children?.[index]?.birthday?.message}
		// 							/>
		// 						</Grid>
		// 						<Grid
		// 							item
		// 							xs={12}
		// 							md={2}
		// 							sx={{ display: 'flex', alignItems: 'center' }}>
		// 							<IconButton
		// 								color='error'
		// 								onClick={() => removeChild(index)}
		// 								aria-label='remove child'>
		// 								<DeleteIcon />
		// 							</IconButton>
		// 						</Grid>
		// 					</Grid>
		// 				))}

		// 				<Button
		// 					variant='contained'
		// 					startIcon={<EscalatorWarningIcon />}
		// 					onClick={() => appendChild({ fullName: '', birthday: '' })}
		// 					disabled={childFields.length >= MAX_DEPENDANTS}
		// 					sx={{ mt: 2 }}>
		// 					Add Child
		// 				</Button>
		// 			</Box>

		// 			{/* Parent Details */}
		// 			<Box sx={{ mb: 4 }}>
		// 				<Typography
		// 					variant='h6'
		// 					component='h2'
		// 					sx={{
		// 						color: 'secondary.main',
		// 						fontWeight: 'bold',
		// 						mb: 2,
		// 					}}>
		// 					Parent Details
		// 				</Typography>

		// 				{parentFields.map((field, index) => (
		// 					<Grid container spacing={3} key={field.id} sx={{ mb: 2 }}>
		// 						<input type='hidden' {...register(`parents.${index}.id`)} />
		// 						<Grid item xs={12} md={4}>
		// 							<TextField
		// 								fullWidth
		// 								label={`Parent ${index + 1} Full Name`}
		// 								variant='outlined'
		// 								{...register(`parents.${index}.fullName`)}
		// 								error={!!errors.parents?.[index]?.fullName}
		// 								helperText={errors.parents?.[index]?.fullName?.message}
		// 							/>
		// 						</Grid>
		// 						<Grid item xs={12} md={3}>
		// 							<TextField
		// 								fullWidth
		// 								label='Birthday'
		// 								type='date'
		// 								variant='outlined'
		// 								InputLabelProps={{ shrink: true }}
		// 								{...register(`parents.${index}.birthday`)}
		// 								error={!!errors.parents?.[index]?.birthday}
		// 								helperText={errors.parents?.[index]?.birthday?.message}
		// 							/>
		// 						</Grid>
		// 						<Grid item xs={12} md={3}>
		// 							<FormControl fullWidth>
		// 								<InputLabel>Relationship</InputLabel>
		// 								<Select
		// 									label='Relationship'
		// 									{...register(`parents.${index}.relationship`)}
		// 									defaultValue='Father'>
		// 									<MenuItem value='Father'>Father</MenuItem>
		// 									<MenuItem value='Mother'>Mother</MenuItem>
		// 									<MenuItem value='Inlaw'>In-law</MenuItem>
		// 								</Select>
		// 							</FormControl>
		// 						</Grid>
		// 						<Grid
		// 							item
		// 							xs={12}
		// 							md={2}
		// 							sx={{ display: 'flex', alignItems: 'center' }}>
		// 							<IconButton
		// 								color='error'
		// 								onClick={() => removeParent(index)}
		// 								aria-label='remove parent'>
		// 								<DeleteIcon />
		// 							</IconButton>
		// 						</Grid>
		// 					</Grid>
		// 				))}

		// 				<Button
		// 					variant='contained'
		// 					color='secondary'
		// 					startIcon={<FamilyRestroomIcon />}
		// 					onClick={() =>
		// 						appendParent({ fullName: '', birthday: '', relationship: '' })
		// 					}
		// 					disabled={parentFields.length >= MAX_PARENTS}
		// 					sx={{ mt: 2 }}>
		// 					Add Parent
		// 				</Button>
		// 			</Box>

		// 			{/* Undertaking */}
		// 			<Box sx={{ mb: 4 }}>
		// 				<Typography
		// 					variant='h6'
		// 					component='h2'
		// 					sx={{
		// 						color: 'secondary.main',
		// 						fontWeight: 'bold',
		// 						mb: 2,
		// 					}}>
		// 					Undertaking
		// 				</Typography>

		// 				<FormControlLabel
		// 					control={
		// 						<Controller
		// 							name='underlying'
		// 							control={control}
		// 							render={({ field }) => (
		// 								<Checkbox
		// 									{...field}
		// 									checked={field.value}
		// 									sx={{
		// 										color: 'warning.main',
		// 										'&.Mui-checked': {
		// 											color: 'warning.main',
		// 										},
		// 									}}
		// 								/>
		// 							)}
		// 						/>
		// 					}
		// 					label={
		// 						<Typography variant='body1' sx={{ fontStyle: 'italic' }}>
		// 							Do you or your relatives listed have any ongoing illness or
		// 							condition?
		// 						</Typography>
		// 					}
		// 					sx={{ mb: 2 }}
		// 				/>

		// 				<TextField
		// 					fullWidth
		// 					label='Known Health Conditions'
		// 					variant='outlined'
		// 					multiline
		// 					rows={3}
		// 					{...register('condition')}
		// 					error={!!errors.condition}
		// 					helperText={errors.condition?.message}
		// 					sx={{ mb: 3 }}
		// 				/>

		// 				<FormControlLabel
		// 					control={
		// 						<Controller
		// 							name='declaration'
		// 							control={control}
		// 							render={({ field }) => (
		// 								<Checkbox
		// 									{...field}
		// 									checked={field.value}
		// 									sx={{
		// 										color: 'warning.main',
		// 										'&.Mui-checked': {
		// 											color: 'warning.main',
		// 										},
		// 									}}
		// 								/>
		// 							)}
		// 						/>
		// 					}
		// 					label={
		// 						<Typography variant='body1' sx={{ fontStyle: 'italic' }}>
		// 							I declare that the information provided is true, accurate and
		// 							complete to the best of my belief and knowledge
		// 						</Typography>
		// 					}
		// 				/>
		// 			</Box>

		// 			{/* Form Actions */}
		// 			<Box
		// 				sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
		// 				<Button
		// 					variant='outlined'
		// 					color='error'
		// 					onClick={() => reset()}
		// 					size='large'>
		// 					Cancel
		// 				</Button>
		// 				<Button
		// 					variant='contained'
		// 					disabled={updateUserMutation.isLoading}
		// 					type='submit'
		// 					size='large'>
		// 					{updateUserMutation.isPending ? 'Saving...' : 'Save'}
		// 				</Button>
		// 			</Box>
		// 		</form>
		// 	</Paper>
		// </Container>
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
					Insurance Policy Registration Update
				</Typography>

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
						Record updated successfully 🙂
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
						onClick={() => reset()}
						fullWidth={{ xs: true, sm: false }}>
						Cancel
					</Button>

					<Button
						variant='contained'
						disabled={updateUserMutation.isLoading}
						type='submit'
						fullWidth={{ xs: true, sm: false }}
						sx={{
							backgroundColor: 'primary.main',
							'&:hover': {
								backgroundColor: 'primary.dark',
							},
						}}>
						{updateUserMutation.isPending ? 'Saving...' : 'Save'}
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}
