import nats, { Message } from 'node-nats-streaming';

console.clear();

const stan = nats.connect('microservice-tutorial', 'listener', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscription = stan.subscribe('ticket:created');

  subscription.on('message', (msg: Message) => {
    console.log(
      `Received event #${msg.getSequence()}, with data: ${msg.getData()}`
    );
  });
});
