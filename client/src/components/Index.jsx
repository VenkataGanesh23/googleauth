import { Box, Card, CardContent, CardHeader, IconButton, Typography, Button } from '@mui/material';
import { Close as CloseIcon, Google as GoogleIcon } from '@mui/icons-material';
import google from '../assets/google.jpg';

export default function Index() {
  const handleClick = async () => {
    try {
      window.location.href = "http://localhost:3001/auth/google";
      callBacks()
    } catch (error) {
      console.error("Error authenticating with Google:", error);
    }
  };
  const callBacks=()=>{
    fetch('http://localhost:3001/auth/google/callback')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error=>{
        console.error('Error:', error);
    })
  }
    
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={4}
      md={{ px: 6 }}
      sx={{ background: 'linear-gradient(to right, #d6e7ed, #d6f0fa)' }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
        <Box position="relative">
          <img
            src={google}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <CardHeader
            sx={{
              position: 'relative',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              py: 3,
              px: 4,
            }}
            title={
              <Typography variant="h5" fontWeight="bold">
                Welcome back!
              </Typography>
            }
            action={
              <IconButton edge="end" color="inherit">
                <CloseIcon />
              </IconButton>
            }
            subheader={
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Sign in to your account using your Google account.
              </Typography>
            }
          />
        </Box>
        <CardContent sx={{ p: 4 }}>
          <Button
            onClick={handleClick}
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              color: 'text.primary',
              borderColor: 'divider',
              backgroundColor: 'background.default',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
