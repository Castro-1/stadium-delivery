const { Kafka } = require('kafkajs');
const axios = require('axios');
const Notification = require('../models/Notification');
const notificationService = require('./notificationService');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  },
  connectionTimeout: 5000
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

// Función para conectar al broker de Kafka
const connect = async () => {
  try {
    await consumer.connect();
    console.log('Consumidor conectado a Kafka');
    
    try {
      const admin = kafka.admin();
      await admin.connect();
      
      await admin.fetchTopicMetadata({ topics: [] });
      console.log('Conexión con broker de Kafka verificada');
      
      try {
        const existingTopics = await admin.listTopics();
        console.log('Temas existentes:', existingTopics);
        
        if (!existingTopics.includes('order-events')) {
          console.log('Creando tema order-events...');
          await admin.createTopics({
            topics: [{
              topic: 'order-events',
              numPartitions: 1,
              replicationFactor: 1
            }],
            waitForLeaders: true
          });
          console.log('Tema order-events creado exitosamente');
        } else {
          console.log('El tema order-events ya existe');
        }
      } catch (topicError) {
        console.error('Error al verificar o crear tema:', topicError);
      }
      
      await admin.disconnect();
    } catch (adminError) {
      console.error('Error al administrar temas de Kafka:', adminError);
    }
    
    await consumer.subscribe({ topic: 'order-events', fromBeginning: false });
    console.log('Suscripción al tema order-events completada');
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventData = JSON.parse(message.value.toString());
          console.log(`Evento recibido: ${eventData.eventType}`);
          
          // Crear notificación según el tipo de evento
          let notification;
          
          switch (eventData.eventType) {
            case 'ORDER_CREATED':
              // Crear notificación de confirmación
              notification = new Notification({
                userId: eventData.userId,
                type: 'ORDER_CONFIRMATION',
                message: `¡Tu pedido #${eventData.orderId} ha sido recibido con éxito! ` +
                  `Total: $${eventData.totalAmount.toFixed(2)}. ` +
                  `Te lo entregaremos en ${eventData.seatLocation} muy pronto.`,
                orderId: eventData.orderId
              });
              
              await notification.save();
              
              // Actualizar estado a "PROCESSING" después de crear el pedido
              try {
                const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:8082';
                await axios.put(`${orderServiceUrl}/api/orders/${eventData.orderId}/status`, {
                  status: 'PROCESSING'
                });
                
                // Guardar notificación de cambio de estado
                await notificationService.saveStatusNotification(
                  eventData.orderId,
                  eventData.userId,
                  'PROCESSING'
                );
              } catch (error) {
                console.error(`Error al actualizar el estado del pedido #${eventData.orderId}:`, error.message);
              }
              break;
              
            case 'ORDER_STATUS_CHANGED':
              // Guardar notificación de cambio de estado
              await notificationService.saveStatusNotification(
                eventData.orderId,
                eventData.userId,
                eventData.newStatus
              );
              break;
              
            default:
              notification = new Notification({
                userId: eventData.userId,
                type: 'ORDER_NOTIFICATION',
                message: `Actualización de tu pedido #${eventData.orderId}.`,
                orderId: eventData.orderId
              });
              
              await notification.save();
              break;
          }
          
          console.log('Notificación procesada correctamente');
        } catch (error) {
          console.error('Error al procesar mensaje de Kafka:', error);
        }
      }
    });
    
    console.log('Consumidor de Kafka iniciado y escuchando mensajes');
  } catch (error) {
    console.error('Error al conectar consumidor a Kafka:', error);
  }
};

// Función para desconectar
const disconnect = async () => {
  try {
    await consumer.disconnect();
    console.log('Consumidor desconectado de Kafka');
  } catch (error) {
    console.error('Error al desconectar de Kafka:', error);
  }
};

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});

module.exports = { connect, disconnect };