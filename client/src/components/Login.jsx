import { Button, IconButton, Card, CardHeader, CardContent, Avatar, Drawer, TextField, Box, Snackbar, Alert, Typography, List, ListItem, ListItemAvatar, ListItemText, Grid } from '@mui/material';
import { Add as AddIcon, Inbox as InboxIcon, Send as SendIcon, Delete as DeleteIcon, Archive as ArchiveIcon, Mail as MailIcon, ChromeReaderMode as ChromeIcon, Cached as CombineIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [mail, setMail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sentEmails, setSentEmails] = useState([]);
  const navigate=useNavigate()

  const handleLogout = () => {
    fetch('http://localhost:5173/', {
      method: 'GET',
      credentials: 'include' 
    })
    .then(response => {
      window.location.href = '/'; 
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
  };

  useEffect(() => {
    axios.get('http://localhost:3001/communication-details')
      .then(response => {
        console.log('Fetched Emails:', response.data);
        setSentEmails(response.data);
      })
      .catch(error => {
        console.error('Error fetching sent emails:', error);
      });
  }, []);
  
  const handleSendMail = (e) => {
    e.preventDefault();
    if (!mail || !subject || !body) {
      setSnackbarMessage('Please fill out all fields.');
      setOpenSnackbar(true);
      return;
    }
  
    axios.post('http://localhost:3001/send-email', {
      to: mail,
      subject,
      body
    })
    .then(response => {
      console.log('Sent Email:', response.data);
      setSnackbarMessage('Email sent successfully.');
      setSentEmails(prev => [response.data, ...prev]); 
    })
    .catch(error => {
      setSnackbarMessage('Failed to send email.');
      console.error('Error sending email:', error);
    })
    .finally(() => {
      setMail('');
      setSubject('');
      setBody('');
      setDrawerOpen(false);
      setOpenSnackbar(true);
    });
  };
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handeltemplate=()=>{
    navigate('/template')
  }

  console.log(sentEmails, )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#1f2939', color: '#f9fafb', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 5 }}>
        <Link to="#" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MailIcon style={{ width: '24px', height: '24px', color: 'white' }} />
          <span style={{ fontSize: '18px', fontWeight: '500', textDecoration: 'none', color: 'white' }}>Gmail</span>
        </Link>
        <Button variant="outlined" onClick={handleLogout} startIcon={<ChromeIcon style={{ width: '20px', height: '20px', color: 'white' }} />}>
          <div style={{ color: 'white' }}>Sign Out</div>
        </Button>
      </header>
      <main style={{ flex: '1', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', padding: '24px' }}>
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Mailbox</h3>
            <IconButton size="small">
              <CombineIcon onClick={() => window.location.reload(true)} style={{ width: '20px', height: '20px' }} />
            </IconButton>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button startIcon={<InboxIcon style={{ width: '20px', height: '20px' }} />} fullWidth>
              Inbox
            </Button>
            <Button onClick={handeltemplate} startIcon={<InboxIcon style={{ width: '20px', height: '20px' }} />} fullWidth>
              Template
            </Button>
          </nav>
        </div>
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Communication History</h3>
            <IconButton size="small">
              <CombineIcon onClick={() => window.location.reload(true)} style={{ width: '20px', height: '20px' }} />
            </IconButton>
          </div>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sentEmails?.map((email, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: '16px' }}>
          <CardHeader
            avatar={<Avatar alt={email.To[0].Email} src="/placeholder-user.jpg" />}
            title={email.Subject}
            subheader={email.To[0].Email}
            action={<Typography variant="body2" color="textSecondary">{new Date(email.ReceivedAt).toLocaleString()}</Typography>}
          />
          <CardContent>
            <Typography variant="body1" style={{ fontWeight: '500', marginBottom: '8px' }}>
              {email.Subject}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="div" style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {email.TextBody}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
        </div>
      </main>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box component='form' onSubmit={handleSendMail} sx={{ width: 350, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField label="To" type="email" placeholder="Enter email address" fullWidth value={mail} onChange={(e) => setMail(e.target.value)} />
          <TextField label="Subject" placeholder="Enter subject" fullWidth value={subject} onChange={(e) => setSubject(e.target.value)} />
          <TextField label="Body" placeholder="Enter email body" multiline rows={4} fullWidth value={body} onChange={(e) => setBody(e.target.value)} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="outlined" type="submit">SEND MAIL</Button>
            <Button variant="outlined" onClick={() => setDrawerOpen(false)}>CANCEL</Button>
          </Box>
        </Box>
      </Drawer>

      <IconButton onClick={() => setDrawerOpen(true)} style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1976d2', color: '#fff' }}>
        <AddIcon style={{ width: '24px', height: '24px' }} />
      </IconButton>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage === 'Email sent successfully.' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
