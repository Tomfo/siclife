'use client';
import Image from 'next/image';
export default function LandingPage() {
	return (
		<>
			{/* <Image
				src='/sic.png'
				alt='Logo'
				width={600}
				height={600}
				className='rounded-full'
				style={{ width: 600, height: 600 }}
				unoptimized
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
		</>
	);
}
