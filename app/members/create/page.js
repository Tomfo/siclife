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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
	Checkbox,
	FormControlLabel,
	FormHelperText,
	Stack,
	CircularProgress,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Container,
	Card,
	CardContent,
	Avatar,
	Divider,
} from '@mui/material';

// Define steps for the stepper
const STEPS = [
	{ label: 'Identity', description: 'National ID & Type' },
	{ label: 'Personal', description: 'Name, DOB & Gender' },
	{ label: 'Contact', description: 'Address & Contact Info' },
	{ label: 'Family', description: 'Spouse, Children & Parents' },
	{ label: 'Review', description: 'Declaration & Submission' },
];

export default function RegistrationForm() {
	const [activeStep, setActiveStep] = useState(0);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const router = useRouter();

	// Constants
	const MAX_DEPENDANTS = 4;
	const MAX_PARENTS = 2;

	const {
		control,
		register,
		handleSubmit,
		trigger,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: memberDefaultValues,
		resolver: yupResolver(memberSchema),
		mode: 'onChange',
	});

	const {
		fields: childFields,
		append: appendChild,
		remove: removeChild,
	} = useFieldArray({ control, name: 'children' });

	const {
		fields: parentFields,
		append: appendParent,
		remove: removeParent,
	} = useFieldArray({ control, name: 'parents' });

	// Mutation
	const createMemberMutation = useMutation({
		mutationFn: (newMember) =>
			fetch(`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newMember),
			}).then((res) => res.json()),
		onSuccess: () => {
			setOpenSnackbar(true);
			reset();
		},
	});

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') return;
		setOpenSnackbar(false);
		router.push('/members');
	};

	const onSubmit = (formData) => {
		createMemberMutation.mutate(formData);
	};

	// --- Navigation Logic ---

	const handleNext = async () => {
		// Define fields to validate per step
		let fieldsToValidate = [];

		switch (activeStep) {
			case 0:
				fieldsToValidate = ['nationalId', 'idType'];
				break;
			case 1:
				fieldsToValidate = [
					'firstName',
					'lastName',
					'middleName',
					'birthday',
					'gender',
				];
				break;
			case 2:
				fieldsToValidate = ['email', 'telephone', 'residence'];
				break;
			case 3:
				fieldsToValidate = [
					'spouseFullname',
					'spousebirthday',
					'children',
					'parents',
				];
				break;
			case 4:
				fieldsToValidate = ['declaration', 'condition'];
				break;
			default:
				break;
		}

		const isStepValid = await trigger(fieldsToValidate);
		if (isStepValid) {
			setActiveStep((prev) => prev + 1);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// --- UI Sub-Components ---

	const FormSection = ({ children, title, icon }) => (
		<Box sx={{ animation: 'fadeIn 0.5s' }}>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
				<Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
					{icon}
				</Avatar>
				<Typography variant='h5' fontWeight='600' color='text.primary'>
					{title}
				</Typography>
			</Box>
			{children}
		</Box>
	);

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
			<Container maxWidth='md'>
				{/* Header */}
				<Box sx={{ textAlign: 'center', mb: 4 }}>
					<Typography
						variant='h4'
						fontWeight='800'
						color='primary.main'
						gutterBottom>
						Insurance Registration
					</Typography>
					<Typography variant='subtitle1' color='text.secondary'>
						Complete the steps below to register a new policy member.
					</Typography>
				</Box>

				{/* Stepper (Hidden on very small screens, visible on sm+) */}
				<Paper
					sx={{
						p: 3,
						mb: 4,
						display: { xs: 'none', sm: 'block' },
						borderRadius: 2,
					}}
					elevation={1}>
					<Stepper activeStep={activeStep} alternativeLabel>
						{STEPS.map((step) => (
							<Step key={step.label}>
								<StepLabel>{step.label}</StepLabel>
							</Step>
						))}
					</Stepper>
				</Paper>

				{/* Main Form Card */}
				<Card elevation={3} sx={{ borderRadius: 3, overflow: 'visible' }}>
					<CardContent sx={{ p: { xs: 2, md: 5 } }}>
						<form onSubmit={handleSubmit(onSubmit)}>
							{/* STEP 0: IDENTIFICATION */}
							{activeStep === 0 && (
								<FormSection title='Identification' icon={<BadgeIcon />}>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												label='National ID'
												placeholder='e.g. GHA-123456789-0'
												{...register('nationalId')}
												error={!!errors.nationalId}
												helperText={errors.nationalId?.message}
												InputProps={{ sx: { borderRadius: 2 } }}
											/>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												select
												fullWidth
												label='ID Type'
												defaultValue='GhCard'
												{...register('idType')}
												error={!!errors.idType}
												helperText={errors.idType?.message}
												InputProps={{ sx: { borderRadius: 2 } }}>
												<MenuItem value='GhCard'>Ghana Card</MenuItem>
												<MenuItem value='Passport'>Passport</MenuItem>
											</TextField>
										</Grid>
									</Grid>
								</FormSection>
							)}

							{/* STEP 1: PERSONAL */}
							{activeStep === 1 && (
								<FormSection title='Personal Information' icon={<PersonIcon />}>
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
												error={!!errors.gender}
												helperText={errors.gender?.message}>
												<MenuItem value='Male'>Male</MenuItem>
												<MenuItem value='Female'>Female</MenuItem>
											</TextField>
										</Grid>
									</Grid>
								</FormSection>
							)}

							{/* STEP 2: CONTACT */}
							{activeStep === 2 && (
								<FormSection title='Contact Details' icon={<ContactMailIcon />}>
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
												multiline
												rows={2}
												label='Residential Address'
												{...register('residence')}
												error={!!errors.residence}
												helperText={errors.residence?.message}
											/>
										</Grid>
									</Grid>
								</FormSection>
							)}

							{/* STEP 3: FAMILY */}
							{activeStep === 3 && (
								<FormSection
									title='Family & Dependants'
									icon={<FamilyRestroomIcon />}>
									{/* Spouse */}
									<Typography
										variant='subtitle2'
										sx={{
											color: 'text.secondary',
											mb: 2,
											mt: 1,
											textTransform: 'uppercase',
											letterSpacing: 1,
										}}>
										Spouse Details
									</Typography>
									<Grid container spacing={3} sx={{ mb: 4 }}>
										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												label='Spouse Full Name'
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

									<Divider sx={{ my: 3 }} />

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
											sx={{
												color: 'text.secondary',
												textTransform: 'uppercase',
												letterSpacing: 1,
											}}>
											Children ({childFields.length}/{MAX_DEPENDANTS})
										</Typography>
										<Button
											size='small'
											startIcon={<AddCircleOutlineIcon />}
											onClick={() =>
												appendChild({ fullName: '', birthday: '' })
											}
											disabled={childFields.length >= MAX_DEPENDANTS}>
											Add Child
										</Button>
									</Box>

									<Stack spacing={2} sx={{ mb: 4 }}>
										{childFields.map((field, index) => (
											<Paper
												key={field.id}
												variant='outlined'
												sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
												<Grid container spacing={2} alignItems='center'>
													<Grid item xs={12} sm={6}>
														<TextField
															size='small'
															fullWidth
															label='Child Full Name'
															{...register(`children.${index}.fullName`)}
															error={!!errors.children?.[index]?.fullName}
														/>
													</Grid>
													<Grid item xs={10} sm={5}>
														<TextField
															size='small'
															fullWidth
															type='date'
															label='Birthday'
															InputLabelProps={{ shrink: true }}
															{...register(`children.${index}.birthday`)}
															error={!!errors.children?.[index]?.birthday}
														/>
													</Grid>
													<Grid
														item
														xs={2}
														sm={1}
														sx={{
															display: 'flex',
															justifyContent: 'flex-end',
														}}>
														<IconButton
															size='small'
															color='error'
															onClick={() => removeChild(index)}>
															<DeleteIcon />
														</IconButton>
													</Grid>
												</Grid>
											</Paper>
										))}
										{childFields.length === 0 && (
											<Typography variant='caption' color='text.disabled'>
												No children added yet.
											</Typography>
										)}
									</Stack>

									<Divider sx={{ my: 3 }} />

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
											sx={{
												color: 'text.secondary',
												textTransform: 'uppercase',
												letterSpacing: 1,
											}}>
											Parents ({parentFields.length}/{MAX_PARENTS})
										</Typography>
										<Button
											size='small'
											color='secondary'
											startIcon={<AddCircleOutlineIcon />}
											onClick={() =>
												appendParent({
													fullName: '',
													birthday: '',
													relationship: '',
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
												sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
												<Grid container spacing={2} alignItems='center'>
													<Grid item xs={12} sm={5}>
														<TextField
															size='small'
															fullWidth
															label='Parent Name'
															{...register(`parents.${index}.fullName`)}
															error={!!errors.parents?.[index]?.fullName}
														/>
													</Grid>
													<Grid item xs={6} sm={3}>
														<TextField
															size='small'
															select
															fullWidth
															label='Relation'
															defaultValue='Father'
															{...register(`parents.${index}.relationship`)}
															error={!!errors.parents?.[index]?.relationship}>
															<MenuItem value='Father'>Father</MenuItem>
															<MenuItem value='Mother'>Mother</MenuItem>
															<MenuItem value='Inlaw'>In-law</MenuItem>
														</TextField>
													</Grid>
													<Grid item xs={6} sm={3}>
														<TextField
															size='small'
															fullWidth
															type='date'
															label='Birthday'
															InputLabelProps={{ shrink: true }}
															{...register(`parents.${index}.birthday`)}
															error={!!errors.parents?.[index]?.birthday}
														/>
													</Grid>
													<Grid
														item
														xs={12}
														sm={1}
														sx={{
															display: 'flex',
															justifyContent: 'flex-end',
														}}>
														<IconButton
															size='small'
															color='error'
															onClick={() => removeParent(index)}>
															<DeleteIcon />
														</IconButton>
													</Grid>
												</Grid>
											</Paper>
										))}
										{parentFields.length === 0 && (
											<Typography variant='caption' color='text.disabled'>
												No parents added yet.
											</Typography>
										)}
									</Stack>
								</FormSection>
							)}

							{/* STEP 4: REVIEW & SUBMIT */}
							{activeStep === 4 && (
								<FormSection title='Review & Declaration' icon={<SaveIcon />}>
									<Alert severity='info' sx={{ mb: 3 }}>
										Please review the information provided in previous steps
										before submitting.
									</Alert>

									<Box
										sx={{
											p: 3,
											bgcolor: 'warning.50',
											borderRadius: 2,
											border: '1px dashed',
											borderColor: 'warning.main',
										}}>
										<Typography variant='h6' gutterBottom color='warning.dark'>
											Medical Undertaking
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
															Do you or listed relatives have existing medical
															conditions?
														</Typography>
													}
												/>
											)}
										/>

										<TextField
											fullWidth
											multiline
											rows={3}
											label='Details of Health Conditions (Optional)'
											placeholder='If yes, please explain here...'
											sx={{ mt: 2, mb: 2, bgcolor: 'white' }}
											{...register('condition')}
											error={!!errors.condition}
											helperText={errors.condition?.message}
										/>

										<Divider sx={{ my: 2 }} />

										<Controller
											name='declaration'
											control={control}
											render={({ field }) => (
												<FormControlLabel
													control={
														<Checkbox {...field} checked={!!field.value} />
													}
													label={
														<Typography variant='body2' fontWeight='600'>
															I hereby declare that all information provided is
															true and accurate.
														</Typography>
													}
												/>
											)}
										/>
										{errors.declaration && (
											<FormHelperText error>
												You must accept the declaration to proceed.
											</FormHelperText>
										)}
									</Box>
								</FormSection>
							)}

							{/* NAVIGATION BUTTONS */}
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									mt: 6,
									pt: 2,
									borderTop: '1px solid',
									borderColor: 'divider',
								}}>
								<Button
									disabled={activeStep === 0}
									onClick={handleBack}
									startIcon={<ArrowBackIcon />}
									sx={{ mr: 1 }}>
									Back
								</Button>

								{activeStep === STEPS.length - 1 ? (
									<Button
										variant='contained'
										color='primary'
										size='large'
										type='submit'
										disabled={createMemberMutation.isLoading || isSubmitting}
										startIcon={
											createMemberMutation.isLoading ? (
												<CircularProgress size={20} color='inherit' />
											) : (
												<SaveIcon />
											)
										}>
										{createMemberMutation.isLoading
											? 'Submitting...'
											: 'Submit Policy'}
									</Button>
								) : (
									<Button
										variant='contained'
										onClick={handleNext}
										endIcon={<ArrowForwardIcon />}>
										Next Step
									</Button>
								)}
							</Box>
						</form>
					</CardContent>
				</Card>
			</Container>

			{/* SUCCESS SNACKBAR */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={2500}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<Alert
					onClose={handleCloseSnackbar}
					severity='success'
					variant='filled'
					sx={{ width: '100%' }}>
					Registration successful! Redirecting...
				</Alert>
			</Snackbar>
		</Box>
	);
}
