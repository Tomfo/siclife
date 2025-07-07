'use client';
import { useState, useMemo } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
} from '@tanstack/react-table';

// Main App component
export default function ListPage() {
	// Sample data for the table
	const data = useMemo(
		() => [
			{
				id: 1,
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@example.com',
				role: 'User',
			},
			{
				id: 2,
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane.smith@example.com',
				role: 'Admin',
			},
			{
				id: 3,
				firstName: 'Peter',
				lastName: 'Jones',
				email: 'peter.jones@example.com',
				role: 'Editor',
			},
			{
				id: 4,
				firstName: 'Alice',
				lastName: 'Brown',
				email: 'alice.brown@example.com',
				role: 'User',
			},
			{
				id: 5,
				firstName: 'Bob',
				lastName: 'White',
				email: 'bob.white@example.com',
				role: 'Admin',
			},
			{
				id: 6,
				firstName: 'Charlie',
				lastName: 'Green',
				email: 'charlie.green@example.com',
				role: 'User',
			},
			{
				id: 7,
				firstName: 'Diana',
				lastName: 'Black',
				email: 'diana.black@example.com',
				role: 'Editor',
			},
			{
				id: 8,
				firstName: 'Eve',
				lastName: 'Gray',
				email: 'eve.gray@example.com',
				role: 'User',
			},
			{
				id: 9,
				firstName: 'Frank',
				lastName: 'Blue',
				email: 'frank.blue@example.com',
				role: 'Admin',
			},
			{
				id: 10,
				firstName: 'Grace',
				lastName: 'Red',
				email: 'grace.red@example.com',
				role: 'User',
			},
			{
				id: 11,
				firstName: 'Heidi',
				lastName: 'Yellow',
				email: 'heidi.yellow@example.com',
				role: 'Editor',
			},
			{
				id: 12,
				firstName: 'Ivan',
				lastName: 'Orange',
				email: 'ivan.orange@example.com',
				role: 'User',
			},
			{
				id: 13,
				firstName: 'Judy',
				lastName: 'Purple',
				email: 'judy.purple@example.com',
				role: 'Admin',
			},
			{
				id: 14,
				firstName: 'Kelly',
				lastName: 'Pink',
				email: 'kelly.pink@example.com',
				role: 'User',
			},
			{
				id: 15,
				firstName: 'Liam',
				lastName: 'Cyan',
				email: 'liam.cyan@example.com',
				role: 'Editor',
			},
		],
		[]
	);

	// Define the columns for the table
	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'firstName',
				header: 'First Name',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lastName',
				header: 'Last Name',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: (info) => info.getValue(),
			},
			{
				id: 'actions', // Unique ID for the actions column
				header: 'Actions',
				cell: ({ row }) => (
					<div className='flex space-x-2'>
						<button
							onClick={() => handleEdit(row.original)}
							className='px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 ease-in-out'>
							View{' '}
						</button>
						<button
							onClick={() => handleEdit(row.original)}
							className='px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out'>
							Edit
						</button>
						<button
							onClick={() => handleDelete(row.original.id)}
							className='px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out'>
							Delete
						</button>
					</div>
				),
			},
		],
		[]
	);

	// State for global filter
	const [globalFilter, setGlobalFilter] = useState('');

	// Initialize the table instance
	const table = useReactTable({
		data,
		columns,
		state: {
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), // Enable filtering
		getPaginationRowModel: getPaginationRowModel(), // Enable pagination
		initialState: {
			pagination: {
				pageSize: 5, // Default page size
			},
		},
	});

	// Action button handlers (placeholder functions)
	const handleEdit = (rowData) => {
		console.log('Editing row:', rowData);
		// In a real app, you'd open a modal or navigate to an edit page
		alert(`Editing user: ${rowData.firstName} ${rowData.lastName}`);
	};

	const handleDelete = (id) => {
		console.log('Deleting row with ID:', id);
		// In a real app, you'd show a confirmation dialog and then delete from state/API
		alert(`Deleting user with ID: ${id}`);
	};

	return (
		<div className='min-h-screen bg-gray-100 p-8 font-sans antialiased'>
			<div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
					User Management Table
				</h1>

				{/* Global Filter Input */}
				<div className='mb-6 flex justify-end'>
					<input
						type='text'
						value={globalFilter ?? ''}
						onChange={(e) => setGlobalFilter(e.target.value)}
						placeholder='Search all columns...'
						className='px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3 transition duration-150 ease-in-out'
					/>
				</div>

				{/* Table Container */}
				<div className='overflow-x-auto rounded-lg shadow-md border border-gray-200'>
					<table className='min-w-full divide-y divide-gray-200'>
						{/* Table Header */}
						<thead className='bg-gray-50'>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className='bg-gray-200 text-left'>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg rounded-tr-lg'>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</th>
									))}
								</tr>
							))}
						</thead>
						{/* Table Body */}
						<tbody className='bg-white divide-y divide-gray-200'>
							{table.getRowModel().rows.length > 0 ? (
								table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className='odd:bg-white even:bg-gray-50 hover:bg-gray-100'>
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
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
									<td
										colSpan={columns.length}
										className='px-6 py-4 text-center text-gray-500'>
										No data available.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination Controls */}
				<div className='flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0'>
					<div className='flex items-center space-x-2'>
						<button
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out'>
							{'<<'}
						</button>
						<button
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out'>
							{'<'}
						</button>
						<button
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out'>
							{'>'}
						</button>
						<button
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out'>
							{'>>'}
						</button>
					</div>

					<span className='text-sm text-gray-700'>
						Page{' '}
						<strong className='font-semibold'>
							{table.getState().pagination.pageIndex + 1} of{' '}
							{table.getPageCount()}
						</strong>
					</span>

					<span className='flex items-center space-x-2 text-sm text-gray-700'>
						Go to page:
						<input
							type='number'
							defaultValue={table.getState().pagination.pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								table.setPageIndex(page);
							}}
							className='w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out'
						/>
					</span>

					<select
						value={table.getState().pagination.pageSize}
						onChange={(e) => {
							table.setPageSize(Number(e.target.value));
						}}
						className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-sm text-gray-700'>
						{[5, 10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
