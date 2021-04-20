import {
  attribute,
  table,
  hashKey,
} from '@aws/dynamodb-data-mapper-annotations';

@table(process.env.USER_TABLE)
export class User {
  @hashKey()
  id: string;

  @attribute()
  firstName: string;

  @attribute()
  lastName: string;

  @attribute()
  emailId: string;

  @attribute()
  isActive: boolean;

  @attribute()
  isAdmin: boolean;
}
