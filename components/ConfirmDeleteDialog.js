'use client';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from '@mui/material';

export default function ConfirmDeleteDialog({
	open,
	onClose,
	onConfirm,
	itemName = 'this item',
}) {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Confirm Delete</DialogTitle>
			<DialogContent>
				<Typography>
					Are you sure you want to delete <strong>{itemName}</strong>?
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='inherit'>
					Cancel
				</Button>
				<Button onClick={onConfirm} color='error' variant='contained'>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
