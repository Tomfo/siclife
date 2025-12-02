'use client';

import { fetchMembers, deleteMember } from '@/helpers/api-request';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/userStore';
import Link from 'next/link';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

// MUI Components
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
	Container,
	TextField,
	InputAdornment,
	Stack,
	Card,
	CardContent,
	Divider,
	Grid,
} from '@mui/material';

// --- Styled Components ---
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${TableCell.head}`]: {
		backgroundColor: '#00ACAC', // Brand Color
		color: theme.palette.common.white,
		fontWeight: 600,
	},
	[`&.${TableCell.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	'&:hover': {
		backgroundColor: 'rgba(0, 172, 172, 0.08)', // Subtle hover effect
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

// --- Helper Sub-Components ---

// 1. Mobile Card View (shown only on small screens)
function MobileMemberCard({ member, canEdit, onView, onEdit, onDelete }) {
	return (
		<Card variant='outlined' sx={{ mb: 2, borderRadius: 2 }}>
			<CardContent>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='flex-start'
					mb={2}>
					<Box display='flex' gap={2}>
						<Avatar
							src='/defaultPhoto.png'
							sx={{ width: 48, height: 48, bgcolor: '#00ACAC' }}>
							<PersonIcon />
						</Avatar>
						<Box>
							<Typography variant='subtitle1' fontWeight='bold'>
								{member.lastName} {member.firstName}
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								{member.middleName || ''}
							</Typography>
						</Box>
					</Box>
					<StatusChip declaration={member.declaration} size='small' />
				</Box>

				<Stack spacing={1} sx={{ mb: 2 }}>
					<Box display='flex' justifyContent='space-between'>
						<Typography variant='body2' color='text.secondary'>
							Email:
						</Typography>
						<Typography variant='body2' fontWeight={500}>
							{member.email}
						</Typography>
					</Box>
					<Box display='flex' justifyContent='space-between'>
						<Typography variant='body2' color='text.secondary'>
							Phone:
						</Typography>
						<Typography variant='body2' fontWeight={500}>
							{member.telephone}
						</Typography>
					</Box>
					<Box display='flex' justifyContent='space-between'>
						<Typography variant='body2' color='text.secondary'>
							Gender:
						</Typography>
						<Typography variant='body2' fontWeight={500}>
							{member.gender}
						</Typography>
					</Box>
				</Stack>

				{canEdit && (
					<>
						<Divider sx={{ my: 1 }} />
						<Box display='flex' justifyContent='flex-end' gap={1}>
							<Button
								size='small'
								startIcon={<PreviewRoundedIcon />}
								onClick={() => onView(member.id)}>
								View
							</Button>
							<Button
								size='small'
								color='primary'
								startIcon={<EditIcon />}
								onClick={() => onEdit(member.id)}>
								Edit
							</Button>
							<Button
								size='small'
								color='error'
								startIcon={<DeleteIcon />}
								onClick={() => onDelete(member)}>
								Delete
							</Button>
						</Box>
					</>
				)}
			</CardContent>
		</Card>
	);
}

// 2. Status Chip
function StatusChip({ declaration, size = 'medium' }) {
	return (
		<Chip
			size={size}
			icon={declaration ? <CheckCircleIcon /> : <CancelIcon />}
			label={declaration ? 'Complete' : 'Pending'}
			color={declaration ? 'success' : 'warning'}
			variant={declaration ? 'filled' : 'outlined'}
		/>
	);
}

// 3. Action Buttons Group
function ActionGroup({
	memberId,
	canEdit,
	onView,
	onEdit,
	onDelete,
	memberData,
}) {
	if (!canEdit)
		return (
			<Typography variant='caption' color='text.secondary'>
				View Only
			</Typography>
		);

	return (
		<Stack direction='row' spacing={1}>
			<Tooltip title='View Details'>
				<IconButton
					size='small'
					onClick={() => onView(memberId)}
					sx={{ color: '#CC6CE7', bgcolor: '#f3e5f5' }}>
					<PreviewRoundedIcon fontSize='small' />
				</IconButton>
			</Tooltip>
			<Tooltip title='Edit Record'>
				<IconButton
					size='small'
					onClick={() => onEdit(memberId)}
					sx={{ color: '#060270', bgcolor: '#e3f2fd' }}>
					<EditIcon fontSize='small' />
				</IconButton>
			</Tooltip>
			<Tooltip title='Delete Record'>
				<IconButton
					size='small'
					onClick={() => onDelete(memberData)}
					sx={{ color: '#D20103', bgcolor: '#ffebee' }}>
					<DeleteIcon fontSize='small' />
				</IconButton>
			</Tooltip>
		</Stack>
	);
}

// --- Main Component ---
export default function ListMembers() {
	const queryClient = useQueryClient();
	const theme = useTheme();
	const [filter, setFilter] = useState('');

	// Dialog & Pagination State
	const [selectedUser, setSelectedUser] = useState(null);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Auth & Store
	const { user } = useUser();
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);

	const role = user?.publicMetadata?.role;
	const uniqueId = user?.publicMetadata?.uniqueId;
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	// Data Fetching
	const { data, isLoading, error } = useQuery({
		queryKey: ['getmembers'],
		queryFn: () => fetchMembers(),
	});

	// Filtering Logic
	const filteredList = useMemo(() => {
		if (!data) return [];
		const lower = filter.toLowerCase();
		return data.filter((record) =>
			[record.firstName, record.lastName, record.email, record.middleName].some(
				(field) => field?.toLowerCase().includes(lower)
			)
		);
	}, [data, filter]);

	// Pagination Logic
	const paginatedUsers = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredList.slice(start, start + rowsPerPage);
	}, [filteredList, page, rowsPerPage]);

	const handleChangePage = (_, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// --- Handlers ---
	const handleDeleteClick = (userToDelete) => {
		setSelectedUser(userToDelete);
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
				old.filter((m) => m.id !== id)
			);
			setConfirmDialogOpen(false);
			setSelectedUser(null);
		},
	});

	const handleConfirmDelete = () => {
		if (selectedUser) deleteUser.mutate(selectedUser.id);
	};

	const handleEditClick = (recordId) => {
		setUser({ id: recordId });
		router.push('/members/edit/record');
	};

	const handleViewClick = (recordId) => {
		setUser({ id: recordId });
		router.push('/members/details/view');
	};

	// --- Render Loading/Error ---
	if (isLoading) {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='50vh'>
				<CircularProgress sx={{ color: '#00ACAC' }} />
			</Box>
		);
	}

	if (error) {
		return (
			<Container maxWidth='md' sx={{ mt: 4 }}>
				<Alert
					severity='error'
					action={
						<Button
							color='inherit'
							size='small'
							onClick={() => window.location.reload()}>
							Retry
						</Button>
					}>
					{error?.message || 'Failed to load members.'}
				</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth='xl' sx={{ py: 4 }}>
			{/* Header & Search */}
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				justifyContent='space-between'
				alignItems={{ xs: 'stretch', md: 'center' }}
				spacing={2}
				sx={{ mb: 3 }}>
				<Box>
					<Typography variant='h5' fontWeight='bold' color='#0a0b0b'>
						Registered Members
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						ID: {uniqueId || 'N/A'}
					</Typography>
				</Box>

				<TextField
					placeholder='Search by name or email...'
					size='small'
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					sx={{ width: { xs: '100%', md: 300 }, bgcolor: 'background.paper' }}
					slotProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon color='action' />
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			{/* Content Area */}
			{paginatedUsers.length === 0 ? (
				<Alert severity='info' variant='outlined'>
					No registered members found matching your search.
				</Alert>
			) : (
				<>
					{/* Mobile View: Cards */}
					{isMobile ? (
						<Box>
							{paginatedUsers.map((user) => (
								<MobileMemberCard
									key={user.id}
									member={user}
									canEdit={role === 'admin' || uniqueId === user.nationalId}
									onView={handleViewClick}
									onEdit={handleEditClick}
									onDelete={() =>
										handleDeleteClick({
											id: user.id,
											firstName: user.firstName,
											lastName: user.lastName,
										})
									}
								/>
							))}
						</Box>
					) : (
						/* Desktop View: Table */
						<TableContainer
							component={Paper}
							elevation={2}
							sx={{ borderRadius: 2 }}>
							<Table sx={{ minWidth: 700 }} aria-label='customized table'>
								<TableHead>
									<TableRow>
										<StyledTableCell>Name</StyledTableCell>
										<StyledTableCell>Gender</StyledTableCell>
										<StyledTableCell>Email</StyledTableCell>
										<StyledTableCell>Telephone</StyledTableCell>
										<StyledTableCell>Status</StyledTableCell>
										<StyledTableCell align='center'>Actions</StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{paginatedUsers.map((user) => {
										const canEdit =
											role === 'admin' || uniqueId === user.nationalId;
										return (
											<StyledTableRow key={user.id}>
												<StyledTableCell>
													<Box display='flex' alignItems='center' gap={2}>
														<Avatar
															src='/defaultPhoto.png'
															sx={{ width: 32, height: 32 }}
														/>
														<Box>
															<Typography variant='subtitle2' fontWeight='bold'>
																{user.lastName} {user.firstName}
															</Typography>
															<Typography
																variant='caption'
																color='text.secondary'>
																{user.middleName}
															</Typography>
														</Box>
													</Box>
												</StyledTableCell>
												<StyledTableCell>{user.gender}</StyledTableCell>
												<StyledTableCell>{user.email}</StyledTableCell>
												<StyledTableCell>{user.telephone}</StyledTableCell>
												<StyledTableCell>
													<StatusChip
														declaration={user.declaration}
														size='small'
													/>
												</StyledTableCell>
												<StyledTableCell align='center'>
													<ActionGroup
														memberId={user.id}
														canEdit={canEdit}
														onView={handleViewClick}
														onEdit={handleEditClick}
														onDelete={handleDeleteClick}
														memberData={{
															id: user.id,
															firstName: user.firstName,
															lastName: user.lastName,
														}}
													/>
												</StyledTableCell>
											</StyledTableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					)}

					{/* Pagination (Common for both views) */}
					<TablePagination
						component='div'
						count={filteredList.length}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[5, 10, 25]}
						sx={{ mt: 1 }}
					/>
				</>
			)}

			{/* Confirm Delete Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onClose={handleCancelDelete}
				maxWidth='xs'
				fullWidth>
				<DialogTitle
					sx={{
						bgcolor: '#ffebee',
						color: '#D20103',
						display: 'flex',
						alignItems: 'center',
						gap: 1,
					}}>
					<DeleteIcon /> Confirm Deletion
				</DialogTitle>
				<DialogContent sx={{ mt: 2 }}>
					<DialogContentText>
						Are you sure you want to delete{' '}
						<strong>
							{selectedUser?.firstName} {selectedUser?.lastName}
						</strong>
						?
						<br />
						<br />
						This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					<Button
						onClick={handleCancelDelete}
						variant='outlined'
						color='inherit'>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDelete}
						variant='contained'
						color='error'
						autoFocus>
						Delete Record
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}
