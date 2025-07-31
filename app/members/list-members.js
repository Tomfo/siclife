'use client';
import { fetchMembers, deleteMember } from '@/helpers/api-request';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/userStore';
import {
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper,
	IconButton,
	Chip,
	Tooltip,
	Avatar,
	TablePagination,
	Box,
	Typography,
	Alert,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

// Constants
const TABLE_HEADERS = [
	{ id: 'info', label: 'Info', mobile: false },
	{ id: 'gender', label: 'Gender', mobile: true },
	{ id: 'email', label: 'Email', mobile: true },
	{ id: 'telephone', label: 'Telephone', mobile: true },
	{ id: 'status', label: 'Status', mobile: true },
	{ id: 'actions', label: 'Actions', mobile: false },
];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${TableCell.head}`]: {
		backgroundColor: '#00ACAC',
		color: theme.palette.common.white,
		fontSize: 15,
		letterSpacing: 0.5,
	},
	[`&.${TableCell.body}`]: {
		fontSize: 14,
		wordBreak: 'break-word',
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

// MemberInfoCell component
function MemberInfoCell({ member }) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Avatar src='/defaultPhoto.png' sx={{ width: 32, height: 32, mr: 1 }} />
			<Box
				sx={{
					display: 'flex flex-col',
					gap: 1,
					flexDirection: 'row',
					ml: { md: 1 },
				}}>
				<Typography variant='body1' sx={{ fontWeight: 'bold' }}>
					{member.lastName}
				</Typography>
				<span className='text-md text-gray-500 mr-1.5'>{member.firstName}</span>
				<span className='text-md text-gray-500 ml-2'>{member.middleName}</span>
			</Box>
		</Box>
	);
}

// StatusChip component
function StatusChip({ declaration }) {
	return (
		<Chip
			size='small'
			icon={declaration ? <CheckCircleIcon /> : <CancelIcon />}
			label={declaration ? 'Complete' : 'Pending'}
			color={declaration ? 'success' : 'error'}
			variant='outlined'
		/>
	);
}

// ActionButton component
function ActionButton({
	href,
	onClick,
	icon: Icon,
	color,

	label,
	as,
}) {
	const buttonProps = href ? { component: Link, href } : { onClick };

	return (
		<IconButton
			size='small'
			sx={{
				color: 'white',
				bgcolor: color,
				'&:hover': { bgcolor: 'green' },
			}}
			aria-label={label}
			{...buttonProps}>
			<Icon fontSize='small' />
		</IconButton>
	);
}

export default function ListMembers() {
	const queryClient = useQueryClient();
	const [filter, setFilter] = useState('');
	//for deletion
	const [selectedUser, setSelectedUser] = useState(null);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	//for paging
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	//from clerk
	const { user } = useUser();
	const role = user?.publicMetadata?.role;
	const uniqueId = user?.publicMetadata?.uniqueId;
	const isMobile = useMediaQuery('(max-width:640px)');
	//const primaryEmail = user?.primaryEmailAddress?.emailAddress;
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);

	const { data, isLoading, error } = useQuery({
		queryKey: ['getmembers'],
		queryFn: () => fetchMembers(),
	});

	//filtered data
	const filteredList = useMemo(() => {
		if (!data) return [];

		const lower = filter.toLowerCase();
		return data.filter((record) =>
			[
				record.firstName.trim(),
				record.lastName.trim(),
				record.email.trim(),
				record.middleName.trim(),
			].some((field) => field?.toLowerCase().includes(lower))
		);
	}, [data, filter]);

	// Pagination handlers

	const paginatedUsers = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredList.slice(start, start + rowsPerPage);
	}, [filteredList, page, rowsPerPage]);

	const handleChangePage = (_, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Handle user deletion
	const handleDeleteClick = (user) => {
		setSelectedUser({
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
		});
		setConfirmDialogOpen(true);
	};

	const handleCancelDelete = () => {
		setConfirmDialogOpen(false);
		setSelectedUser(null);
	};

	const deleteUser = useMutation({
		mutationFn: (id) => deleteMember(id),
		onSuccess: (_, id) => {
			queryClient.setQueryData(['getmembers'], (old) =>
				old.filter((deleted) => deleted.id !== id)
			);
			setConfirmDialogOpen(false);
			setSelectedUser(null);
		},
	});

	const handleConfirmDelete = () => {
		if (selectedUser) deleteUser.mutate(selectedUser.id);
	};

	// Hanlde user Edit
	const handleEditClick = (recordId) => {
		//	router.push(`/members/${userId}/edit`);
		const user = { id: recordId };
		setUser(user); // Save user in Zustand
		router.push('/members/edit/record'); // Navigate without query string
	};

	// Hanlde user Edit
	const handleViewClick = (recordId) => {
		//	router.push(`/members/${userId}/edit`);
		const user = { id: recordId };
		setUser(user); // Save user in Zustand
		router.push('/members/details/view'); // Navigate without query string
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
					{error}
				</Alert>
				<Button variant='contained' onClick={() => router.push('/members/')}>
					Retry
				</Button>
			</Box>
		);
	}

	return (
		<div className='m-5 bg-white p-2'>
			{/* Search and Title Section */}
			<div className='flex items-center justify-between'>
				<div className='flex-1 flex justify-items-start'>
					<div className='flex items-center gap-2 bg-gray-50 rounded-md ring-1 ring-gray-300 px-3 py-1 w-[260px] mb-2'>
						<Image src='/search.png' alt='Search' width={16} height={16} />
						<input
							type='text'
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							placeholder='Search…'
							className='w-full bg-transparent outline-none text-sm px-2 py-1'
						/>
					</div>
				</div>
				<div className='hidden md:flex'>
					<h1 className='text-[#0a0b0b] font-bold text-md'>
						REGISTERED MEMBERS- {uniqueId}
					</h1>
				</div>
			</div>

			{/* Members Table */}
			<TableContainer
				component={Paper}
				sx={{ width: '100%', overflowX: 'auto' }}>
				<Table aria-label='members table' sx={{ minWidth: 640 }}>
					<TableHead sx={{ background: '#c4c7d4', color: 'white' }}>
						<TableRow>
							{TABLE_HEADERS.map(
								(header) =>
									(!isMobile || !header.mobile) && (
										<StyledTableCell key={header.id}>
											{header.label}
										</StyledTableCell>
									)
							)}
						</TableRow>
					</TableHead>

					<TableBody>
						{paginatedUsers.map((user) => (
							<StyledTableRow key={user.id}>
								{/* Member Info */}
								<StyledTableCell>
									<MemberInfoCell
										member={{
											id: user.id,
											middleName: user.middleName,
											firstName: user.firstName,
											lastName: user.lastName,
											declaration: user.declaration,
											email: user.email,
										}}
									/>
									{isMobile &&
										(role === 'admin' || uniqueId === user.nationalId) && (
											<Box
												sx={{
													display: 'flex',
													gap: 0.5,
												}}>
												<IconButton
													aria-label='view'
													color='secondary'
													size='sm'
													onClick={() => handleViewClick(user.id)}>
													<PreviewRoundedIcon />
												</IconButton>

												<IconButton
													aria-label='edit'
													color='primary'
													size='sm'
													onClick={() => handleEditClick(user.id)}>
													<EditIcon />
												</IconButton>

												<IconButton
													aria-label='delete'
													color='error'
													size='sm'
													onClick={() => handleDeleteClick(user.id)}>
													<DeleteIcon />
												</IconButton>
											</Box>
										)}
								</StyledTableCell>

								{/* Additional Columns (hidden on mobile) */}
								{!isMobile && (
									<>
										<StyledTableCell>{user.gender}</StyledTableCell>
										<StyledTableCell sx={{ wordBreak: 'break-all' }}>
											{user.email}
										</StyledTableCell>
										<StyledTableCell sx={{ wordBreak: 'break-all' }}>
											{user.telephone}
										</StyledTableCell>
										<StyledTableCell>
											<StatusChip declaration={user.declaration} />
										</StyledTableCell>
									</>
								)}

								{/* Actions */}
								<StyledTableCell>
									{(role === 'admin' || uniqueId === user.nationalId) && (
										<Box
											sx={{
												display: 'flex',
												gap: 1,
											}}>
											<Tooltip title='view'>
												<ActionButton
													onClick={() => handleViewClick(user.id)}
													icon={PreviewRoundedIcon}
													color='#CC6CE7'
													label='View'
												/>
											</Tooltip>
											<Tooltip title='edit'>
												<ActionButton
													onClick={() => handleEditClick(user.id)}
													icon={EditIcon}
													color='#060270'
													label='Edit'
												/>
											</Tooltip>
											<Tooltip title='delete'>
												<ActionButton
													onClick={() => handleDeleteClick(user)}
													icon={DeleteIcon}
													color='#D20103'
													label='Delete'
												/>
											</Tooltip>
										</Box>
									)}
								</StyledTableCell>
							</StyledTableRow>
						))}
						{paginatedUsers.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} align='center'>
									{' '}
									<Alert severity='info'>No Registered Members Found.</Alert>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<TablePagination
					component='div'
					count={filteredList.length}
					page={page}
					onPageChange={handleChangePage}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
				/>
			</TableContainer>

			{/* Confirm Delete Dialog */}
			<Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete{' '}
						<strong>{selectedUser?.name} </strong>? This action cannot be
						undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete}>Cancel</Button>
					<Button color='error' onClick={handleConfirmDelete}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
