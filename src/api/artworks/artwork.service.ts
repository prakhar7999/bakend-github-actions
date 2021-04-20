import { BadRequestException, Injectable } from '@nestjs/common';
import { Express } from 'express';
import { v4 } from 'uuid';
import { S3Service } from '../../s3/s3.service';
import { ConfigService } from '../../config/config.service';
import { join } from 'path';
import { ArtWork } from './schema/artwork.schema';
import { DynamoDBDataMapperService } from '../../mapper/dynamodb-mapper.service';
import { ArtWorkResponse } from './interface/artwork.response';
import { CreateArtWorkDto } from './dto/create-artwork.dto';
import { ScanOptions } from '@aws/dynamodb-data-mapper';
import { UpdateArtWorkDto } from './dto/update-artwork.dto';
import { utc } from 'moment';
import urlJoin from 'url-join';
import { GraphService } from 'src/graph/graph.service';
import { TheGraphResponse } from 'src/graph/interfaces/graph.response';

@Injectable()
export class ArtWorkService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly config: ConfigService,
    private readonly dynamoDBMapper: DynamoDBDataMapperService,
    private readonly graphService: GraphService,
  ) {}
  async createArtWork(
    artWorkImage: Express.Multer.File,
    legalRightsDoc: Express.Multer.File,
    createArtWorkDto: CreateArtWorkDto,
  ) {
    const artworkKey = v4();
    const legalRightsDocKey = v4();

    await Promise.all([
      this.s3Service.putObject({
        Bucket: this.config.get('aws.s3.bucketName'),
        Key: join(this.config.get('artworkFolder'), artworkKey),
        Body: artWorkImage.buffer,
      }),

      this.s3Service.putObject({
        Bucket: this.config.get('aws.s3.bucketName'),
        Key: join(this.config.get('legalDocFolder'), legalRightsDocKey),
        Body: legalRightsDoc.buffer,
      }),
    ]);

    const artwork = new ArtWork();
    artwork.id = v4();
    artwork.artworkKey = artworkKey;
    artwork.row = createArtWorkDto.row;
    artwork.column = createArtWorkDto.column;
    artwork.artistName = createArtWorkDto.artistName;
    artwork.paintingName = createArtWorkDto.paintingName;
    artwork.year = createArtWorkDto.year;
    artwork.legalRightsDocKey = legalRightsDocKey;
    artwork.serialNumber = createArtWorkDto.serialNumber;
    artwork.movement = createArtWorkDto.movement;
    artwork.blockInformation = createArtWorkDto.blockInformation;
    artwork.status = 'DRAFT';

    await this.dynamoDBMapper.mapper.put(artwork);

    return {
      artworkId: artwork.id,
    };
  }

  async getArtWorks(lastKey: string, limit: number) {
    const params: ScanOptions = {
      limit,
      startKey: lastKey
        ? {
            id: lastKey,
          }
        : undefined,
    };

    const artWorkScanner = this.dynamoDBMapper.mapper.scan(ArtWork, params);
    const artworks: ArtWorkResponse[] = [];

    let lastArtWork: ArtWork | null = null;
    for await (const artWork of artWorkScanner) {
      //get theGraph Data - pass artwork.id in getBlocks
      const theGraphResponse = await this.graphService.getBlocks(artWork.id);
      const artWorkResponse = this.getArtWorkResponse(
        artWork,
        theGraphResponse,
      );
      artworks.push(artWorkResponse);
      lastArtWork = artWork;
    }

    const lastEvaluatedKey: {
      id: string;
    } | null = artworks.length ? { id: lastArtWork.id } : null;

    return { count: artworks.length, artworks, lastEvaluatedKey };
  }

  async getArtWork(id: string): Promise<{ artWork: ArtWorkResponse }> {
    const { artWork } = await this.getArtWorkById(id);
    if (!artWork) {
      return { artWork: null };
    }

    //get theGraph Data
    const theGraphResponse = await this.graphService.getBlocks(id);
    const artWorkResponse = this.getArtWorkResponse(artWork, theGraphResponse);
    return { artWork: artWorkResponse };
  }

  async removeArtWork(id: string) {
    const { artWork } = await this.getArtWorkById(id);
    if (!artWork) {
      throw new BadRequestException(`ArtWork with id : ${id} does not exist`);
    }

    const s3DeleteOutput = await this.s3Service.deleteObject({
      Bucket: this.config.get('aws.s3.bucketName'),
      Key: join(this.config.get('aws.s3.bucketName'), artWork.artworkKey),
    });

    return { s3DeleteOutput, artWork };
  }

  async updateArtWork(
    id: string,
    artWorkImage: Express.Multer.File,
    legalRightsDoc: Express.Multer.File,
    updateArtWorkDto: UpdateArtWorkDto,
  ) {
    const { artWork } = await this.getArtWorkById(id);

    if (!artWork) {
      throw new BadRequestException(`ArtWork with id : ${id} does not exist`);
    }

    if (artWorkImage) {
      await this.s3Service.putObject({
        Bucket: this.config.get('aws.s3.bucketName'),
        Key: join(this.config.get('artworkFolder'), artWork.artworkKey),
        Body: artWorkImage.buffer,
      });
    }

    if (legalRightsDoc) {
      await this.s3Service.putObject({
        Bucket: this.config.get('aws.s3.bucketName'),
        Key: join(this.config.get('legalDocFolder'), artWork.legalRightsDocKey),
        Body: legalRightsDoc.buffer,
      });
    }

    artWork.row = updateArtWorkDto.row ?? artWork.row;
    artWork.year = updateArtWorkDto.year ?? artWork.year;
    artWork.status = updateArtWorkDto.status ?? artWork.status;
    artWork.column = updateArtWorkDto.column ?? artWork.column;
    artWork.movement = updateArtWorkDto.movement ?? artWork.movement;
    artWork.artistName = updateArtWorkDto.artistName ?? artWork.artistName;
    artWork.paintingName =
      updateArtWorkDto.paintingName ?? artWork.paintingName;
    artWork.serialNumber =
      updateArtWorkDto.serialNumber ?? artWork.serialNumber;
    artWork.blockInformation =
      updateArtWorkDto.blockInformation ?? artWork.blockInformation;
    artWork.updatedAt = utc().toDate();

    await this.dynamoDBMapper.mapper.update(artWork);

    return {
      id,
    };
  }

  private getUrlsFromS3Keys({ artworkKey, legalRightsDocKey }) {
    const artWorkUrl = urlJoin(
      this.config.get('aws.s3.endpoint'),
      this.config.get('aws.s3.bucketName'),
      this.config.get('artworkFolder'),
      artworkKey,
      `?t=${new Date().getTime().toString()}`,
    );
    const legalRightsDocUrl = urlJoin(
      this.config.get('aws.s3.endpoint'),
      this.config.get('aws.s3.bucketName'),
      this.config.get('legalDocFolder'),
      legalRightsDocKey,
    );

    return {
      artWorkUrl,
      legalRightsDocUrl,
    };
  }

  private getArtWorkResponse(
    artWork: ArtWork,
    theGraphResponse: TheGraphResponse,
  ): ArtWorkResponse {
    const { artWorkUrl, legalRightsDocUrl } = this.getUrlsFromS3Keys(artWork);

    delete artWork.artworkKey;
    delete artWork.legalRightsDocKey;

    const artworkResponse: ArtWorkResponse = {
      ...artWork,
      artWorkUrl,
      legalRightsDocUrl,
      theGraphResponse,
    };

    return artworkResponse;
  }

  async getArtWorkById(id: string) {
    const artWorkSchema = new ArtWork();
    artWorkSchema.id = id;
    try {
      const artWork = await this.dynamoDBMapper.mapper.get(artWorkSchema);

      return { artWork };
    } catch (error) {
      if (error.name && error.name === 'ItemNotFoundException') {
        return {
          artWork: null,
        };
      } else {
        throw error;
      }
    }
  }

  // return metadata for specific block
  async getBlockById(id: string) {
    try {
      // graph data for specific id
      const graphData = await this.graphService.getBlocksById(id);

      if (!graphData.artworks.length) {
        throw new Error();
      }
      // paiting id uusing graphData
      const paintingID = graphData.artworks[0].paintingID;

      const { artWork } = await this.getArtWorkById(paintingID);

      // artwork url
      const { artWorkUrl } = this.getUrlsFromS3Keys(artWork);

      // generating metadata
      const metaData = {
        name: graphData.artworks[0].blockName,
        description: artWork.blockInformation,
        image: artWorkUrl,
        artWork,
      };
      return metaData;
    } catch (error) {
      throw new BadRequestException(`Block with id : ${id} does not exist`);
    }
  }
}
