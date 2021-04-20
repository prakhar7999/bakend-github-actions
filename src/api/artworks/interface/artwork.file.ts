import { Express } from 'express';
export interface ArtWorkFile {
  artwork: Array<Express.Multer.File>;
  legalRightsDoc: Array<Express.Multer.File>;
}
