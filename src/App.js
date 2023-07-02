import React, { useEffect, useState } from 'react';
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
import { gql, useQuery } from '@apollo/client';


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


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
export default function App() {
  const baseURL = "https://gateway.pinata.cloud/ipfs/QmcDZbSmnc5DFuQSYgiGwZSAKqxJoFNqPexLR7SRUsvsd5/";
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
  
  
  function fetchImages() {
    const imageUrls = [];

    for (let i = 1; i <= createdNFTs.length; i++) {
      const imageUrl = `${baseURL}${i}.jpg`;
      imageUrls.push(imageUrl);

    }

    return imageUrls;
  }
  
  function renderNFTCards() {
    const imageUrls = fetchImages();
    const nftArray = toArrayAndSort();
    return nftArray.map((nft, index) => (
      <Grid item key={nft.id} xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardMedia
            component="div"
            sx={{
              // 16:9
              pt: '56.25%',
            }}
            key={nft.id}
            image={imageUrls[index]}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              NFT #{nft.tokenId}
            </Typography>
          </CardContent>
         
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
             Collection NFT
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
             The topics of this collection is about the forest 
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {isWalletConnected && (renderNFTCards())}
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

  function toArrayAndSort() {
    const nftArray = Array.from(createdNFTs);
    nftArray.sort((a, b) => a.tokenId - b.tokenId);
    return nftArray;
  }
}