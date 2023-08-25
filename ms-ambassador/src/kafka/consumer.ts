import { createConnection, getRepository } from "typeorm";
import { kafka } from "./config";
import { Subscriber } from "./subscriber";
import { KafkaError } from "../entity/kafka-error.entity";

const consumer = kafka.consumer({ groupId: 'ambassador-consumer' });

createConnection().then(async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'ambassador_topic', fromBeginning: true })
  console.log("ms ambassador consumer connected");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key.toString();
      const value = JSON.parse(message.value.toString());
      try {
        console.log({ key, value });
        await Subscriber[key](value);
      } catch (error) {
        await getRepository(KafkaError).save({
          key, value, error: error.message
        });
      }
    },
  })
})

