import { kafka } from "./config";

const consumer = kafka.consumer({ groupId: 'monolith-consumer' });

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'ambassador_topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key.toString();
      const value = JSON.parse(message.value.toString());
      console.log({ key, value })
    },
  })
}

run().then(console.error)