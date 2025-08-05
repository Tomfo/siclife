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
		<Container maxWidth='lg' sx={{ py: 4 }}>
			<Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Typography
						variant='h4'
						component='h1'
						gutterBottom
						align='center'
						sx={{
							color: 'primary.main',
							fontWeight: 'bold',
							mb: 4,
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
							sx={{
								color: 'secondary.main',
								fontWeight: 'bold',
								mb: 2,
							}}>
							Identification Details
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									label='National ID'
									variant='outlined'
									{...register('nationalId')}
									error={!!errors.nationalId}
									helperText={errors.nationalId?.message}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Type of Identification</InputLabel>
									<Select
										label='Type of Identification'
										{...register('idType')}
										defaultValue='GhCard'>
										<MenuItem value='GhCard'>Ghana Card</MenuItem>
										<MenuItem value='Passport'>Passport</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Box>

					{/* Personal Details */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant='h6'
							component='h2'
							sx={{
								color: 'secondary.main',
								fontWeight: 'bold',
								mb: 2,
							}}>
							Personal Details
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label='First Name'
									variant='outlined'
									{...register('firstName')}
									error={!!errors.firstName}
									helperText={errors.firstName?.message}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label='Middle Name'
									variant='outlined'
									{...register('middleName')}
									error={!!errors.middleName}
									helperText={errors.middleName?.message}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label='Last Name'
									variant='outlined'
									{...register('lastName')}
									error={!!errors.lastName}
									helperText={errors.lastName?.message}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label='Birthday'
									type='date'
									variant='outlined'
									InputLabelProps={{ shrink: true }}
									{...register('birthday')}
									error={!!errors.birthday}
									helperText={errors.birthday?.message}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControl fullWidth>
									<InputLabel>Gender</InputLabel>
									<Select
										label='Gender'
										{...register('gender')}
										defaultValue='Male'>
										<MenuItem value='Male'>Male</MenuItem>
										<MenuItem value='Female'>Female</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Box>

					{/* Contact Details */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant='h6'
							component='h2'
							sx={{
								color: 'secondary.main',
								fontWeight: 'bold',
								mb: 2,
							}}>
							Contact Details
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label='Email'
									variant='outlined'
									{...register('email')}
									error={!!errors.email}
									helperText={errors.email?.message}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label='Telephone'
									variant='outlined'
									{...register('telephone')}
									error={!!errors.telephone}
									helperText={errors.telephone?.message}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label='Address'
									variant='outlined'
									{...register('residence')}
									error={!!errors.residence}
									helperText={errors.residence?.message}
								/>
							</Grid>
						</Grid>
					</Box>

					{/* Spouse Details */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant='h6'
							component='h2'
							sx={{
								color: 'secondary.main',
								fontWeight: 'bold',
								mb: 2,
							}}>
							Spouse Details
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									label='Spouse Full Name'
									variant='outlined'
									{...register('spouseFullname')}
									error={!!errors.spouseFullname}
									helperText={errors.spouseFullname?.message}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									label='Spouse Birthday'
									type='date'
									variant='outlined'
									InputLabelProps={{ shrink: true }}
									{...register('spousebirthday')}
									error={!!errors.spousebirthday}
									helperText={errors.spousebirthday?.message}
								/>
							</Grid>
						</Grid>
					</Box>

					{/* Children Details */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant='h6'
							component='h2'
							sx={{
								color: 'secondary.main',
								fontWeight: 'bold',
								mb: 2,
							}}>
							Children Details
						</Typography>

						{childFields.map((field, index) => (
							<Grid container spacing={3} key={field.id} sx={{ mb: 2 }}>
								<input type='hidden' {...register(`children.${index}.id`)} />
								<Grid item xs={12} md={5}>
									<TextField
										fullWidth
										label={`Child ${index + 1} Full Name`}
										variant='outlined'
										{...register(`children.${index}.fullName`)}
										error={!!errors.children?.[index]?.fullName}
										helperText={errors.children?.[index]?.fullName?.message}
									/>
								</Grid>
								<Grid item xs={12} md={5}>
									<TextField
										fullWidth
										label='Birthday'
										type='date'
										variant='outlined'
										InputLabelProps={{ shrink: true }}
										{...register(`children.${index}.birthday`)}
										error={!!errors.children?.[index]?.birthday}
										helperText={errors.children?.[index]?.birthday?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									md={2}
									sx={{ display: 'flex', alignItems: 'center' }}>
									<IconButton
										color='error'
										onClick={() => removeChild(index)}
										aria-label='remove child'>
										<DeleteIcon />
									</IconButton>
								</Grid>
							</Grid>
						))}

						<Button
							variant='contained'
							startIcon={<EscalatorWarningIcon />}
							onClick={() => appendChild({ fullName: '', birthday: '' })}
							disabled={childFields.length >= MAX_DEPENDANTS}
							sx={{ mt: 2 }}>
							Add Child
						</Button>
					</Box>

					{/* Parent Details */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant='h6'
							component='h2'
							sx={{
								color: 'secondary.main',
								fontWeight: 'bold',
								mb: 2,
							}}>
							Parent Details
						</Typography>

						{parentFields.map((field, index) => (
							<Grid container spacing={3} key={field.id} sx={{ mb: 2 }}>
								<input type='hidden' {...register(`parents.${index}.id`)} />
								<Grid item xs={12} md={4}>
									<TextField
										fullWidth
										label={`Parent ${index + 1} Full Name`}
										variant='outlined'
										{...register(`parents.${index}.fullName`)}
										error={!!errors.parents?.[index]?.fullName}
										helperText={errors.parents?.[index]?.fullName?.message}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField
										fullWidth
										label='Birthday'
										type='date'
										variant='outlined'
										InputLabelProps={{ shrink: true }}
										{...register(`parents.${index}.birthday`)}
										error={!!errors.parents?.[index]?.birthday}
										helperText={errors.parents?.[index]?.birthday?.message}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<FormControl fullWidth>
										<InputLabel>Relationship</InputLabel>
										<Select
											label='Relationship'
											{...register(`parents.${index}.relationship`)}
											defaultValue='Father'>
											<MenuItem value='Father'>Father</MenuItem>
											<MenuItem value='Mother'>Mother</MenuItem>
											<MenuItem value='Inlaw'>In-law</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid
									item
									xs={12}
									md={2}
									sx={{ display: 'flex', alignItems: 'center' }}>
									<IconButton
										color='error'
										onClick={() => removeParent(index)}
										aria-label='remove parent'>
										<DeleteIcon />
									</IconButton>
								</Grid>
							</Grid>
						))}

						<Button
							variant='contained'
							color='secondary'
							startIcon={<FamilyRestroomIcon />}
							onClick={() =>
								appendParent({ fullName: '', birthday: '', relationship: '' })
							}
							disabled={parentFields.length >= MAX_PARENTS}
							sx={{ mt: 2 }}>
							Add Parent
						</Button>
					</Box>

					{/* Undertaking */}
					<Box sx={{ mb: 4 }}>
						<Typography
							variant='h6'
							component='h2'
							sx={{
								color: 'secondary.main',
								fontWeight: 'bold',
								mb: 2,
							}}>
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
											checked={field.value}
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
								<Typography variant='body1' sx={{ fontStyle: 'italic' }}>
									Do you or your relatives listed have any ongoing illness or
									condition?
								</Typography>
							}
							sx={{ mb: 2 }}
						/>

						<TextField
							fullWidth
							label='Known Health Conditions'
							variant='outlined'
							multiline
							rows={3}
							{...register('condition')}
							error={!!errors.condition}
							helperText={errors.condition?.message}
							sx={{ mb: 3 }}
						/>

						<FormControlLabel
							control={
								<Controller
									name='declaration'
									control={control}
									render={({ field }) => (
										<Checkbox
											{...field}
											checked={field.value}
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
								<Typography variant='body1' sx={{ fontStyle: 'italic' }}>
									I declare that the information provided is true, accurate and
									complete to the best of my belief and knowledge
								</Typography>
							}
						/>
					</Box>

					{/* Form Actions */}
					<Box
						sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
						<Button
							variant='outlined'
							color='error'
							onClick={() => reset()}
							size='large'>
							Cancel
						</Button>
						<Button
							variant='contained'
							disabled={updateUserMutation.isLoading}
							type='submit'
							size='large'>
							{updateUserMutation.isPending ? 'Saving...' : 'Save'}
						</Button>
					</Box>
				</form>
			</Paper>
		</Container>
	);
}
