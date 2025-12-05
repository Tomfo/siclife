'use client';

import { useState, useMemo } from 'react';
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
	SignInButton,
} from '@clerk/nextjs';

// --- Configuration ---
const NAV_LINKS = [
	{ label: 'List Members', href: '/members', icon: <ListAltTwoToneIcon /> },
	{ label: 'Add New Member', href: '/members/create', icon: <PersonAddIcon /> },
];

const BRAND_COLOR = '#00ACAC';
const BRAND_NAME = 'MOBA 86 Life Policy';
const LOGO_URL = '/moba.png';

// --- Sub-component: Brand Logo ---
const Brand = ({ size = 'small' }) => {
	const dimension = size === 'small' ? 40 : 60;
	return (
		<Link
			href='/'
			style={{
				textDecoration: 'none',
				display: 'flex',
				alignItems: 'center',
				gap: '12px',
			}}>
			<Image
				src={LOGO_URL}
				alt='MOBA 86 Logo'
				width={dimension}
				height={dimension}
				className='rounded-full'
				priority
				unoptimized
			/>
			{size === 'small' && (
				<Typography
					variant='h6'
					noWrap
					sx={{
						fontFamily: '"Eagle Lake", serif',
						color: '#333',
						fontWeight: 'bold',
						lineHeight: 1.2,
						fontSize: { xs: '1rem', md: '1.25rem' },
					}}>
					{BRAND_NAME}
				</Typography>
			)}
		</Link>
	);
};

// --- Sub-component: Desktop Navigation Item ---
const DesktopNavItem = ({ href, label, icon, isActive }) => {
	return (
		<Button
			component={Link}
			href={href}
			startIcon={icon}
			aria-current={isActive ? 'page' : undefined}
			sx={{
				color: isActive ? BRAND_COLOR : 'text.secondary',
				fontWeight: isActive ? 700 : 500,
				bgcolor: isActive ? 'rgba(0, 172, 172, 0.08)' : 'transparent',
				'&:hover': {
					bgcolor: 'rgba(0, 172, 172, 0. 15)',
					color: BRAND_COLOR,
				},
				'&:focus-visible': {
					outline: `2px solid ${BRAND_COLOR}`,
					outlineOffset: '2px',
				},
				textTransform: 'none',
				px: 2,
				py: 1,
				transition: 'all 0.2s ease-in-out',
			}}>
			{label}
		</Button>
	);
};

// --- Sub-component: Mobile Navigation Item ---
const MobileNavItem = ({ href, label, icon, isActive, onClick }) => {
	return (
		<ListItem disablePadding>
			<ListItemButton
				component={Link}
				href={href}
				selected={isActive}
				onClick={onClick}
				aria-current={isActive ? 'page' : undefined}
				sx={{
					'&. Mui-selected': {
						bgcolor: 'rgba(0, 172, 172, 0.1)',
						borderLeft: `4px solid ${BRAND_COLOR}`,
						color: BRAND_COLOR,
						'&:hover': { bgcolor: 'rgba(0, 172, 172, 0.2)' },
					},
					pl: isActive ? 2 : 2.5,
					py: 1.5,
					transition: 'all 0.2s ease-in-out',
				}}>
				<ListItemIcon sx={{ color: isActive ? BRAND_COLOR : 'inherit' }}>
					{icon}
				</ListItemIcon>
				<ListItemText
					primary={label}
					primaryTypographyProps={{ fontWeight: isActive ? 700 : 400 }}
				/>
			</ListItemButton>
		</ListItem>
	);
};

// --- Sub-component: User Menu ---
const UserMenu = () => {
	const { user } = useUser();

	return (
		<>
			<SignedIn>
				<Stack direction='row' alignItems='center' spacing={1.5}>
					<Box textAlign='right'>
						<Typography variant='body2' fontWeight='bold'>
							{user?.username || user?.firstName || 'User'}
						</Typography>
					</Box>
					<UserButton />
				</Stack>
			</SignedIn>
			<SignedOut>
				<SignInButton mode='modal'>
					<Button
						variant='outlined'
						color='primary'
						startIcon={<LoginIcon />}
						sx={{
							'&:focus-visible': {
								outline: `2px solid ${BRAND_COLOR}`,
							},
						}}>
						Sign In
					</Button>
				</SignInButton>
			</SignedOut>
		</>
	);
};

