'use client';
import Image from 'next/image';
export default function LandingPage() {
	return (
		<>
			<Image
				src='/Veltista_Blackcouple.png'
				alt='logo'
				width={500}
				height={500}
				className='rounded-full'
				style={{ width: 500, height: 500 }}
				unoptimized
			/>
		</>
	);
}
