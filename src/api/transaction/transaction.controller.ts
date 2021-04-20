import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  getTransactions(
    @Query('limit') limit: number,
    @Query('startKey') lastKey: string,
  ) {
    return this.transactionService.getTransactions(limit, lastKey);
  }

  @Get(':id')
  getTransaction(@Param('id') id: string) {
    return this.transactionService.getTransaction(id);
  }
}
