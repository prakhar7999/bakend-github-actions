import convict from 'convict';
const schema = {
  app: {
    name: {
      doc: 'Name of the service',
      format: String,
      default: 'artblocks',
    },
    base_url: {
      doc: 'Base URL of platform',
      format: String,
      default: '',
      env: 'BASE_URL',
    },
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  aws: {
    region: {
      doc: 'AWS Region',
      format: String,
      default: 'local',
      env: 'REGION',
    },
    accessKeyId: {
      doc: 'Access Key Id',
      format: String,
      default: 'S3RVER',
      env: 'ACCESS_KEY_ID',
    },
    secretAccessKey: {
      doc: 'Secret Access Key',
      format: String,
      default: 'S3RVER',
      env: 'SECRET_ACCESS_KEY',
    },
    s3: {
      bucketName: {
        doc: 'Bucket Name',
        format: String,
        default: 'local_bucket',
        env: 'BUCKET_NAME',
      },
      endpoint: {
        doc: 'S3 Endpoint',
        format: String,
        default: 'http://localhost:4569',
        sensitive: true,
        env: 'S3_URL',
      },
    },
  },
  dynamodb: {
    region: {
      doc: 'Database Name',
      format: String,
      default: 'local',
      sensitive: true,
      env: 'DYNAMODB_REGION',
    },
    tables: {
      user: {
        doc: 'User Table',
        format: String,
        default: 'artblocks-backend-dev-User',
        env: 'USER_TABLE',
      },
      artWork: {
        doc: 'User Table',
        format: String,
        default: 'artblocks-backend-dev-ArtWork',
        env: 'ARTWORK_TABLE',
      },
      transaction: {
        doc: 'Transaction Table',
        format: String,
        default: 'artblocks-backend-dev-Transaction',
        env: 'TRANSACTION_TABLE',
      },
    },
    endpoint: {
      doc: 'Database Endpoint',
      format: String,
      default: 'http://localhost:8000', //offline deployment
      sensitive: true,
      env: 'DYNAMODB_URL',
    },
  },
  artworkFolder: {
    doc: 'Painting Folder',
    format: String,
    default: 'artworks',
    env: 'ARTWORK_FOLDER',
  },
  legalDocFolder: {
    doc: 'Legal Document Folder',
    format: String,
    default: 'legal_docs',
    env: 'LEGAL_DOC_FOLDER',
  },
  theGraphUrl: {
    doc: 'The Graph Service Graphql Url',
    format: String,
    default: '',
    env: 'GRAPH_URL',
  },
};

const config = convict(schema);
type Config = Record<keyof typeof schema, any>;
config.validate({ allowed: 'strict' });
export { config, Config };
