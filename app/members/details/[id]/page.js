'use client';

import { getMemberbyId } from '@/helpers/api-request';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/app/store/userStore';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import Image from 'next/image';

// MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

// MUI Components
import {
	Typography,
	Grid,
	Box,
	Divider,
	Paper,
	Chip,
	Stack,
	CircularProgress,
	Alert,
	Button,
	Tooltip,
	Container,
	Avatar,
	Card,
	CardContent,
} from '@mui/material';

// --- Custom Components ---

function SectionTitle({ icon, children }) {
	return (
		<Box sx={{ mt: 4, mb: 2 }}>
			<Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
				{icon && <Box sx={{ color: '#00ACAC' }}>{icon}</Box>}
				<Typography
					variant='h6'
					sx={{
						color: '#00ACAC',
						fontWeight: 'bold',
						textTransform: 'uppercase',
						fontSize: '1rem',
						letterSpacing: '0.5px',
					}}>
					{children}
				</Typography>
			</Stack>
			<Divider sx={{ borderColor: 'rgba(0, 172, 172, 0.3)' }} />
		</Box>
	);
}

function FieldDisplay({ label, value, fullWidth = false }) {
	return (
		<Box sx={{ mb: 2 }}>
			<Typography
				variant='caption'
				display='block'
				sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>
				{label}
			</Typography>
			<Typography
				variant='body1'
				sx={{
					fontWeight: 600,
					color: 'text.primary',
					wordBreak: 'break-word',
					minHeight: '24px',
				}}>
				{value || (
					<span style={{ color: '#bdbdbd', fontStyle: 'italic' }}>
						Not Provided
					</span>
				)}
			</Typography>
		</Box>
	);
}

