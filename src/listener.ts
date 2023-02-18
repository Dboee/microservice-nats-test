import nats, { Message } from 'node-nats-streaming';

import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect(
  'microservice-tutorial',
  randomBytes(4).toString('hex'),
  {
    url: 'http://localhost:4222',
  }
);

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    // Set the manual acknowledgement mode
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('order-service');

  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    // Acknowledge the message
    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
