//order-service/services/kafkaProducer.js
const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

const producer = kafka.producer();

// Conectar al iniciar
const connect = async () => {
  try {
    await producer.connect();
    console.log('Conectado al broker de Kafka');
  } catch (error) {
    console.error('Error al conectar a Kafka:', error);
  }
};

// Desconectar al salir
const disconnect = async () => {
  await producer.disconnect();
  console.log('Desconectado de Kafka');
};

// Enviar mensaje a un topic
const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
    console.log(`Mensaje enviado al topic ${topic}`);
  } catch (error) {
    console.error(`Error al enviar mensaje a Kafka (${topic}):`, error);
  }
};

// Iniciar la conexión
connect();

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});

module.exports = { sendMessage };