'use client';
import Image from 'next/image';
export default function LandingPage() {
	return (
		<>
			<div className='relative w-full max-w-[400px] aspect-square'>
				<Image
					src='/Veltista_Blackcouple.png'
					alt='logo'
					fill
					className='rounded-full object-cover'
					unoptimized
				/>
			</div>
		</>
	);
}
