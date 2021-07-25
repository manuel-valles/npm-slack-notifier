const { Kafka } = require('kafkajs');
const {
  kafka,
  app: { secret, topic },
  server: { port },
} = require('../config');
const createHookReceiver = require('npm-hook-receiver');

const client = new Kafka(kafka);
const producer = client.producer();

const main = async () => {
  await producer.connect();
  const server = createHookReceiver({
    // Secret created when registering the webhook with NPM (Used to validate the payload)
    secret,

    // Path for the handler to be mounted on.
    mount: '/hook',
  });

  server.on('package:publish', async ({ name, version }) => {
    // Send message to Kafka
    try {
      const responses = await producer.send({
        topic,
        messages: [
          {
            // Name of the published package as key
            key: name,

            // The message value is just bytes to Kafka, so we need to serialize the JS Object to JSON string
            // Other serialization methods like Avro are available.
            value: JSON.stringify({
              package: name,
              version: version,
            }),
          },
        ],
      });

      console.log('Published message', { responses });
    } catch (error) {
      console.error('Error publishing message', error);
    }
  });

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
