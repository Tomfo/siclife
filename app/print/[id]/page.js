'use client';
import { Button } from '@mui/material';
// components/PDFExport.js
import { useRef } from 'react';
import { usePDF } from 'react-to-pdf';

export default function PDFExport() {
	//const targetRef = useRef();

	const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

	return (
		<div>
			<Button onClick={() => toPDF()}>Download PDF</Button>

			<div ref={targetRef}>
				<h1>Hello, this is a PDF example</h1>
				<p>This content will be converted to PDF</p>
				<ul>
					<li>Item 1</li>
					<li>Item 2</li>
					<li>Item 3</li>
				</ul>
			</div>
		</div>
	);
}
