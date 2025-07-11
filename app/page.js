import LandingPage from '@/components/LandingPage';
import { UserButton } from '@clerk/nextjs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function InsurancePolicyDashboard() {
	return (
		<div className='flex  flex-col items-center justify-center p-6'>
			<LandingPage />
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
