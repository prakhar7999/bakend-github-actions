/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Express } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { ArtWorkService } from './artwork.service';
import { CreateArtWorkDto } from './dto/create-artwork.dto';
import { ArtWorkFile } from './interface/artwork.file';
import { fileFilter } from './utils/artwork.file-filter';
import { UpdateArtWorkDto } from './dto/update-artwork.dto';

@Controller('artworks')
export class ArtWorkController {
  constructor(private readonly artworkService: ArtWorkService) {}

  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'artwork', maxCount: 1 },
        { name: 'legalRightsDoc', maxCount: 1 },
      ],
      {
        fileFilter,
      },
    ),
  )
  @Post()
  @UsePipes(ValidationPipe)
  createArtWork(
    @UploadedFiles()
    uploadedFiles: ArtWorkFile,
    @Body() createArtWorkDto: CreateArtWorkDto,
  ) {
    const artWork = uploadedFiles.artwork[0];
    const legalRightsDoc = uploadedFiles.legalRightsDoc[0];

    return this.artworkService.createArtWork(
      artWork,
      legalRightsDoc,
      createArtWorkDto,
    );
  }

  @Get()
  getArtWorks(
    @Query('startKey') lastKey: string,
    @Query('limit') limit: number,
  ) {
    return this.artworkService.getArtWorks(lastKey, limit);
  }

  @Get(':id')
  getArtWorksById(@Param('id') id: string) {
    return this.artworkService.getArtWork(id);
  }

  @Get('block/:id')
  getBlockById(@Param('id') id: string) {
    return this.artworkService.getBlockById(id);
  }

  @Delete(':id')
  removeArtWork(@Param('id') id: string) {
    return this.artworkService.removeArtWork(id);
  }

  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'artwork', maxCount: 1 },
        { name: 'legalRightsDoc', maxCount: 1 },
      ],
      {
        fileFilter,
      },
    ),
  )
  @Put(':id')
  @UsePipes(ValidationPipe)
  updateArtWork(
    @Param('id') id: string,
    @UploadedFiles()
    uploadedFiles: ArtWorkFile,
    @Body() updateArtWorkDto: UpdateArtWorkDto,
  ) {
    const artWork =
      uploadedFiles.artwork && uploadedFiles.artwork.length
        ? uploadedFiles.artwork[0]
        : null;
    const legalRightsDoc =
      uploadedFiles.legalRightsDoc && uploadedFiles.legalRightsDoc.length
        ? uploadedFiles?.legalRightsDoc[0]
        : null;

    return this.artworkService.updateArtWork(
      id,
      artWork,
      legalRightsDoc,
      updateArtWorkDto,
    );
  }
}
