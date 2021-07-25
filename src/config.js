const {
  KAFKA_USERNAME: username,
  KAFKA_PASSWORD: password,
  KAFKA_SSL: ssl,
  BOOTSTRAP_BROKER: broker = 'localhost:9092',
  PORT: port = 3000,
  KAFKA_GROUP_ID: groupId = 'npm-slack-notifier',
  HOOK_SECRET: secret,
  TOPIC: topic = 'npm-package-published',
} = process.env;

const server = { port };

// This creates a client instance to connect to the Kafka broker
// by the environment variable BOOTSTRAP_SERVER
const kafka = {
  clientId: 'npm-slack-notifier',
  brokers: [broker],
  ssl: ssl ? JSON.parse(ssl) : false,
  sasl: username && password && { username, password, mechanism: 'plain' },
};

const consumer = { groupId };

const app = { secret, topic, mount: '/hook' };

const processor = { topic };

module.exports = {
  server,
  kafka,
  consumer,
  app,
  processor,
};
