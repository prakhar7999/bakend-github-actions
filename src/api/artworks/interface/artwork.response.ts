import { TheGraphResponse } from 'src/graph/interfaces/graph.response';

export interface ArtWorkResponse {
  id: string;
  row: number;
  column: number;
  artistName: string;
  paintingName: string;
  year: number;
  serialNumber: string;
  movement: string;
  blockInformation: string;
  status: string;
  artWorkUrl: string;
  legalRightsDocUrl: string;
  theGraphResponse: TheGraphResponse;
}
