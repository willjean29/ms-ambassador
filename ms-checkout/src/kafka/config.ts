import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'ms-checkout',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
})

export const producer = kafka.producer()