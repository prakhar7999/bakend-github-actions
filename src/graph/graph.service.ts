import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { ConfigService } from '../config/config.service';
import {
  allBlocksQuery,
  blockQuery,
  blocksQuery,
  blockByIdQuery,
} from './graphql.query';
import { TheGraphResponse } from './interfaces/graph.response';

@Injectable()
export class GraphService {
  private graphQLClient: GraphQLClient;
  constructor(private readonly config: ConfigService) {
    this.graphQLClient = new GraphQLClient(config.get('theGraphUrl'));
  }

  getBlocks(artworkId: string): Promise<TheGraphResponse> {
    return this.graphQLClient.request(blocksQuery, { artworkId });
  }

  getBlocksById(blockId: string): Promise<TheGraphResponse> {
    return this.graphQLClient.request(blockByIdQuery, { blockId });
  }

  getBlock(artworkId: string, blockName: string): Promise<TheGraphResponse> {
    return this.graphQLClient.request(blockQuery, { artworkId, blockName });
  }

  getAllBlocks(): Promise<TheGraphResponse> {
    return this.graphQLClient.request(allBlocksQuery);
  }
}
