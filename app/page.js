import LandingPage from '@/components/LandingPage';
import { UserButton } from '@clerk/nextjs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
export default function InsurancePolicyDashboard() {
	return (
		<div className='flex  flex-col items-center justify-center p-6'>
			<LandingPage />
			
		</div>
	);
}
