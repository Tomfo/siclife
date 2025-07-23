'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Link from 'next/link';
import { useUserStore } from '@/app/store/userStore';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import Image from 'next/image';
import {
	Typography,
	Grid,
	Box,
	Divider,
	Paper,
	Chip,
	Stack,
	IconButton,
	CircularProgress,
	Alert,
	Button,
	Tooltip,
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
export default function MemberViewPage() {
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const params = useParams();
	const { formType } = params;
	const { id } = useUserStore((state) => state.user);
	const [record, setRecord] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const componentRef = useRef();

	// Handle user Edit
	const handleEditClick = (recordId) => {
		const user = { id: recordId };
		setUser(user);
		router.push('/members/edit/record');
	};

	// Handle printing
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
		documentTitle: `Member_Registration_${record?.nationalId || ''}`,
	});

	// Handle PDF generation
	// const handleGeneratePdf = async () => {
	// 	if (!componentRef.current) return;

	// 	try {
	// 		const canvas = await html2canvas(componentRef.current, {
	// 			scale: 2,
	// 			useCORS: true,
	// 			allowTaint: true,
	// 			logging: true,
	// 		});

	// 		const imgData = canvas.toDataURL('image/png');
	// 		const pdf = new jsPDF('p', 'pt', 'a4');
	// 		const pageWidth = pdf.internal.pageSize.getWidth();
	// 		const pageHeight = pdf.internal.pageSize.getHeight();
	// 		//Fit image to pdf
	// 		const imgProps = pdf.getImageProperties(imgData);
	// 		const ratio = Math.min(
	// 			pageWidth / imgProps.width,
	// 			pageHeight / imgProps.height
	// 		);

	// 		const imgWidth = imgProps.width * ratio;
	// 		const imgHeight = imgProps.height * ratio;
	// 		pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

	// 		pdf.save(`Member_Registration_${record?.nationalId || 'record'}.pdf`);
	// 	} catch (error) {
	// 		console.error('Error generating PDF:', error);
	// 		setError('Failed to generate PDF');
	// 	}
	// };
	const handleGeneratePdf = async () => {
		const element = componentRef.current;

		if (!element) return;

		const canvas = await html2canvas(element, {
			scale: 2, // improve quality
			useCORS: true,
			backgroundColor: null, // transparent background
		});

		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);

		pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
		pdf.save(`Member_Registration_${record?.nationalId || 'record'}.pdf`);
	};

	async function fetchUser(params) {
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
				const data = await res.json();
				setRecord(data);
			}
		} catch (e) {
			setError('Failed to fetch member.');
			setRecord(null);
		} finally {
			setLoading(false);
		}
	}

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
		<>
			{/* Print and PDF buttons (will be hidden when printing) */}
			<Box
				className='no-print'
				sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
				<Tooltip title='Edit details'>
					<Button
						onClick={() => handleEditClick(id)}
						color='success'
						variant='contained'>
						<EditIcon />
						Edit Details
					</Button>
				</Tooltip>
				<Tooltip title='Download PDF'>
					<Button onClick={handleGeneratePdf} color='error' variant='contained'>
						<PictureAsPdfIcon />
						Download Details
					</Button>
				</Tooltip>
			</Box>

			<Box
				ref={componentRef}
				sx={{
					m: 2,
					p: { xs: 1, sm: 3 },
					bgcolor: 'background.paper',

					width: '800px',
					mx: 'auto',
				}}>
				{/* Title */}
				<div className='max-w-7xl mx-auto px-4 py-2 flex items-center justify-between'>
					<Image
						src='/moba.png'
						alt='Logo'
						width={36}
						height={36}
						className='rounded-full'
						style={{ width: 36, height: 36 }}
						unoptimized
					/>
					<h1 className=' text-[#091b1b] font-bold justify-center text-2xl'>
						MOBA 86 SIC LIFE POLICY REGISTRATION INFORMATION
					</h1>
				</div>

				{/* Identification Details */}
				<SectionTitle>Identification Details</SectionTitle>
				<table style={{ width: '100%', marginBottom: '16px' }}>
					<tbody>
						<tr>
							<td style={{ width: '50%', padding: '8px' }}>
								<FieldDisplay label='National ID' value={record.nationalId} />
							</td>
							<td style={{ width: '50%', padding: '8px' }}>
								<FieldDisplay label='Type of ID' value={record.idType} />
							</td>
						</tr>
					</tbody>
				</table>

				{/* Personal Details */}
				<SectionTitle>Personal Details</SectionTitle>
				<table style={{ width: '100%', marginBottom: '16px' }}>
					<tbody>
						<tr>
							<td style={{ width: '33%', padding: '8px' }}>
								<FieldDisplay label='First Name' value={record.firstName} />
							</td>
							<td style={{ width: '33%', padding: '8px' }}>
								<FieldDisplay label='Middle Name' value={record.middleName} />
							</td>
							<td style={{ width: '33%', padding: '8px' }}>
								<FieldDisplay label='Last Name' value={record.lastName} />
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>
								<FieldDisplay
									label='Birthday (yyyy-mm-dd)'
									value={record.birthday.split('T')[0]}
								/>
							</td>
							<td style={{ padding: '8px' }}>
								<FieldDisplay label='Gender' value={record.gender} />
							</td>
							<td style={{ padding: '8px' }}></td>
						</tr>
					</tbody>
				</table>

				{/* Contact Details */}
				<SectionTitle>Contact Details</SectionTitle>
				<table style={{ width: '100%', marginBottom: '16px' }}>
					<tbody>
						<tr>
							<td style={{ width: '33%', padding: '8px' }}>
								<FieldDisplay label='Email' value={record.email} />
							</td>
							<td style={{ width: '33%', padding: '8px' }}>
								<FieldDisplay label='Telephone' value={record.telephone} />
							</td>
							<td style={{ width: '33%', padding: '8px' }}>
								<FieldDisplay label='Address' value={record.residence} />
							</td>
						</tr>
					</tbody>
				</table>

				{/* Spouse Details */}
				<SectionTitle>Spouse Details</SectionTitle>
				<table style={{ width: '100%', marginBottom: '16px' }}>
					<tbody>
						<tr>
							<td style={{ width: '50%', padding: '8px' }}>
								<FieldDisplay label='Full Name' value={record.spouseFullname} />
							</td>
							<td style={{ width: '50%', padding: '8px' }}>
								<FieldDisplay
									label='Birthday (yyyy-mm-dd)'
									value={record.spousebirthday.split('T')[0]}
								/>
							</td>
						</tr>
					</tbody>
				</table>

				{/* Children Details */}
				<SectionTitle>Children Details</SectionTitle>
				<ArrayFieldDisplay
					items={record.children}
					renderItem={(child, idx) => (
						<table style={{ width: '100%', marginBottom: '8px' }}>
							<tbody>
								<tr>
									<td style={{ width: '50%', padding: '8px' }}>
										<FieldDisplay label='Full Name' value={child.fullName} />
									</td>
									<td style={{ width: '50%', padding: '8px' }}>
										<FieldDisplay
											label='Birthday (yyyy-mm-dd)'
											value={child.birthday.split('T')[0]}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					)}
				/>

				{/* Parent Details */}
				<SectionTitle>Parent Details</SectionTitle>
				<ArrayFieldDisplay
					items={record.parents}
					renderItem={(parent, idx) => (
						<table style={{ width: '100%', marginBottom: '8px' }}>
							<tbody>
								<tr>
									<td style={{ width: '40%', padding: '8px' }}>
										<FieldDisplay label='Full Name' value={parent.fullName} />
									</td>
									<td style={{ width: '30%', padding: '8px' }}>
										<FieldDisplay
											label='Birthday (yyyy-mm-dd)'
											value={parent.birthday.split('T')[0]}
										/>
									</td>
									<td style={{ width: '30%', padding: '8px' }}>
										<FieldDisplay
											label='Relation'
											value={parent.relationship}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					)}
				/>

				{/* Undertaking */}
				<SectionTitle>Undertaking</SectionTitle>
				<Box sx={{ mb: 2 }}>
					<Typography variant='subtitle2' sx={{ fontStyle: 'italic' }}>
						Ongoing illness/condition:{' '}
						<Chip
							label={record.underlying ? 'Yes' : 'No'}
							color={record.underlying ? 'warning' : 'default'}
							size='small'
							sx={{ ml: 1 }}
						/>
					</Typography>
					{record.underlying && (
						<Typography variant='body2' sx={{ mt: 1 }}>
							Known Health Conditions:{' '}
							{record.condition || (
								<span style={{ color: '#aaa' }}>None specified</span>
							)}
						</Typography>
					)}
				</Box>
				<Box sx={{ mb: 2 }}>
					<Typography variant='subtitle2' sx={{ fontStyle: 'italic' }}>
						Declaration Accepted:{' '}
						<Chip
							label={record.declaration ? 'Yes' : 'No'}
							color={record.declaration ? 'success' : 'default'}
							size='small'
							sx={{ ml: 1 }}
						/>
					</Typography>
				</Box>
			</Box>
		</>
	);
}
