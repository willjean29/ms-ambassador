import { createConnection } from "typeorm";
import { kafka } from "./config";
import { Subscriber } from "./subscriber";

const consumer = kafka.consumer({ groupId: 'monolith-consumer' });

const run = async () => {
  await createConnection()
  await consumer.connect()
  await consumer.subscribe({ topic: 'ambassador_topic', fromBeginning: true })
  const subscriber = new Subscriber()
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key.toString();
      const value = JSON.parse(message.value.toString());
      console.log({ key, value })
      await subscriber[key](value);
    },
  })
}

run().then(console.error)