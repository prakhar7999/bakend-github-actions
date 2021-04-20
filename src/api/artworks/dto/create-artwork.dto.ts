import { IsNotEmpty } from 'class-validator';

export class CreateArtWorkDto {
  @IsNotEmpty()
  row: number;

  @IsNotEmpty()
  column: number;

  @IsNotEmpty()
  artistName: string;

  @IsNotEmpty()
  paintingName: string;

  @IsNotEmpty()
  year: number;

  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  movement: string;

  @IsNotEmpty()
  blockInformation: string;
}
