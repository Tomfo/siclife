'use client';

import Link from 'next/link';
import Image from 'next/image';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import ListAltTwoToneIcon from '@mui/icons-material/ListAltTwoTone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
} from '@clerk/nextjs';

export default function MainHeader() {
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);

	const linkClass = (href) =>
		`flex items-center gap-1 px-3 py-2 rounded transition hover:text-teal-600 hover:bg-blue-100 ${
			pathname === href ? 'font-bold text-yellow bg-gray-200' : 'text-gray-700'
		}`;

	const { user } = useUser();

	return (
		<nav className='w-full bg-white shadow-sm sticky top-0 z-40'>
			<div className='max-w-7xl mx-auto px-4 py-2 flex items-center justify-between'>
				{/* Left: Logo */}
				<Link href='/' className='flex items-center gap-2'>
					{/* <Image
						src='/SIClogo.png'
						alt='Logo'
						unoptimized
						width={100}
						height={100}
						style={{ width: 100, height: 100 }}
						className='rounded-full'
					/> */}
					<Image
						src='/moba.png'
						alt='Logo'
						width={36}
						height={36}
						className='rounded-full'
						style={{ width: 36, height: 36 }}
						unoptimized
					/>
				</Link>
				<div className='hidden md:block m-1'>
					<Typography
						variant='h5'
						sx={{ flexGrow: 1, fontFamily: '"Eagle Lake", serif' }}>
						MOBA 86 Group Insurance Policy
					</Typography>
				</div>

				{/* Center: Desktop Nav */}
				<ul className='hidden md:flex gap-4 flex-1 justify-center'>
					<li>
						<Link href='/members' className={linkClass('/members')}>
							<ListAltTwoToneIcon fontSize='small' />
							List Members
						</Link>
					</li>
					<li>
						<Link href='/members/create' className={linkClass('/register')}>
							<PersonAddIcon fontSize='small' />
							Add New Member
						</Link>
					</li>
				</ul>

				{/* Right: User Info */}
				<div className='flex items-center gap-3'>
					<div className='flex flex-col items-end'>
						<span className='font-semibold leading-4 text-xs sm:text-sm'>
							{user?.username}
						</span>
						{/* <span className='text-[10px] text-gray-600'>{user.role}</span> */}
					</div>
					<header className='flex justify-end items-center p-4 gap-4 h-16'>
						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<Button href='/sign-in' variant='outlined' color='error'>
								Sign In
							</Button>
						</SignedOut>
					</header>

					{/* Mobile menu button */}
					<button
						className='md:hidden ml-1 p-2 rounded hover:bg-blue-200'
						aria-label={
							menuOpen ? 'Close navigation menu' : 'Open navigation menu'
						}
						onClick={() => setMenuOpen((prev) => !prev)}>
						{menuOpen ? <CloseIcon /> : <MenuIcon />}
					</button>
				</div>
			</div>

			{/* Mobile Nav Drawer */}
			{menuOpen && (
				<div className='md:hidden bg-blue-200 px-6 py-4'>
					<ul className='flex flex-col gap-2'>
						<li>
							<Link
								href='/members'
								className={linkClass('/members')}
								onClick={() => setMenuOpen(false)}>
								<ListAltTwoToneIcon fontSize='small' />
								List Members
							</Link>
						</li>
						<li>
							<Link
								href='/members/create'
								className={linkClass('/members/register')}
								onClick={() => setMenuOpen(false)}>
								<PersonAddIcon fontSize='small' />
								Add New Member
							</Link>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}
