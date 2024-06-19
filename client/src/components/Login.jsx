import { Button, IconButton, Card, CardHeader, CardContent, Avatar, Drawer, TextField, Box, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, Inbox as InboxIcon, Send as SendIcon, Delete as DeleteIcon, Archive as ArchiveIcon, Mail as MailIcon, ChromeReaderMode as ChromeIcon, Cached as CombineIcon } from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [mail, setMail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSendMail = (e) => {
    e.preventDefault();
    if (!mail || !subject || !body) {
      setSnackbarMessage('Please fill out all fields.');
      setOpenSnackbar(true);
      return;
    }
    // Implement email sending logic here...
    console.log('Sending email:', { mail, subject, body });
    setMail('');
    setSubject('');
    setBody('');
    setDrawerOpen(false);
    setSnackbarMessage('Email sent successfully.');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#1f2939', color: '#f9fafb', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 5 }}>
        <Link to="#" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MailIcon style={{ width: '24px', height: '24px', color: 'white' }} />
          <span style={{ fontSize: '18px', fontWeight: '500', textDecoration: 'none', color: 'white' }}>Gmail</span>
        </Link>
        <Button variant="outlined" startIcon={<ChromeIcon style={{ width: '20px', height: '20px', color: 'white' }} />}>
          <div style={{ color: 'white' }}>Sign in with Google</div>
        </Button>
      </header>
      <main style={{ flex: '1', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', padding: '24px' }}>
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Mailbox</h3>
            <IconButton size="small">
              <CombineIcon style={{ width: '20px', height: '20px' }} />
            </IconButton>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button startIcon={<InboxIcon style={{ width: '20px', height: '20px' }} />} fullWidth>
              Inbox
            </Button>
            <Button startIcon={<SendIcon style={{ width: '20px', height: '20px' }} />} fullWidth>
              Sent
            </Button>
            <Button startIcon={<DeleteIcon style={{ width: '20px', height: '20px' }} />} fullWidth>
              Trash
            </Button>
            <Button startIcon={<ArchiveIcon style={{ width: '20px', height: '20px' }} />} fullWidth>
              Archived
            </Button>
          </nav>
        </div>
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Communication History</h3>
            <IconButton size="small">
              <CombineIcon style={{ width: '20px', height: '20px' }} />
            </IconButton>
          </div>
          <Box sx={{ maxHeight: '500px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Jared Palmer', 'Olivia Davis', 'Sarah Adams'].map((name, index) => (
              <Card key={index} variant="outlined">
                <CardHeader
                  avatar={
                    <Avatar alt={name} src="/placeholder-user.jpg">
                    </Avatar>
                  }
                  title={name}
                  subheader={`${name.toLowerCase().split(' ').join('')}@gmail.com`}
                  action={
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>{['Apr 12, 2023', 'Apr 10, 2023', 'Apr 8, 2023'][index]}</span>
                  }
                />
                <CardContent>
                  <div style={{ fontWeight: '500' }}>{['Project Update', 'Budget Meeting', 'Quarterly Review'][index]}</div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {[
                      'Hi team, I wanted to provide an update on the project progress. We\'ve completed the initial design phase and are now moving into development. Let me know if you have any questions.',
                      'Hi everyone, let\'s schedule a meeting to discuss the project budget. I have some ideas I\'d like to share. Let me know what works best for you.',
                      'Hi team, I\'d like to schedule a quarterly review meeting to discuss our progress and set goals for the next quarter. Please let me know your availability.'
                    ][index]}
                  </p>
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
            <Button variant="outlined" onClick={handleSendMail}>SEND MAIL</Button>
            <Button variant="outlined" onClick={() => setDrawerOpen(false)}>CANCEL</Button>
          </Box>
        </Box>
      </Drawer>
      <IconButton onClick={() => setDrawerOpen(true)} style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1976d2', color: '#fff' }}>
        <AddIcon style={{ width: '24px', height: '24px' }} />
      </IconButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
