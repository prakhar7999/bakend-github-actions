import {
  attribute,
  table,
  hashKey,
} from '@aws/dynamodb-data-mapper-annotations';

import { utc } from 'moment';
@table(process.env.ARTWORK_TABLE)
export class ArtWork {
  @hashKey()
  id: string;

  @attribute()
  artworkKey: string;

  @attribute()
  row: number;

  @attribute()
  column: number;

  @attribute()
  artistName: string;

  @attribute()
  paintingName: string;

  @attribute()
  year: number;

  @attribute()
  legalRightsDocKey: string;

  @attribute()
  serialNumber: string;

  @attribute()
  movement: string;

  @attribute()
  blockInformation: string;

  @attribute()
  status: string;

  @attribute({ defaultProvider: () => utc().toDate() })
  createdAt: Date;

  @attribute({ defaultProvider: () => utc().toDate() })
  updatedAt: Date;
}