// --- Main View Component ---
export default function MemberViewPage() {
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	// const params = useParams(); // Unused in original logic, but kept if needed
	const { id } = useUserStore((state) => state.user);
	const componentRef = useRef();

	const { data, isLoading, error } = useQuery({
		queryKey: ['getmembersbyId', id],
		queryFn: () => getMemberbyId(id),
		enabled: !!id,
	});

	// Handle user Edit
	const handleEditClick = (recordId) => {
		const user = { id: recordId };
		setUser(user);
		router.push('/members/edit/record');
	};

	const handleGeneratePdf = async () => {
		const element = componentRef.current;
		if (!element) return;

		// Optional: Add a loading state here if generation takes time
		try {
			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: true,
				backgroundColor: '#ffffff', // Ensure white background for PDF
			});

			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);

			pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
			pdf.save(`Member_Registration_${data?.nationalId || 'record'}.pdf`);
		} catch (err) {
			console.error('PDF Generation failed', err);
			alert('Failed to generate PDF');
		}
	};

	if (isLoading) {
		return (
			<Box
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
				minHeight='50vh'>
				<CircularProgress sx={{ color: '#00ACAC' }} />
				<Typography sx={{ mt: 2, color: 'text.secondary' }}>
					Loading Record...
				</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Container maxWidth='sm' sx={{ mt: 8 }}>
				<Alert severity='error' variant='filled'>
					{error.message || 'An error occurred while fetching the record.'}
				</Alert>
			</Container>
		);
	}

	if (!data) {
		return (
			<Container maxWidth='sm' sx={{ mt: 8 }}>
				<Alert severity='info' variant='outlined'>
					Record not Found.
				</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			{/* Action Buttons */}
			<Stack
				direction='row'
				justifyContent='flex-end'
				spacing={2}
				sx={{ mb: 3 }}
				className='no-print'>
				<Tooltip title='Modify member details'>
					<Button
						onClick={() => handleEditClick(id)}
						variant='outlined'
						color='success'
						startIcon={<EditIcon />}
						sx={{ borderRadius: 2 }}>
						Edit
					</Button>
				</Tooltip>
				<Tooltip title='Download as PDF'>
					<Button
						onClick={handleGeneratePdf}
						variant='contained'
						color='error'
						startIcon={<PictureAsPdfIcon />}
						sx={{ borderRadius: 2, boxShadow: 2 }}>
						Download PDF
					</Button>
				</Tooltip>
			</Stack>

			{/* Printable Document Area */}
			<Paper
				ref={componentRef}
				elevation={3}
				sx={{
					p: { xs: 3, sm: 5 },
					bgcolor: 'background.paper',
					borderRadius: 1,
					borderTop: '6px solid #00ACAC', // Brand color accent
				}}>
				{/* Header Section */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,
						mb: 4,
						borderBottom: '2px solid #f0f0f0',
						pb: 3,
					}}>
					<Avatar
						src='/moba.png'
						alt='Logo'
						sx={{ width: 80, height: 80, boxShadow: 1 }}
					/>
					<Typography
						variant='h4'
						align='center'
						sx={{
							fontWeight: 800,
							fontSize: { xs: '1.2rem', sm: '1.5rem' },
							color: '#091b1b',
							textTransform: 'uppercase',
							maxWidth: '600px',
						}}>
						MOBA 86 SIC Life Policy Registration Information
					</Typography>
				</Box>

				{/* 1. Identification Details */}
				<SectionTitle icon={<PersonIcon />}>
					Identification Details
				</SectionTitle>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<FieldDisplay label='National ID Number' value={data.nationalId} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<FieldDisplay label='Type of ID' value={data.idType} />
					</Grid>
				</Grid>

				{/* 2. Personal Details */}
				<SectionTitle icon={<PersonIcon />}>Personal Details</SectionTitle>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={4}>
						<FieldDisplay label='First Name' value={data.firstName} />
					</Grid>
					<Grid item xs={12} sm={4}>
						<FieldDisplay label='Middle Name' value={data.middleName} />
					</Grid>
					<Grid item xs={12} sm={4}>
						<FieldDisplay label='Last Name' value={data.lastName} />
					</Grid>
					<Grid item xs={12} sm={4}>
						<FieldDisplay
							label='Date of Birth'
							value={data.birthday?.split('T')[0]}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<FieldDisplay label='Gender' value={data.gender} />
					</Grid>
				</Grid>

				{/* 3. Contact Details */}
				<SectionTitle icon={<ContactPhoneIcon />}>Contact Details</SectionTitle>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6} md={4}>
						<FieldDisplay label='Email Address' value={data.email} />
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<FieldDisplay label='Telephone' value={data.telephone} />
					</Grid>
					<Grid item xs={12} sm={12} md={4}>
						<FieldDisplay label='Residential Address' value={data.residence} />
					</Grid>
				</Grid>

				{/* 4. Spouse Details */}
				<SectionTitle icon={<FamilyRestroomIcon />}>
					Spouse Details
				</SectionTitle>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={8}>
						<FieldDisplay
							label='Spouse Full Name'
							value={data.spouseFullname}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<FieldDisplay
							label='Spouse Date of Birth'
							value={data.spousebirthday?.split('T')[0]}
						/>
					</Grid>
				</Grid>

				{/* 5. Children Details */}
				<SectionTitle icon={<FamilyRestroomIcon />}>
					Children Details
				</SectionTitle>
				{data.children && data.children.length > 0 ? (
					<Stack spacing={2}>
						{data.children.map((child, idx) => (
							<Card key={idx} variant='outlined' sx={{ bgcolor: '#fafbfc' }}>
								<CardContent sx={{ py: 2, pb: '16px !important' }}>
									<Grid container spacing={2} alignItems='center'>
										<Grid item xs={1}>
											<Typography variant='subtitle2' color='primary'>
												#{idx + 1}
											</Typography>
										</Grid>
										<Grid item xs={12} sm={7}>
											<FieldDisplay
												label='Child Full Name'
												value={child.fullName}
											/>
										</Grid>
										<Grid item xs={12} sm={4}>
											<FieldDisplay
												label='Date of Birth'
												value={child.birthday?.split('T')[0]}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}
					</Stack>
				) : (
					<Typography variant='body2' color='text.secondary' fontStyle='italic'>
						No children listed.
					</Typography>
				)}

				{/* 6. Parent Details */}
				<SectionTitle icon={<FamilyRestroomIcon />}>
					Parent Details
				</SectionTitle>
				{data.parents && data.parents.length > 0 ? (
					<Stack spacing={2}>
						{data.parents.map((parent, idx) => (
							<Card key={idx} variant='outlined' sx={{ bgcolor: '#fafbfc' }}>
								<CardContent sx={{ py: 2, pb: '16px !important' }}>
									<Grid container spacing={2} alignItems='center'>
										<Grid item xs={1}>
											<Typography variant='subtitle2' color='primary'>
												#{idx + 1}
											</Typography>
										</Grid>
										<Grid item xs={12} sm={5}>
											<FieldDisplay
												label='Parent Full Name'
												value={parent.fullName}
											/>
										</Grid>
										<Grid item xs={12} sm={3}>
											<FieldDisplay
												label='Date of Birth'
												value={parent.birthday?.split('T')[0]}
											/>
										</Grid>
										<Grid item xs={12} sm={3}>
											<FieldDisplay
												label='Relationship'
												value={parent.relationship}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}
					</Stack>
				) : (
					<Typography variant='body2' color='text.secondary' fontStyle='italic'>
						No parents listed.
					</Typography>
				)}

				{/* 7. Undertaking / Health */}
				<SectionTitle icon={<HealthAndSafetyIcon />}>
					Undertaking & Health
				</SectionTitle>
				<Box sx={{ bgcolor: '#f5fbfb', p: 3, borderRadius: 2 }}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<Box>
								<Typography variant='subtitle2' color='text.secondary'>
									Declaration Accepted
								</Typography>
								<Chip
									label={data.declaration ? 'Accepted' : 'Not Accepted'}
									color={data.declaration ? 'success' : 'default'}
									sx={{ mt: 1, fontWeight: 'bold' }}
								/>
							</Box>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Box>
								<Typography variant='subtitle2' color='text.secondary'>
									Underlying Condition
								</Typography>
								<Chip
									label={data.underlying ? 'Yes' : 'No'}
									color={data.underlying ? 'warning' : 'success'}
									sx={{ mt: 1, fontWeight: 'bold' }}
								/>
							</Box>
						</Grid>
						{data.underlying && (
							<Grid item xs={12}>
								<Divider sx={{ my: 1 }} />
								<Typography variant='subtitle2' color='error' sx={{ mb: 1 }}>
									Specific Medical Condition:
								</Typography>
								<Typography variant='body1'>{data.condition}</Typography>
							</Grid>
						)}
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
}
