import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateArtWorkDto } from './create-artwork.dto';

export enum ArtWorkStatus {
  DRAFT = 'DRAFT',
  PUBLISH = 'PUBLISH',
}

export class UpdateArtWorkDto extends PartialType(CreateArtWorkDto) {
  @IsEnum(ArtWorkStatus)
  status: ArtWorkStatus;
}
