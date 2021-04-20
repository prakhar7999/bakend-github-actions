import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamoDBDataMapperService } from './../mapper/dynamodb-mapper.service';
import { ConfigService } from './../config/config.service';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly dynamoDBMapper: DynamoDBDataMapperService,
    private readonly config: ConfigService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.id = v4();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.emailId = createUserDto.emailId;
    user.isActive = createUserDto.isActive;
    user.isAdmin = createUserDto.isAdmin;

    return this.dynamoDBMapper.mapper.put(user);
  }

  findAll() {
    return this.dynamoDBMapper.mapper.get({
      TableName: this.config.get('dynamodb.tables.user'),
      Item: {},
    });
  }

  findOne(id: string) {
    return this.dynamoDBMapper.mapper.get({
      TableName: this.config.get('dynamodb.tables.user'),
      Item: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.dynamoDBMapper.mapper.delete({
      TableName: this.config.get('dynamodb.tables.user'),
      Item: {
        id,
      },
    });
  }
}
