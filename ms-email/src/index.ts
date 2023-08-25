import { Kafka } from 'kafkajs';
import { createTransport } from 'nodemailer';
const kafka = new Kafka({
  clientId: 'ms-email',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
})

const consumer = kafka.consumer({ groupId: 'email-consumer' });

const transporter = createTransport({
  host: 'host.docker.internal',
  port: 1025
});

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'email_topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      await transporter.sendMail({
        from: 'from@example.com',
        to: 'admin@admin.com',
        subject: 'An order has been completed',
        html: `Order #${order.id} with a total of $${order.total} has been completed`
      });

      await transporter.sendMail({
        from: 'from@example.com',
        to: order.ambassador_email,
        subject: 'An order has been completed',
        html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
      });

      await transporter.close();
    },
  })
}

run().then(console.error);
