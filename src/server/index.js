const { Kafka } = require('kafkajs');
const createApp = require('./app');
const {
  kafka,
  app: { secret, mount, topic },
  server: { port },
} = require('../config');

const client = new Kafka(kafka);
const producer = client.producer();

const main = async () => {
  await producer.connect();
  const app = createApp({ producer, secret, mount, topic });

  const server = app.listen(port, (error) => {
    if (error) throw error;

    console.log(`Server listening on port ${port}`);
  });

  const shutdown = async () => {
    await server.close();
    await producer.disconnect();
  };

  return shutdown;
};

const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

main()
  .then(async (shutdown) => {
    signalTraps.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`Received ${signal} signal. Shutting down.`);
        try {
          await shutdown();
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown', error);
          process.exit(1);
        }
      });
    });
  })
  .catch((error) => {
    console.error('Error during startup', error);
    process.exit(1);
  });
