import { ScanOptions } from '@aws/dynamodb-data-mapper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DynamoDBDataMapperService } from '../../mapper/dynamodb-mapper.service';
import { ArtWorkService } from '../artworks/artwork.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schema/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    private readonly dynamoDBMapper: DynamoDBDataMapperService,
    private readonly artWorkService: ArtWorkService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const { artWork } = await this.artWorkService.getArtWorkById(
      createTransactionDto.artWorkId,
    );

    if (!artWork) {
      throw new BadRequestException(
        `Invalid ArtWork Id is provided : [${createTransactionDto.artWorkId}]`,
      );
    }

    const transaction = new Transaction();
    transaction.artWorkId = createTransactionDto.artWorkId;
    transaction.transactionHash = createTransactionDto.transactionHash;

    const { id } = await this.dynamoDBMapper.mapper.put(transaction);

    return {
      id,
    };
  }

  async getTransactions(limit: number, lastKey: string) {
    const params: ScanOptions = {
      limit,
      startKey: lastKey
        ? {
            id: lastKey,
          }
        : undefined,
    };

    const transactionScanner = this.dynamoDBMapper.mapper.scan(
      Transaction,
      params,
    );

    const transactions: Transaction[] = [];
    let lastTransaction: Transaction | null = null;

    for await (const transaction of transactionScanner) {
      transactions.push(transaction);
      lastTransaction = transaction;
    }

    const lastEvaluatedKey = transactions.length
      ? { id: lastTransaction.id }
      : null;

    return { count: transactions.length, transactions, lastEvaluatedKey };
  }

  async getTransaction(id: string) {
    const transactionSchema = new Transaction();
    transactionSchema.id = id;

    try {
      const transaction = await this.dynamoDBMapper.mapper.get(
        transactionSchema,
      );
      return { transaction };
    } catch (error) {
      if (error.name && error.name === 'ItemNotFoundException') {
        return {
          transaction: null,
        };
      } else {
        throw error;
      }
    }
  }
}
