import { createConnection } from "typeorm";
import { kafka } from "./config";
import { Subscriber } from "./subscriber";

const consumer = kafka.consumer({ groupId: 'ambassador-consumer' });

createConnection().then(async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'admin_topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key.toString();
      const value = JSON.parse(message.value.toString());
      console.log({ key, value })
      await Subscriber[key](value);
    },
  })
})

