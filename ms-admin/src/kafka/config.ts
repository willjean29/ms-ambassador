import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ms-admin',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
})

export const producer = kafka.producer()