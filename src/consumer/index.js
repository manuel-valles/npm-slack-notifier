const { Kafka } = require('kafkajs');
const { IncomingWebhook } = require('@slack/webhook');
const {
  kafka,
  consumer: config_consumer,
  app: { topic },
  slack: { webhookUrl },
} = require('../config');
const createConsumer = require('./consumer');

const client = new Kafka(kafka);
const slack = new IncomingWebhook(webhookUrl);

const main = async () => {
  const consumer = await createConsumer({
    client,
    config_consumer,
    topic,
    slack,
  });

  const shutdown = async () => {
    await consumer.disconnect();
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
