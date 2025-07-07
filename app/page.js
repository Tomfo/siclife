import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function InsurancePolicyDashboard() {
	return (
		<div className='flex  flex-col items-center justify-center p-6'>
			<Image
				src='/sic.png'
				width={600}
				height={600}
				priority={true}
				style={{ width: 600, height: 600 }}
				alt='Picture of SIC'></Image>
			<div className='m-5'>
				<Link
					underline='none'
					component='button'
					variant='body2'
					href='/sign-up'
					sx={{ fontSize: '2rem', color: 'black', fontWeight: 'bold' }}>
					Sign Up
				</Link>
			</div>
		</div>
	);
}
