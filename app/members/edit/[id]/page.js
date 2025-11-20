'use client';

//#region imports
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getMemberbyId } from '@/helpers/api-request';
import { memberSchema, memberDefaultValues } from '@/lib/formValidationSchemas';
import { useUserStore } from '@/app/store/userStore';

// MUI Components
import {
	Box,
	Button,
	Container,
	Paper,
	Grid,
	Typography,
	TextField,
	MenuItem,
	Snackbar,
	Alert,
	IconButton,
	Divider,
	Card,
	CardHeader,
	CardContent,
	Skeleton,
	Checkbox,
	FormControlLabel,
	Stack,
	Tooltip,
} from '@mui/material';

// MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BadgeIcon from '@mui/icons-material/Badge';
//#endregion

export default function EditMemberPage() {
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const { id } = useUserStore((state) => state.user);
	const queryClient = useQueryClient();
	const router = useRouter();

	const MAX_DEPENDANTS = 4;
	const MAX_PARENTS = 2;

	// 1. Fetch Data
	const { data, isLoading, error } = useQuery({
		queryKey: ['getmemberbyId', id],
		queryFn: () => getMemberbyId(id),
		enabled: !!id,
	});

	// 2. Helper to format API data for the form
	const formatData = (member) => {
		if (!member) return memberDefaultValues;
		return {
			...member,
			birthday: member.birthday ? member.birthday.split('T')[0] : '',
			spousebirthday: member.spousebirthday
				? member.spousebirthday.split('T')[0]
				: '',
			children:
				member.children?.map((child) => ({
					id: child.id,
					fullName: child.fullName,
					birthday: child.birthday ? child.birthday.split('T')[0] : '',
				})) || [],
			parents:
				member.parents?.map((parent) => ({
					id: parent.id,
					fullName: parent.fullName,
					birthday: parent.birthday ? parent.birthday.split('T')[0] : '',
					relationship: parent.relationship || '',
				})) || [],
		};
	};

	// 3. Form Setup
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
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

	// 4. Populate form when data loads
	useEffect(() => {
		if (data) {
			reset(formatData(data));
		}
	}, [data, reset]);

	// 5. Mutation
	const updateUserMutation = useMutation({
		mutationFn: (updatedMember) =>
			fetch(`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedMember),
			}).then((res) => {
				if (!res.ok) throw new Error('Failed to update');
				return res.json();
			}),
		onSuccess: () => {
			queryClient.invalidateQueries(['getmemberbyId', id]);
			setOpenSnackbar(true);
		},
	});

	const onSubmit = (formData) => {
		updateUserMutation.mutate(formData);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') return;
		setOpenSnackbar(false);
		// Optional: Redirect after save
		// router.push('/members');
	};

	// --- Render Helpers ---

	if (isLoading) {
		return (
			<Container maxWidth='md' sx={{ py: 8 }}>
				<Stack spacing={2}>
					<Skeleton variant='rectangular' height={60} />
					<Skeleton variant='rectangular' height={200} />
					<Skeleton variant='rectangular' height={200} />
				</Stack>
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxWidth='sm' sx={{ py: 8, textAlign: 'center' }}>
				<Alert severity='error' sx={{ mb: 2 }}>
					Error loading member: {error.message}
				</Alert>
				<Button variant='outlined' onClick={() => router.push('/members')}>
					Go Back
				</Button>
			</Container>
		);
	}

	return (
		<Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
			<Container maxWidth='lg'>
				{/* Header Section */}
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					alignItems='center'
					justifyContent='space-between'
					mb={4}
					gap={2}>
					<Box>
						<Button
							startIcon={<ArrowBackIcon />}
							onClick={() => router.back()}
							sx={{ mb: 1, color: 'text.secondary' }}>
							Back to List
						</Button>
						<Typography variant='h4' fontWeight='bold' color='text.primary'>
							Edit Member Profile
						</Typography>
					</Box>
					{/* Quick Save Button (Desktop) */}
					<Button
						variant='contained'
						size='large'
						startIcon={<SaveIcon />}
						onClick={handleSubmit(onSubmit)}
						disabled={!isDirty || isSubmitting || updateUserMutation.isPending}
						sx={{ display: { xs: 'none', sm: 'flex' } }}>
						{updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
					</Button>
				</Stack>

				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={3}>
						{/* 1. Identity Card */}
						<Card elevation={2}>
							<CardHeader
								avatar={<BadgeIcon color='primary' />}
								title='Identification'
								titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
							/>
							<Divider />
							<CardContent>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<TextField
											fullWidth
											label='National ID'
											placeholder='e.g. GHA-000000000-0'
											{...register('nationalId')}
											error={!!errors.nationalId}
											helperText={errors.nationalId?.message}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											select
											fullWidth
											label='ID Type'
											defaultValue='GhCard'
											{...register('idType')}
											error={!!errors.idType}>
											<MenuItem value='GhCard'>Ghana Card</MenuItem>
											<MenuItem value='Passport'>Passport</MenuItem>
										</TextField>
									</Grid>
								</Grid>
							</CardContent>
						</Card>

						{/* 2. Personal Details Card */}
						<Card elevation={2}>
							<CardHeader
								avatar={<PersonIcon color='primary' />}
								title='Personal Information'
								titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
							/>
							<Divider />
							<CardContent>
								<Grid container spacing={3}>
									<Grid item xs={12} md={4}>
										<TextField
											fullWidth
											label='First Name'
											{...register('firstName')}
											error={!!errors.firstName}
											helperText={errors.firstName?.message}
										/>
									</Grid>
									<Grid item xs={12} md={4}>
										<TextField
											fullWidth
											label='Middle Name'
											{...register('middleName')}
											error={!!errors.middleName}
											helperText={errors.middleName?.message}
										/>
									</Grid>
									<Grid item xs={12} md={4}>
										<TextField
											fullWidth
											label='Last Name'
											{...register('lastName')}
											error={!!errors.lastName}
											helperText={errors.lastName?.message}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
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
									<Grid item xs={12} md={6}>
										<TextField
											select
											fullWidth
											label='Gender'
											defaultValue='Male'
											{...register('gender')}
											error={!!errors.gender}>
											<MenuItem value='Male'>Male</MenuItem>
											<MenuItem value='Female'>Female</MenuItem>
										</TextField>
									</Grid>
								</Grid>
							</CardContent>
						</Card>

						{/* 3. Contact Details */}
						<Card elevation={2}>
							<CardHeader
								avatar={<ContactMailIcon color='primary' />}
								title='Contact Information'
								titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
							/>
							<Divider />
							<CardContent>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<TextField
											fullWidth
											type='email'
											label='Email Address'
											{...register('email')}
											error={!!errors.email}
											helperText={errors.email?.message}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
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
							</CardContent>
						</Card>

						{/* 4. Family Details (Spouse, Children, Parents) */}
						<Card elevation={2}>
							<CardHeader
								avatar={<FamilyRestroomIcon color='primary' />}
								title='Family & Dependants'
								titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
							/>
							<Divider />
							<CardContent>
								{/* Spouse */}
								<Typography
									variant='subtitle2'
									color='text.secondary'
									sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
									Spouse Details
								</Typography>
								<Grid container spacing={3} sx={{ mb: 4 }}>
									<Grid item xs={12} md={6}>
										<TextField
											fullWidth
											label='Spouse Name'
											{...register('spouseFullname')}
											error={!!errors.spouseFullname}
											helperText={errors.spouseFullname?.message}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
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

								<Divider sx={{ my: 3, borderStyle: 'dashed' }} />

								{/* Children */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 2,
									}}>
									<Typography
										variant='subtitle2'
										color='text.secondary'
										sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
										Children ({childFields.length}/{MAX_DEPENDANTS})
									</Typography>
									<Button
										size='small'
										variant='outlined'
										startIcon={<EscalatorWarningIcon />}
										onClick={() => appendChild({ fullName: '', birthday: '' })}
										disabled={childFields.length >= MAX_DEPENDANTS}>
										Add Child
									</Button>
								</Box>

								<Stack spacing={2} sx={{ mb: 4 }}>
									{childFields.map((field, index) => (
										<Paper
											key={field.id}
											variant='outlined'
											sx={{ p: 2, bgcolor: 'grey.50' }}>
											<Grid container spacing={2} alignItems='center'>
												{/* Hidden ID field for updates */}
												<input
													type='hidden'
													{...register(`children.${index}.id`)}
												/>

												<Grid item xs={12} md={6}>
													<TextField
														fullWidth
														size='small'
														label='Full Name'
														{...register(`children.${index}.fullName`)}
														error={!!errors.children?.[index]?.fullName}
														helperText={
															errors.children?.[index]?.fullName?.message
														}
													/>
												</Grid>
												<Grid item xs={10} md={5}>
													<TextField
														fullWidth
														size='small'
														type='date'
														label='Birthday'
														InputLabelProps={{ shrink: true }}
														{...register(`children.${index}.birthday`)}
														error={!!errors.children?.[index]?.birthday}
														helperText={
															errors.children?.[index]?.birthday?.message
														}
													/>
												</Grid>
												<Grid item xs={2} md={1} sx={{ textAlign: 'right' }}>
													<Tooltip title='Remove Child'>
														<IconButton
															color='error'
															onClick={() => removeChild(index)}>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</Grid>
											</Grid>
										</Paper>
									))}
									{childFields.length === 0 && (
										<Typography variant='caption' fontStyle='italic'>
											No children listed.
										</Typography>
									)}
								</Stack>

								<Divider sx={{ my: 3, borderStyle: 'dashed' }} />

								{/* Parents */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 2,
									}}>
									<Typography
										variant='subtitle2'
										color='text.secondary'
										sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
										Parents ({parentFields.length}/{MAX_PARENTS})
									</Typography>
									<Button
										size='small'
										variant='outlined'
										color='secondary'
										startIcon={<FamilyRestroomIcon />}
										onClick={() =>
											appendParent({
												fullName: '',
												birthday: '',
												relationship: 'Father',
											})
										}
										disabled={parentFields.length >= MAX_PARENTS}>
										Add Parent
									</Button>
								</Box>

								<Stack spacing={2}>
									{parentFields.map((field, index) => (
										<Paper
											key={field.id}
											variant='outlined'
											sx={{ p: 2, bgcolor: 'grey.50' }}>
											<Grid container spacing={2} alignItems='center'>
												<input
													type='hidden'
													{...register(`parents.${index}.id`)}
												/>

												<Grid item xs={12} md={4}>
													<TextField
														fullWidth
														size='small'
														label='Parent Name'
														{...register(`parents.${index}.fullName`)}
														error={!!errors.parents?.[index]?.fullName}
													/>
												</Grid>
												<Grid item xs={6} md={3}>
													<TextField
														select
														fullWidth
														size='small'
														label='Relation'
														defaultValue=''
														{...register(`parents.${index}.relationship`)}>
														<MenuItem value='Father'>Father</MenuItem>
														<MenuItem value='Mother'>Mother</MenuItem>
														<MenuItem value='Inlaw'>In-law</MenuItem>
													</TextField>
												</Grid>
												<Grid item xs={6} md={4}>
													<TextField
														fullWidth
														size='small'
														type='date'
														label='Birthday'
														InputLabelProps={{ shrink: true }}
														{...register(`parents.${index}.birthday`)}
													/>
												</Grid>
												<Grid item xs={12} md={1} sx={{ textAlign: 'right' }}>
													<IconButton
														color='error'
														onClick={() => removeParent(index)}>
														<DeleteIcon />
													</IconButton>
												</Grid>
											</Grid>
										</Paper>
									))}
									{parentFields.length === 0 && (
										<Typography variant='caption' fontStyle='italic'>
											No parents listed.
										</Typography>
									)}
								</Stack>
							</CardContent>
						</Card>

						{/* 5. Undertaking / Declaration */}
						<Paper
							sx={{
								p: 3,
								bgcolor: 'warning.50',
								border: '1px dashed',
								borderColor: 'warning.main',
							}}>
							<Typography variant='h6' color='warning.dark' gutterBottom>
								Declarations
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
												color='warning'
											/>
										)}
									/>
								}
								label='Patient has ongoing illness/conditions'
							/>

							<TextField
								fullWidth
								multiline
								rows={2}
								label='Medical Notes'
								placeholder='Details of condition...'
								sx={{ mt: 1, mb: 2, bgcolor: 'white' }}
								{...register('condition')}
							/>

							<FormControlLabel
								control={
									<Controller
										name='declaration'
										control={control}
										render={({ field }) => (
											<Checkbox {...field} checked={!!field.value} />
										)}
									/>
								}
								label={
									<Typography variant='body2' fontWeight='bold'>
										I declare the information provided is accurate.
									</Typography>
								}
							/>
						</Paper>

						{/* Mobile Save Button (Bottom Fixed or just at bottom) */}
						<Button
							fullWidth
							variant='contained'
							size='large'
							type='submit'
							disabled={
								!isDirty || isSubmitting || updateUserMutation.isPending
							}
							startIcon={
								updateUserMutation.isPending ? (
									<Box sx={{ display: 'flex' }}>
										<div className='spinner-border' />
									</Box>
								) : (
									<SaveIcon />
								)
							}
							sx={{ height: 50, display: { xs: 'flex', sm: 'none' } }}>
							{updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
						</Button>
					</Stack>
				</form>
			</Container>

			{/* Success Notification */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<Alert
					onClose={handleCloseSnackbar}
					severity='success'
					variant='filled'
					sx={{ width: '100%' }}>
					Member profile updated successfully!
				</Alert>
			</Snackbar>
		</Box>
	);
}
