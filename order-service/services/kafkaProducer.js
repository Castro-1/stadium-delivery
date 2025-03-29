const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:29092'], // Cambiar a 29092
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer();

// Configurar Kafka y crear el tema si no existe
const setupKafka = async () => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    
    const topics = await admin.listTopics();
    if (!topics.includes('order-events')) {
      await admin.createTopics({
        topics: [{
          topic: 'order-events',
          numPartitions: 1,
          replicationFactor: 1
        }],
        waitForLeaders: true
      });
      console.log('Tema order-events creado');
    } else {
      console.log('El tema order-events ya existe');
    }
    await admin.disconnect();
  } catch (error) {
    console.error('Error configurando Kafka:', error);
  }
};

// Conectar al iniciar
const connect = async () => {
  try {
    await producer.connect();
    console.log('Conectado al broker de Kafka');
    await setupKafka();
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