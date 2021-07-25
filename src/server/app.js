const createHookReceiver = require('npm-hook-receiver');

module.exports = ({ producer, secret, mount, topic }) => {
  const server = createHookReceiver({
    secret: secret,
    mount: mount,
  });

  server.on(
    'package:publish',
    async ({ name: package, version, time: timestamp }) => {
      console.log('Received webhook event', {
        package,
        version,
        timestamp,
      });

      try {
        await producer.send({
          topic: topic,
          messages: [
            {
              // Name of the published package as key
              key: package,
              // The message value is just bytes to Kafka, so we need to serialize the JS Object to JSON string
              // Other serialization methods like Avro are available.
              value: JSON.stringify({
                package,
                version,
                timestamp,
              }),
            },
          ],
        });
      } catch (error) {
        console.error(`Failed to publish webhook message`, error);
      }
    }
  );

  return server;
};
