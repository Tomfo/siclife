

import { StyledTableCell,StyledTableRow,ActionButton,MemberInfoCell,StatusChip } from "@/app/members/pageutils";

export default function ListMembers(data) {
	const [isDisabled, setIsDisabled] = useState(false);
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [selectedUser, setSelectedUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	//from clerk
	const { user } = useUser();
	const role = user?.publicMetadata?.role;
	const uniqueId = user?.publicMetadata?.uniqueId;
	const isMobile = useMediaQuery('(max-width:640px)');
	const primaryEmail = user?.primaryEmailAddress?.emailAddress;
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	// Fetch users from API
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
			const data = await res.json();
			setUsers(data);
			setFilteredUsers(data);
		} catch (error) {
			setError('Failed to fetch Registered Members');
			console.error('Failed to fetch Registered Members:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Handle user deletion
	const handleDeleteClick = (user) => {
		setSelectedUser({
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
		});
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

	const handleConfirmDelete = async () => {
		if (!selectedUser) return;

		try {
			await fetch(
				`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${selectedUser.id}`,
				{
					method: 'DELETE',
				}
			);
			setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
		} catch (err) {
			console.error('Delete failed', err);
		} finally {
			setSelectedUser(null);
		}
	};

	// Filter users based on search term
	useEffect(() => {
		if (!searchTerm) {
			setFilteredUsers(users);
			return;
		}

		const term = searchTerm.toLowerCase();
		const filtered = users.filter((user) =>
			['firstName', 'email', 'middleName', 'lastName'].some((field) =>
				user[field]?.toLowerCase().includes(term)
			)
		);

		setFilteredUsers(filtered);
		setPage(0);
	}, [searchTerm, users]);

	// Initial data fetch
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Pagination handlers
	const handleChangePage = (_, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Calculate visible rows
	const visibleRows = filteredUsers.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

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
				<Button variant='contained' onClick={fetchUsers}>
					Retry
				</Button>
			</Box>
		);
	}

	if (filteredUsers.length === 0) {
		return (
			<Box mt={4} textAlign='center'>
				<Alert severity='info'>No Registered Members Found.</Alert>
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
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
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
						{visibleRows.map((user) => (
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
											<ActionButton
												onClick={() => handleViewClick(user.id)}
												icon={PreviewRoundedIcon}
												color='#CC6CE7'
												label='View'
											/>
											<ActionButton
												//	href={`/members/${user.id}/edit`}
												onClick={() => handleEditClick(user.id)}
												icon={EditIcon}
												color='#060270'
												label='Edit'
											/>
											<ActionButton
												onClick={() => handleDeleteClick(user)}
												icon={DeleteIcon}
												color='#D20103'
												label='Delete'
											/>
										</Box>
									)}
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>

				<TablePagination
					component='div'
					count={filteredUsers.length}
					page={page}
					onPageChange={handleChangePage}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
				/>
			</TableContainer>

			{/* Delete Confirmation Dialog */}
			<ConfirmDeleteDialog
				open={!!selectedUser}
				onClose={() => setSelectedUser(null)}
				onConfirm={handleConfirmDelete}
				itemName={selectedUser?.name}
			/>
		</div>
	);
}
