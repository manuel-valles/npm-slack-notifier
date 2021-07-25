const { Kafka } = require('kafkajs');
const {
  kafka,
  app: { secret, mount, topic },
  server: { port },
} = require('../config');
const createApp = require('./app');

const client = new Kafka(kafka);
const producer = client.producer();

const main = async () => {
  await producer.connect();
  const app = createApp({ producer, secret, mount, topic });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