// --- Sub-component: Mobile Drawer ---
const MobileDrawer = ({ open, onClose, pathname }) => {
	return (
		<Drawer
			anchor='right'
			variant='temporary'
			open={open}
			onClose={onClose}
			ModalProps={{
				keepMounted: true,
			}}
			sx={{
				'& .MuiDrawer-paper': {
					boxSizing: 'border-box',
					width: { xs: '100%', sm: 280 },
					display: 'flex',
					flexDirection: 'column',
				},
			}}>
			{/* Drawer Header */}
			<Box
				sx={{
					py: 3,
					px: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					bgcolor: '#f8f9fa',
					gap: 1,
				}}>
				<Brand size='large' />
				<Typography
					variant='body2'
					sx={{ color: 'text.secondary', textAlign: 'center' }}>
					Member Management System
				</Typography>
			</Box>
			<Divider />

			{/* Navigation List */}
			<List sx={{ flex: 1, py: 1 }}>
				{NAV_LINKS.map((item) => {
					const isActive = pathname === item.href;
					return (
						<MobileNavItem
							key={item.href}
							href={item.href}
							label={item.label}
							icon={item.icon}
							isActive={isActive}
							onClick={onClose}
						/>
					);
				})}
			</List>

			{/* Mobile User Info Footer */}
			<Box
				sx={{
					p: 2,
					borderTop: '1px solid #eee',
					mt: 'auto',
				}}>
				<SignedIn>
					<Stack spacing={1.5}>
						<UserMenu />
					</Stack>
				</SignedIn>
				<SignedOut>
					<SignInButton mode='modal'>
						<Button
							fullWidth
							variant='contained'
							color='primary'
							startIcon={<LoginIcon />}
							onClick={onClose}>
							Sign In
						</Button>
					</SignInButton>
				</SignedOut>
			</Box>
		</Drawer>
	);
};

// --- Main Component ---
export default function MainHeader() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	// Toggle drawer
	const handleDrawerToggle = () => {
		setMobileOpen((prev) => !prev);
	};

	// Close drawer
	const handleDrawerClose = () => {
		setMobileOpen(false);
	};

	// Memoize nav items to prevent unnecessary re-renders
	const navItems = useMemo(
		() =>
			NAV_LINKS.map((link) => ({
				...link,
				isActive: pathname === link.href,
			})),
		[pathname]
	);

	return (
		<>
			<AppBar
				position='sticky'
				color='default'
				elevation={1}
				sx={{
					bgcolor: 'background.paper',
					borderBottom: '1px solid #e0e0e0',
				}}>
				<Container maxWidth='xl'>
					<Toolbar
						disableGutters
						sx={{
							height: { xs: 64, md: 70 },
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							gap: { xs: 1, md: 2 },
						}}>
						{/* 1. Left: Logo & Branding */}
						<Brand size='small' />

						{/* 2. Center: Desktop Navigation */}
						<Stack
							direction='row'
							spacing={1}
							sx={{
								display: { xs: 'none', md: 'flex' },
								flex: 1,
								justifyContent: 'center',
								ml: 4,
							}}>
							{navItems.map((item) => (
								<DesktopNavItem
									key={item.href}
									href={item.href}
									label={item.label}
									icon={item.icon}
									isActive={item.isActive}
								/>
							))}
						</Stack>

						{/* 3. Right: User Actions & Mobile Toggle */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							{/* Desktop User Info */}
							<Box sx={{ display: { xs: 'none', md: 'block' } }}>
								<UserMenu />
							</Box>

							{/* Mobile Menu Button */}
							{isMobile && (
								<IconButton
									color='inherit'
									aria-label={
										mobileOpen
											? 'close navigation menu'
											: 'open navigation menu'
									}
									edge='end'
									onClick={handleDrawerToggle}
									sx={{ color: BRAND_COLOR }}>
									{mobileOpen ? <CloseIcon /> : <MenuIcon />}
								</IconButton>
							)}
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Mobile Navigation Drawer */}
			<MobileDrawer
				open={mobileOpen}
				onClose={handleDrawerClose}
				pathname={pathname}
			/>
		</>
	);
}
