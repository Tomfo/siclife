import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
	// Placeholder for authentication/user logic
	const user = {
		name: 'Ekow Tomfo Bedu-Addo',
		role: 'Admin',
		// username: "ekow.tomfo"
	};

	return (
		<nav className='w-full bg-white shadow-sm sticky top-0 z-40'>
			<div className='max-w-7xl mx-auto px-4 py-2 flex items-center justify-between'>
				{/* Left: Logo or App Name */}
				<Link href='/' className='flex items-center gap-2'>
					<Image
						src='/moba.png'
						alt='Logo'
						width={32}
						height={32}
						className='rounded-full'
					/>
					<span className='font-bold tracking-tight hidden sm:block'>
						MOBA &quot 86 Group Insurance Policy
					</span>
				</Link>

				{/* Center: Search bar */}

				{/* Right: Links, User Info, Auth */}
				<div className='flex items-center gap-5'>
					<div className='hidden sm:flex flex-col items-end gap-1 text-sm'>
						<Link href='/members' className='hover:text-teal-600 transition'>
							Members
						</Link>
						<Link
							href='/members/create'
							className='hover:text-teal-600 transition'>
							Register
						</Link>
					</div>

					<div className='flex flex-col items-end ml-2'>
						<span className='font-semibold leading-4 text-xs sm:text-sm'>
							{user.name}
						</span>
						<span className='text-[10px] text-gray-500'>{user.role}</span>
					</div>

					<div className='ml-3'>
						{/* Replace with <UserButton /> etc. if using auth */}
						<Image
							src='/noavatar.png'
							alt='User'
							width={32}
							height={32}
							className='rounded-full border border-gray-200'
						/>
					</div>
				</div>
			</div>
		</nav>
	);
}
