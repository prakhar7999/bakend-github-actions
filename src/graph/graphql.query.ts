import { gql } from 'graphql-request';

export const allBlocksQuery = gql`
  query {
    artworks {
      id
      artBlockOwner
      paintingID
      blockName
    }
  }
`;

export const blockByIdQuery = gql`
  query getBlockById($blockId: String!) {
    artworks(where: { id: $blockId }) {
      id
      artBlockOwner
      paintingID
      blockName
    }
  }
`;

export const blocksQuery = gql`
  query getArtworks($artworkId: String!) {
    artworks(where: { paintingID: $artworkId }) {
      id
      artBlockOwner
      paintingID
      blockName
    }
  }
`;

export const blockQuery = gql`
  query getArtwork($artworkId: String!, $blockName: String!) {
    artworks(where: { paintingID: $artworkId, blockName: $blockName }) {
      id
      paintingID
      blockName
      artBlockOwner
    }
  }
`;
