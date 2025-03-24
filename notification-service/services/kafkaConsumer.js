//notification-service/services/kafkaConsumer.js
const { Kafka } = require('kafkajs');
const Notification = require('../models/Notification');
const notificationService = require('./notificationService');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

// Función para conectar al broker de Kafka
const connect = async () => {
  try {
    await consumer.connect();
    console.log('Consumidor conectado a Kafka');
    
    await consumer.subscribe({ topic: 'order-events', fromBeginning: false });
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventData = JSON.parse(message.value.toString());
          console.log(`Evento recibido: ${eventData.eventType}`);
          
          // Crear notificación según el tipo de evento
          let notificationMessage = '';
          let notificationType = '';
          
          switch (eventData.eventType) {
            case 'ORDER_CREATED':
              notificationType = 'ORDER_CONFIRMATION';
              notificationMessage = `¡Tu pedido #${eventData.orderId} ha sido recibido con éxito! ` +
                `Total: $${eventData.totalAmount.toFixed(2)}. ` +
                `Te lo entregaremos en ${eventData.seatLocation} muy pronto.`;
              break;
              
            case 'ORDER_STATUS_CHANGED':
              notificationType = 'ORDER_STATUS_UPDATE';
              notificationMessage = `El estado de tu pedido #${eventData.orderId} ` +
                `ha cambiado a ${eventData.newStatus}.`;
              break;
              
            default:
              notificationType = 'ORDER_NOTIFICATION';
              notificationMessage = `Actualización de tu pedido #${eventData.orderId}.`;
              break;
          }
          
          // Guardar la notificación
          const notification = new Notification({
            userId: eventData.userId,
            type: notificationType,
            message: notificationMessage
          });
          
          const savedNotification = await notification.save();
          
          // Enviar la notificación en tiempo real
          notificationService.sendRealTimeNotification(savedNotification);
          
        } catch (error) {
          console.error('Error al procesar mensaje de Kafka:', error);
        }
      }
    });
  } catch (error) {
    console.error('Error al conectar consumidor a Kafka:', error);
  }
};

// Función para desconectar
const disconnect = async () => {
  await consumer.disconnect();
  console.log('Consumidor desconectado de Kafka');
};

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});

module.exports = { connect, disconnect };