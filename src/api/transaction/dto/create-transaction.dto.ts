import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  artWorkId: string;

  @IsNotEmpty()
  transactionHash: string;
}
