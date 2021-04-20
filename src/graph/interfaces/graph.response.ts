export interface TheGraphResponse {
  artworks: [
    {
      artBlockOwner: string;
      blockName: string;
      id: string;
      paintingID: string;
    },
  ];
}
