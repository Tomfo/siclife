'use client';
import { Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
export default function NotFound() {
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
          <circle cx='32' cy='32' r='32' fill='#b30000' />
          <text
            x='32'
            y='42'
            textAnchor='middle'
            fill='#fff'
            fontSize='32'
            fontWeight='bold'
            fontFamily='Arial, Helvetica, sans-serif'
          >
            404
          </text>
        </svg>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.message}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Button href={`/`} variant='contained' color='primary'>
          <HomeIcon />
          Go Home
        </Button>
      </div>
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
    display: 'block',
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
    background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
    color: '#fff',
    padding: '12px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(99,102,241,0.15)',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
};
