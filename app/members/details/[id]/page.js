'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import {
	Typography,
	Grid,
	Box,
	Divider,
	Paper,
	Chip,
	Stack,
	IconButton,CircularProgress,Alert,Button,
} from '@mui/material';

// --- Section Title Component ---
function SectionTitle({ children }) {
	return (
		<Typography
			variant='h6'
			sx={{
				color: '#00ACAC',
				fontWeight: 'bold',
				mt: 3,
				mb: 1,
				borderBottom: '1px solid #e0e0e0',
				pb: 1,
			}}>
			{children}
		</Typography>
	);
}

// --- Field Display Component ---
function FieldDisplay({ label, value }) {
	return (
		<Grid size={{ xs: 12, sm: 6, md: 4 }}>
			<Typography variant='subtitle2' color='text.secondary'>
				{label}
			</Typography>
			<Typography
				variant='body1'
				sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
				{value || <span style={{ color: '#aaa' }}>—</span>}
			</Typography>
		</Grid>
	);
}

// --- Array Field Display ---
function ArrayFieldDisplay({ label, items, renderItem }) {
	return (
		<>
			{items && items.length > 0 ? (
				<Stack spacing={1} sx={{ mb: 2 }}>
					{items.map((item, idx) => (
						<Paper
							variant='outlined'
							key={idx}
							sx={{ p: 2, bgcolor: '#fafbfc' }}>
							<Typography
								variant='subtitle2'
								color='text.secondary'
								sx={{ mb: 1 }}>
								{label} {items.length > 1 ? idx + 1 : ''}
							</Typography>
							{renderItem(item, idx)}
						</Paper>
					))}
				</Stack>
			) : (
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					No {label?.toLowerCase()} dependants.
				</Typography>
			)}
		</>
	);
}

// --- Main View Component ---
/**
 * @param {object} props
 * @param {object} props.data - Member data to display (should match the member form fields)
 */


export default function MemberViewPage() {
	const params = useParams();
	const { id, formType } = params;
	const [user, setUser] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
async function fetchUser(params) {
	

			setLoading(true)
			setError('');
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`
				);
				if (!res.ok) {
					const err = await res.json();
					setError(err.error || 'Member not found');
					setUser(null);
				} else {
					const data = await res.json();
					setUser(data);
				}
			} catch (e) {
				setError('Failed to fetch member.');
				setUser(null);
			}finally{
				setLoading(false)
			}
		}
	useEffect(() => {
		
		if (id) fetchUser();
	}, [id]);

		if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={fetchUser}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box mt={4} textAlign="center">
        <Alert severity="info">Record not Found.</Alert>
      </Box>
    );
  }


	return (
		<Box
			sx={{
				m: 2,
				p: { xs: 1, sm: 3 },
				bgcolor: 'background.paper',
				borderRadius: 2,
				boxShadow: 1,
				width: '100%',
				maxWidth: 900,
				mx: 'auto',
			}}>
			{/* Identification Details */}
			<div className='max-w-7xl mx-auto px-4 py-2 flex items-center justify-between'>
				<h1 className=' text-[#091b1b] font-bold justify-center text-2xl'>
					REGISTRATION INFORMATION
				</h1>
				<Link href={`/members/${id}/edit`} passHref>
					<IconButton
						size='small'
						sx={{
							color: 'white',
							bgcolor: '#060270', // Light gray from theme
							'&:hover': {
								bgcolor: 'green', // Light red from theme (if using custom palette)
							},
						}}
						aria-label='Edit'>
						<EditIcon />
					</IconButton>
				</Link>
			</div>
			<SectionTitle>Identification Details</SectionTitle>
			<Grid container spacing={2}>
				<FieldDisplay label='National ID' value={user.nationalId} />
				<FieldDisplay label='Type of ID' value={user.idType} />
			</Grid>

			{/* Personal Details */}
			<SectionTitle>Personal Details</SectionTitle>
			<Grid container spacing={2}>
				<FieldDisplay label='First Name' value={user.firstName} />
				<FieldDisplay label='Middle Name' value={user.middleName} />
				<FieldDisplay label='Last Name' value={user.lastName} />
				<FieldDisplay label='Birthday (yyyy-mm-dd)' value={user.birthday.split('T')[0]} />
				<FieldDisplay label='Gender' value={user.gender} />
			</Grid>
			{/* Contact Details */}
			<SectionTitle>Contact Details</SectionTitle>
			<Grid container spacing={2}>
				<FieldDisplay label='Email' value={user.email} />
				<FieldDisplay label='Telephone' value={user.telephone} />
				<FieldDisplay label='Address' value={user.residence} />
			</Grid>

			{/* Spouse Details */}
			<SectionTitle>Spouse Details</SectionTitle>
			<Grid container spacing={2}>
				<FieldDisplay label='Full Name' value={user.spouseFullname} />
				<FieldDisplay
					label='Birthday (yyyy-mm-dd)'
					value={user.spousebirthday.split('T')[0]}
				/>
			</Grid>
			{/* Children Details */}
			<SectionTitle>Children Details</SectionTitle>
			<ArrayFieldDisplay
				items={user.children}
				renderItem={(child, idx) => (
					<Grid container spacing={1}>
						<FieldDisplay label='Full Name' value={child.fullName} />
						<FieldDisplay
							label='Birthday (yyyy-mm-dd)'
							value={child.birthday.split('T')[0]}
						/>
					</Grid>
				)}
			/>

			{/* Parent Details */}
			<SectionTitle>Parent Details</SectionTitle>
			<ArrayFieldDisplay
				items={user.parents}
				renderItem={(parent, idx) => (
					<Grid container spacing={1}>
						<FieldDisplay label='Full Name' value={parent.fullName} />
						<FieldDisplay
							label='Birthday (yyyy-mm-dd)'
							value={parent.birthday.split('T')[0]}
						/>
						<FieldDisplay label='Relation' value={parent.relationship} />
					</Grid>
				)}
			/>

			{/* Undertaking */}
			<SectionTitle>Undertaking</SectionTitle>
			<Box sx={{ mb: 2 }}>
				<Typography variant='subtitle2' sx={{ fontStyle: 'italic' }}>
					Ongoing illness/condition:{' '}
					<Chip
						label={user.underlying ? 'Yes' : 'No'}
						color={user.underlying ? 'warning' : 'default'}
						size='small'
						sx={{ ml: 1 }}
					/>
				</Typography>
				{user.underlying && (
					<Typography variant='body2' sx={{ mt: 1 }}>
						Known Health Conditions:{' '}
						{user.condition || (
							<span style={{ color: '#aaa' }}>None specified</span>
						)}
					</Typography>
				)}
			</Box>
			<Box sx={{ mb: 2 }}>
				<Typography variant='subtitle2' sx={{ fontStyle: 'italic' }}>
					Declaration Accepted:{' '}
					<Chip
						label={user.declaration ? 'Yes' : 'No'}
						color={user.declaration ? 'success' : 'default'}
						size='small'
						sx={{ ml: 1 }}
					/>
				</Typography>
			</Box>
		</Box>
	);
}
