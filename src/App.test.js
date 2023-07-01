import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from './App';

const mocks = [
  // Add your mocked Apollo Client responses here
];
const GET_DATA=[]
describe('App', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );

    const loadingElement = screen.getByText('Loading...');
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders error state when there is an error', async () => {
    const errorMessage = 'Error fetching data';
    const errorMock = {
      request: { query: GET_DATA },
      error: new Error(errorMessage),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <App />
      </MockedProvider>
    );

    const errorElement = await screen.findByText(`Error: ${errorMessage}`);
    expect(errorElement).toBeInTheDocument();
  });

  it('renders NFT cards when data is available', async () => {
    const dataMock = {
      request: { query: GET_DATA },
      result: {
        data: {
          approvals: [],
          approvalForAlls: [],
          batchMetadataUpdates: [],
          createdNFTs: [
            { id: '1', tokenId: '123', tokenURI: 'https://example.com/nft/1', blockNumber: 1, blockTimestamp: 123456, transactionHash: '0x123' },
            { id: '2', tokenId: '456', tokenURI: 'https://example.com/nft/2', blockNumber: 2, blockTimestamp: 123457, transactionHash: '0x456' },
          ],
          metadataUpdates: [],
          transfers: [],
        },
      },
    };

    render(
      <MockedProvider mocks={[dataMock]} addTypename={false}>
        <App />
      </MockedProvider>
    );

    const nftCard1 = await screen.findByText('NFT # 123');
    const nftCard2 = await screen.findByText('NFT # 456');
    expect(nftCard1).toBeInTheDocument();
    expect(nftCard2).toBeInTheDocument();
  });
});