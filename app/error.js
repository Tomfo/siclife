'use client';

import { useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function Error({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  useEffect(() => {
    console.log(err);
  }, [err]);
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <svg
          width='64'
          height='64'
          viewBox='0 0 64 64'
          fill='none'
          style={styles.icon}
        >
          <circle cx='32' cy='32' r='32' fill='#FF5252' />
          <path
            d='M22 22L42 42M42 22L22 42'
            stroke='#fff'
            strokeWidth='4'
            strokeLinecap='round'
          />
        </svg>
        <h1 style={styles.title}>
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p style={styles.message}>
          {statusCode === 404
            ? 'Sorry, the page you are looking for could not be found.'
            : 'Oops! Something went wrong. Please try refreshing the page or go back to the homepage.'}
        </p>
        <Button href={`/`} variant='contained' color='primary'>
          <HomeIcon />
          Go Home
        </Button>
      </div>
      <style jsx>{`
        body {
          background: #f5f6fa;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f6fa 0%, #e0e3eb 100%)',
  },
  card: {
    background: '#fff',
    padding: '40px 32px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(60, 60, 100, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '350px',
    width: '90vw',
  },
  icon: {
    marginBottom: '16px',
    filter: 'drop-shadow(0 4px 12px rgba(255,82,82,0.2))',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '2rem',
    color: '#2d3436',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  message: {
    margin: '0 0 24px',
    fontSize: '1rem',
    color: '#636e72',
    textAlign: 'center',
  },
  button: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #ff7675 0%, #fd79a8 100%)',
    color: '#fff',
    padding: '12px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(255,118,117,0.15)',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
};
