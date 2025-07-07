// src/components/users-table.js
'use client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Button from '@mui/material/Button';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@mui/material';

export function UsersTable({ initialData }) {
	const [data, setData] = useState(initialData.users);
	const [page, setPage] = useState(initialData.page);
	const [totalPages, setTotalPages] = useState(initialData.totalPages);
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const fetchUsers = async (page, search) => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/list?page=${page}&search=${encodeURIComponent(search)}`
			);
			const result = await response.json();
			setData(result.users);
			setTotalPages(result.totalPages);
		} catch (error) {
			console.error('Error fetching users:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchUsers(1, search);
			setPage(1);
		}, 500);
		return () => clearTimeout(timer);
	}, [search]);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
			fetchUsers(newPage, search);
		}
	};

	const columns = [
		{
			accessorKey: 'avatar',
			header: '',
			cell: ({ row }) => {
				const user = row.original;
				const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
					0
				)}`;
				return (
					<Avatar className='h-10 w-10'>
						{user.avatar ? (
							<AvatarImage
								src={`'/defaultPhoto.png`}
								alt={`${user.firstName} ${user.lastName}`}
							/>
						) : null}
						<AvatarFallback className='bg-gray-100 rounded-full flex items-center justify-center'>
							{initials}
						</AvatarFallback>
					</Avatar>
				);
			},
		},
		{
			accessorKey: 'name',
			header: 'Full Name',
			cell: ({ row }) => {
				const user = row.original;
				return <span>{`${user.firstName} ${user.lastName}`}</span>;
			},
		},
		{
			accessorKey: 'gender',
			header: 'Gender',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'telephone',
			header: 'Telephone',
		},
		{
			accessorKey: 'declaration',
			header: 'Status',
			cell: ({ row }) => {
				return (
					<Chip
						icon={row.declaration ? <CheckCircleIcon /> : <CancelIcon />}
						label={row.declaration ? 'Complete' : 'Active'}
						color={row.declaration ? 'success' : 'error'}
						variant='outlined'
					/>
				);
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const user = row.original;

				return (
					<div className='flex space-x-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => console.log('View', user.id)}>
							View
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => console.log('Edit', user.id)}>
							Edit
						</Button>
						<Button
							variant='destructive'
							size='sm'
							onClick={() => console.log('Delete', user.id)}>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<input
					placeholder='Search by name or email...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='max-w-sm'
				/>
			</div>

			<div className='rounded-md border'>
				<table>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<tr key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} className='h-24 text-center'>
									{isLoading ? 'Loading...' : 'No results found.'}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className='flex items-center justify-between px-2'>
				<div className='text-sm text-muted-foreground'>
					Page {page} of {totalPages}
				</div>
				<div className='flex items-center space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => handlePageChange(page - 1)}
						disabled={page === 1 || isLoading}>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => handlePageChange(page + 1)}
						disabled={page === totalPages || isLoading}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
