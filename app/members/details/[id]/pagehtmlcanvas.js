'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
	Typography,
	Grid,
	Box,
	Paper,
	Chip,
	Stack,
	IconButton,
	CircularProgress,
	Alert,
	Button,
} from '@mui/material';
import { useUserStore } from '@/app/store/userStore';
import jsPDF from 'jspdf';
//import html2canvas from 'html2canvas';
import html2canvas from 'html2canvas-pro';

// ---- Section Title ----
function SectionTitle({ children }) {
	return (
		<Typography
			variant='h6'
			sx={{
				color: '#00ACAC',
				fontWeight: 'bold',
				mt: 3,
				mb: 1,
				pb: 1,
				borderBottom: 1,
				borderColor: 'divider',
			}}>
			{children}
		</Typography>
	);
}

// ---- Field ----
function Field({ label, value }) {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Typography variant='subtitle2' color='text.secondary'>
				{label}
			</Typography>
			<Typography
				variant='body1'
				sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
				{value ?? <span>—</span>}
			</Typography>
		</Grid>
	);
}

// ---- Array Field ----
function ArrayField({ label, items, renderItem, emptyMsg }) {
	return items && items.length > 0 ? (
		<Stack spacing={2} sx={{ mb: 2 }}>
			{items.map((item, idx) => (
				<Paper key={idx} variant='outlined' sx={{ p: 2, bgcolor: '#fafbfc' }}>
					<Typography variant='subtitle2' sx={{ mb: 1 }}>
						{label} {items.length > 1 ? idx + 1 : ''}
					</Typography>
					{renderItem(item, idx)}
				</Paper>
			))}
		</Stack>
	) : (
		<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
			{emptyMsg || `No ${label?.toLowerCase()} available.`}
		</Typography>
	);
}

// ---- PDF-Printable Content ----
const PrintableContent = ({ record }) => (
	<Box
		sx={{
			p: 3,
			borderRadius: 2,
			maxWidth: 900,
			mx: 'auto',
		}}>
		<h1>Identification Details</h1>
		<Grid container spacing={2}>
			<Field label='National ID' value={record.nationalId} />
			<Field label='Type of ID' value={record.idType} />
		</Grid>
		<h1>Personal Details</h1>
		<Grid container spacing={2}>
			<Field label='First Name' value={record.firstName} />
			<Field label='Middle Name' value={record.middleName} />
			<Field label='Last Name' value={record.lastName} />
			<Field
				label='Birthday (yyyy-mm-dd)'
				value={record.birthday?.split('T')[0]}
			/>
			<Field label='Gender' value={record.gender} />
		</Grid>
		<h1>Contact Details</h1>
		<Grid container spacing={2}>
			<Field label='Email' value={record.email} />
			<Field label='Telephone' value={record.telephone} />
			<Field label='Address' value={record.residence} />
		</Grid>
		<h1>Spouse Details</h1>
		<Grid container spacing={2}>
			<Field label='Full Name' value={record.spouseFullname} />
			<Field
				label='Birthday (yyyy-mm-dd)'
				value={record.spousebirthday?.split('T')[0]}
			/>
		</Grid>
		<h1>Children Details</h1>
		<ArrayField
			label='Child'
			items={record.children}
			emptyMsg='No children listed.'
			renderItem={(child) => (
				<Grid container spacing={1}>
					<Field label='Full Name' value={child.fullName} />
					<Field
						label='Birthday (yyyy-mm-dd)'
						value={child.birthday?.split('T')[0]}
					/>
				</Grid>
			)}
		/>
		<h1>Parent Details</h1>
		<ArrayField
			label='Parent'
			items={record.parents}
			emptyMsg='No parents listed.'
			renderItem={(parent) => (
				<Grid container spacing={1}>
					<Field label='Full Name' value={parent.fullName} />
					<Field
						label='Birthday (yyyy-mm-dd)'
						value={parent.birthday?.split('T')[0]}
					/>
					<Field label='Relation' value={parent.relationship} />
				</Grid>
			)}
		/>
		<h1>Undertaking</h1>
		<Box sx={{ mb: 2 }}>
			<h2>
				Ongoing illness/condition:{' '}
				<Chip
					label={record.underlying ? 'Yes' : 'No'}
					size='small'
					sx={{ ml: 1 }}
				/>
			</h2>
			{record.underlying && (
				<h2 variant='body2' sx={{ mt: 1 }}>
					Known Health Conditions:{' '}
					{record.condition ?? <span>None specified</span>}
				</h2>
			)}
		</Box>
		<Box sx={{ mb: 2 }}>
			<h2 variant='subtitle2' sx={{ fontStyle: 'italic' }}>
				Declaration Accepted:{' '}
				<Chip
					label={record.declaration ? 'Yes' : 'No'}
					size='small'
					sx={{ ml: 1 }}
				/>
			</h2>
		</Box>
	</Box>
);

export default function MembersViewPage(PDF) {
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const params = useParams();
	const { id } = useUserStore((state) => state.user);
	const [record, setRecord] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const pdfRef = useRef();

	const handleEditClick = (recordId) => {
		setUser({ id: recordId });
		router.push('/members/edit/record');
	};

	const handleDownloadPDF = async (MemberLastName) => {
		const input = pdfRef.current;
		if (!input) return;
		const canvas = await html2canvas(input, { scale: 2, useCORS: true });
		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		// Fit image to pdf
		const imgProps = pdf.getImageProperties(imgData);
		const ratio = Math.min(
			pageWidth / imgProps.width,
			pageHeight / imgProps.height
		);
		const imgWidth = imgProps.width * ratio;
		const imgHeight = imgProps.height * ratio;
		pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
		pdf.save(`${MemberLastName}.pdf`);
	};

	const fetchUser = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`
			);
			if (!res.ok) {
				const err = await res.json();
				setError(err.error || 'Member not found');
				setRecord(null);
			} else {
				setRecord(await res.json());
			}
		} catch {
			setError('Failed to fetch member.');
			setRecord(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (id) fetchUser();
	}, [id]);

	if (loading) {
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
					{error}
				</Alert>
				<Button variant='contained' onClick={fetchUser}>
					Retry
				</Button>
			</Box>
		);
	}
	if (!record) {
		return (
			<Box mt={4} textAlign='center'>
				<Alert severity='info'>Record not Found.</Alert>
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
				maxWidth: 950,
				mx: 'auto',
			}}>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				mb={2}>
				<Typography variant='h5' sx={{ color: '#091b1b', fontWeight: 'bold' }}>
					REGISTRATION INFORMATION
				</Typography>
				<Box>
					<IconButton
						onClick={() => handleEditClick(id)}
						size='small'
						sx={{
							color: 'white',
							bgcolor: '#060270',
							mr: 1,
							'&:hover': { bgcolor: 'green' },
						}}
						aria-label='Edit'>
						<EditIcon />
					</IconButton>
					<IconButton
						onClick={() => handleDownloadPDF(record.lastName)}
						size='small'
						sx={{
							color: 'white',
							bgcolor: '#ff3300',
							'&:hover': { bgcolor: 'green' },
						}}
						aria-label='Print'>
						<PictureAsPdfIcon />
					</IconButton>
				</Box>
			</Box>
			{/* Printable content for PDF */}
			<div ref={pdfRef}>
				<PrintableContent record={record} />
			</div>
		</Box>
	);
}
