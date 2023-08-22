import { Kafka } from 'kafkajs';
const kafka = new Kafka({
  clientId: 'ms-email',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
})

const consumer = kafka.consumer({ groupId: 'email-consumer' });

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'send-email', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        value: message.value.toString(),
      })
    },
  })
}

run().then(console.error)
// const transporter = createTransport({
//   host: 'host.docker.internal',
//   port: 1025
// });

// await transporter.sendMail({
//   from: 'from@example.com',
//   to: 'admin@admin.com',
//   subject: 'An order has been completed',
//   html: `Order #${order.id} with a total of $${order.total} has been completed`
// });

// await transporter.sendMail({
//   from: 'from@example.com',
//   to: order.ambassador_email,
//   subject: 'An order has been completed',
//   html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
// });

// await transporter.close();