'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMediaQuery } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import {
	Modal,
	Box,
	Typography,
	Alert,
	CircularProgress,
	Fade,
	TextField,
	Backdrop,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TablePagination,
	TableRow,
	Paper,
	IconButton,
	Chip,
	Container,
	Card,
	CardContent,
	CardActions,
	CardHeader,
	Button,
	Avatar,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${TableCell.head}`]: {
		backgroundColor: '#00ACAC',
		color: theme.palette.common.white,
		// fontWeight: 600,
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

// Responsive cell component
function ResponsiveInfoCell({ member }) {
	const { user } = useUser();
	const isMobile = useMediaQuery('(max-width:640px)');
	const primaryEmail = user?.primaryEmailAddress?.emailAddress;

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Avatar src={'/defaultPhoto.png'} sx={{ width: 32, height: 32, mr: 1 }} />
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

export default function RegisteredMembersPage() {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const { user } = useUser();
	const [selectedUser, setSelectedUser] = useState(null);
	const isMobile = useMediaQuery('(max-width:640px)');
	const primaryEmail = user?.primaryEmailAddress?.emailAddress;

	const handleDeleteClick = async (record) => {
		// Perform your delete operation here
		console.log(`Deleting user with id ${record.id}`);
		setSelectedUser(record);
		// const confirmDelete = confirm(
		// 	`Are you sure you want to delete this user? ${record.name}`
		// );
		// if (!confirmDelete) return;
		// await fetch(`/api/members/${record.id}`, {
		// 	method: 'DELETE',
		// });

		// Remove from UI immediately
		//	setUsers((prev) => prev.filter((user) => user.id !== record.id));
	};

	const handleCloseDialog = () => {
		setSelectedUser(null);
	};

	const handleConfirmDelete = async () => {
		try {
			// Replace with actual DELETE request
			await fetch(`/api/members/${selectedUser.id}`, {
				method: 'DELETE',
			});

			// Remove user locally
			setUsers(users.filter((u) => u.id !== selectedUser.id));
		} catch (err) {
			console.error('Delete failed', err);
		} finally {
			setSelectedUser(null);
		}
	};

	const fetchUsers = async () => {
		const res = await fetch('/api/members');
		const data = await res.json();
		setUsers(data);
		setFilteredUsers(data);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		const term = searchTerm.toLowerCase();
		const filtered = users.filter(
			(user) =>
				user.firstName.toLowerCase().includes(term) ||
				user.email.toLowerCase().includes(term) ||
				user.middleName.toLowerCase().includes(term) ||
				user.lastName.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
		setPage(0);
	}, [searchTerm, users]);

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<div className='m-5 bg-white p-2'>
			<div className='flex items-center justify-between'>
				<div className='flex-1 flex justify-items-start'>
					<div className='flex items-center gap-2 bg-gray-50 rounded-md ring-1 ring-gray-300 px-3 py-1 w-[260px] mb-2'>
						<Image src='/search.png' alt='Search' width={16} height={16} />
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='Search…'
							className='w-full bg-transparent outline-none text-sm px-2 py-1'
						/>
					</div>
				</div>
				<div className='hidden md:flex'>
					<h1 className='text-[#0a0b0b] font-bold text-md'>
						REGISTERED MEMBERS
					</h1>
				</div>
			</div>

			<TableContainer
				component={Paper}
				sx={{ width: '100%', overflowX: 'auto' }}>
				<Table aria-label='members table' sx={{ minWidth: 640 }}>
					<TableHead
						sx={{
							background: '#c4c7d4',
							color: 'white',
						}}>
						<TableRow>
							<StyledTableCell>Info</StyledTableCell>
							{/* {!isMobile && <StyledTableCell>Identification</StyledTableCell>} */}
							{!isMobile && <StyledTableCell>Gender</StyledTableCell>}
							{/* {!isMobile && <StyledTableCell>Birthday</StyledTableCell>} */}
							{!isMobile && <StyledTableCell>Email</StyledTableCell>}
							{!isMobile && <StyledTableCell>Telephone</StyledTableCell>}
							{!isMobile && <StyledTableCell>Status</StyledTableCell>}
							<StyledTableCell>Actions</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsers
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((user) => (
								<StyledTableRow key={user.id}>
									<StyledTableCell>
										<ResponsiveInfoCell
											member={{
												id: user.id,
												middleName: user.middleName,
												firstName: user.firstName,
												lastName: user.lastName,
												declaration: user.declaration,
												email: user.email,
											}}
										/>
									</StyledTableCell>
									{/* {!isMobile && (
                    <StyledTableCell>
                      <strong>{user.idType}</strong>
                      <br />
                      {user.nationalId}
                    </StyledTableCell>
                  )} */}
									{!isMobile && (
										<StyledTableCell>{user.gender}</StyledTableCell>
									)}

									{!isMobile && (
										<StyledTableCell sx={{ wordBreak: 'break-all' }}>
											{user.email}
										</StyledTableCell>
									)}
									{!isMobile && (
										<StyledTableCell sx={{ wordBreak: 'break-all' }}>
											{user.telephone}
										</StyledTableCell>
									)}
									{!isMobile && (
										<StyledTableCell>
											<Chip
												size='small'
												icon={
													user.declaration ? (
														<CheckCircleIcon />
													) : (
														<CancelIcon />
													)
												}
												label={user.declaration ? 'Complete' : 'Pending'}
												color={user.declaration ? 'success' : 'error'}
												variant='outlined'
											/>
										</StyledTableCell>
									)}
									<StyledTableCell>
										{user.email === primaryEmail && (
											<Box sx={{ display: 'flex', gap: 1 }}>
												<Link href={`/members/details/${user.id}`} passHref>
													<IconButton
														size='small'
														// sx={{ bgcolor: '#CC6CE7', color: 'white' }}
														sx={{
															color: 'white',
															bgcolor: '#CC6CE7', // Light gray from theme
															'&:hover': {
																bgcolor: 'green', // Light red from theme (if using custom palette)
															},
														}}
														aria-label='View'>
														<PreviewRoundedIcon fontSize='small' />
													</IconButton>
												</Link>

												<Link href={`/members/${user.id}/edit`} passHref>
													<IconButton
														size='small'
														// sx={{ bgcolor: '#060270', color: 'white' }}
														sx={{
															color: 'white',
															bgcolor: '#060270', // Light gray from theme
															'&:hover': {
																bgcolor: 'green', // Light red from theme (if using custom palette)
															},
														}}
														aria-label='Edit'>
														<EditIcon fontSize='smaall' />
													</IconButton>
												</Link>
												<div>
													<IconButton
														onClick={() =>
															handleDeleteClick({
																id: user.id,
																name: user.firstName + ' ' + user.lastName,
															})
														}
														size='small'
														// sx={{ bgcolor: '#D20103', color: 'white' }}
														sx={{
															color: 'white',
															bgcolor: '#D20103', // Light gray from theme
															'&:hover': {
																bgcolor: 'green', // Light red from theme (if using custom palette)
															},
														}}
														aria-label='Delete'>
														<DeleteIcon fontSize='smaall' />
													</IconButton>
												</div>
											</Box>
										)}
									</StyledTableCell>
								</StyledTableRow>
							))}
						{filteredUsers.length === 0 && (
							<TableRow>
								<TableCell colSpan={4}>No users found.</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<TablePagination
					component='div'
					count={filteredUsers.length}
					page={page}
					onPageChange={handleChangePage}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					rowsPerPageOptions={[5, 10, 25]}
				/>
			</TableContainer>
			<ConfirmDeleteDialog
				open={!!selectedUser}
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDelete}
				itemName={selectedUser?.name}
			/>
		</div>
	);
}
