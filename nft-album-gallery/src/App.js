import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Web3 from 'web3';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';


const GET_DATA = gql`
  query GetData {
    approvals {
      id
      owner
      approved
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
    approvalForAlls {
      id
      owner
      operator
      approved
      blockNumber
      blockTimestamp
      transactionHash
    }
    batchMetadataUpdates {
      id
      _fromTokenId
      _toTokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
    createdNFTs {
      id
      tokenId
      tokenURI
      blockNumber
      blockTimestamp
      transactionHash
    }
   
    metadataUpdates {
      id
      _tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
    transfers {
      id
      from
      to
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function App() {
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState('');
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const {
    approvals,
    approvalForAlls,
    batchMetadataUpdates,
    createdNFTs,
    metadataUpdates,
    transfers,
  } = data;

  async function connectWallet() {

    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request access to the user's MetaMask accounts
        await window.ethereum.enable();

        // Create a Web3 instance
        const web3 = new Web3(window.ethereum);

        // You can now use the `web3` instance to interact with the blockchain

        // Example: Get the connected account
        const accounts = await web3.eth.getAccounts();
        const connectedAccount = accounts[0];

        await setWalletConnected(true);
        await setConnectedAccount(connectedAccount);
        console.log('Connected account:', connectedAccount);
        debugger;
        renderNFTCards();
        
      } catch (error) {
        console.error('Error connecting with MetaMask:', error);
      }
    } else {
      console.error('MetaMask not detected. Please install MetaMask to connect your wallet.');
    }
  }

  function handleConnectWallet() {
    if (isWalletConnected) {
      setWalletConnected(false);
      setConnectedAccount('');
    } else {
      connectWallet();
    }
  }
  
  function renderNFTCards() {
    return createdNFTs.map((nft) => (
      <Grid item key={nft.id} xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardMedia
            component="div"
            sx={{
              // 16:9
              pt: '56.25%',
            }}
            image={nft.tokenURI}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              NFT #{nft.tokenId}
            </Typography>
            <Typography>{nft.tokenURI}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View</Button>
            <Button size="small">Edit</Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          {/* <CameraIcon sx={{ mr: 2 }} /> */}
          <Typography variant="h6" color="inherit" noWrap>
            <Button variant="contained" onClick={handleConnectWallet} style={{ backgroundColor: isWalletConnected ? 'green' : 'inherit' }}>
              {isWalletConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
          </Typography>
          {isWalletConnected && (
            <Typography variant="body1" style={{ color: 'white', marginLeft: 'auto' }}>
              Connected Account: {connectedAccount}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {/* {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the
                      content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))} */}
            {renderNFTCards()}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}