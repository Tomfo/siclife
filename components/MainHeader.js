'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// MUI Components
import {
	AppBar,
	Toolbar,
	Container,
	Box,
	Typography,
	Button,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Stack,
	useTheme,
	useMediaQuery,
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ListAltTwoToneIcon from '@mui/icons-material/ListAltTwoTone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';

// Clerk
import {
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
	SignInButton, // Added for cleaner logic
} from '@clerk/nextjs';

// --- Configuration ---
const NAV_LINKS = [
	{ label: 'List Members', href: '/members', icon: <ListAltTwoToneIcon /> },
	{ label: 'Add New Member', href: '/members/create', icon: <PersonAddIcon /> },
];

export default function MainHeader() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const { user } = useUser();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	// --- Sub-component: Desktop Nav Item ---
	const DesktopNavItem = ({ href, label, icon }) => {
		const isActive = pathname === href;
		return (
			<Button
				component={Link}
				href={href}
				startIcon={icon}
				variant={isActive ? 'soft' : 'text'} // specific to modern MUI, fallback below
				sx={{
					color: isActive ? '#00ACAC' : 'text.secondary',
					fontWeight: isActive ? 700 : 500,
					bgcolor: isActive ? 'rgba(0, 172, 172, 0.08)' : 'transparent',
					'&:hover': {
						bgcolor: 'rgba(0, 172, 172, 0.15)',
						color: '#00ACAC',
					},
					textTransform: 'none',
					px: 2,
				}}>
				{label}
			</Button>
		);
	};

	// --- Sub-component: Mobile Drawer Content ---
	const drawerContent = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: 'center', height: '100%' }}>
			<Box
				sx={{
					py: 3,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					bgcolor: '#f8f9fa',
				}}>
				<Image
					src='/moba.png'
					alt='Logo'
					width={60}
					height={60}
					className='rounded-full'
					style={{ marginBottom: 10 }}
					unoptimized
				/>
				<Typography variant='h6' sx={{ color: '#00ACAC', fontWeight: 'bold' }}>
					MOBA 86
				</Typography>
			</Box>
			<Divider />
			<List>
				{NAV_LINKS.map((item) => {
					const isActive = pathname === item.href;
					return (
						<ListItem key={item.href} disablePadding>
							<ListItemButton
								component={Link}
								href={item.href}
								selected={isActive}
								sx={{
									'&.Mui-selected': {
										bgcolor: 'rgba(0, 172, 172, 0.1)',
										borderLeft: '4px solid #00ACAC',
										color: '#00ACAC',
										'&:hover': { bgcolor: 'rgba(0, 172, 172, 0.2)' },
									},
									pl: isActive ? 2 : 2.5, // Visual offset for active state
								}}>
								<ListItemIcon sx={{ color: isActive ? '#00ACAC' : 'inherit' }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									primary={item.label}
									primaryTypographyProps={{ fontWeight: isActive ? 700 : 400 }}
								/>
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>

			{/* Mobile User Info Footer */}
			<Box
				sx={{
					position: 'absolute',
					bottom: 0,
					width: '100%',
					p: 2,
					borderTop: '1px solid #eee',
				}}>
				<SignedIn>
					<Stack
						direction='row'
						alignItems='center'
						spacing={2}
						justifyContent='center'>
						<UserButton showName />
					</Stack>
				</SignedIn>
				<SignedOut>
					<SignInButton mode='modal'>
						<Button
							fullWidth
							variant='contained'
							color='primary'
							startIcon={<LoginIcon />}>
							Sign In
						</Button>
					</SignInButton>
				</SignedOut>
			</Box>
		</Box>
	);

	return (
		<>
			<AppBar
				position='sticky'
				color='default'
				elevation={1}
				sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
				<Container maxWidth='xl'>
					<Toolbar disableGutters sx={{ height: 70 }}>
						{/* 1. Left: Logo & Branding */}
						<Link
							href='/'
							style={{
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
							}}>
							<Image
								src='/moba.png'
								alt='Logo'
								width={40}
								height={40}
								className='rounded-full'
								unoptimized
							/>
							<Box>
								<Typography
									variant='h6'
									noWrap
									sx={{
										fontFamily: '"Eagle Lake", serif',
										color: '#333',
										fontWeight: 'bold',
										lineHeight: 1.2,
										fontSize: { xs: '1rem', md: '1.25rem' }, // Responsive font
									}}>
									MOBA 86 Policy
								</Typography>
							</Box>
						</Link>

						{/* Spacer */}
						<Box sx={{ flexGrow: 1 }} />

						{/* 2. Center: Desktop Navigation */}
						<Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 4 }}>
							{NAV_LINKS.map((link) => (
								<DesktopNavItem key={link.href} {...link} />
							))}
						</Box>

						{/* 3. Right: User Actions & Mobile Toggle */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							{/* Desktop User Info */}
							<Box sx={{ display: { xs: 'none', md: 'block' } }}>
								<SignedIn>
									<Stack direction='row' alignItems='center' spacing={1}>
										<Box textAlign='right' mr={1}>
											<Typography variant='body2' fontWeight='bold'>
												{user?.username || user?.firstName}
											</Typography>
											{/* Optional Role Display */}
											{/* <Typography variant="caption" color="text.secondary" display="block">
                             {user?.publicMetadata?.role || 'Member'}
                         </Typography> */}
										</Box>
										<UserButton />
									</Stack>
								</SignedIn>
								<SignedOut>
									<SignInButton mode='modal'>
										<Button
											variant='outlined'
											color='primary'
											startIcon={<LoginIcon />}>
											Sign In
										</Button>
									</SignInButton>
								</SignedOut>
							</Box>

							{/* Mobile Menu Button */}
							<IconButton
								color='inherit'
								aria-label='open drawer'
								edge='end'
								onClick={handleDrawerToggle}
								sx={{ display: { md: 'none' }, ml: 1, color: '#00ACAC' }}>
								{mobileOpen ? <CloseIcon /> : <MenuIcon />}
							</IconButton>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Mobile Navigation Drawer */}
			<Drawer
				anchor='right'
				variant='temporary'
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', md: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
				}}>
				{drawerContent}
			</Drawer>
		</>
	);
}
