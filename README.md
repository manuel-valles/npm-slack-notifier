# Npm Slack Notifier

An App to receive NPM webhook events, send them to Kafka and post them to a Slack channel.

- Sending messages using Incoming Webhooks in [Slack](https://api.slack.com/messaging/webhooks) with the following setup:
  1. Create a Slack app ![Slack App](fixtures/CreateApp.png)
  2. Enable incoming webhooks ![Enable Incoming Webhooks](fixtures/ActivateIncomingWebhooks.png)
  3. Create an incoming webhook ![Create Incoming Webhooks](fixtures/CreateIncomingWebhook.png)
