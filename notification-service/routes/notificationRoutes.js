//notification-service/routes/notificationRoutes.js
const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/user/:userId', notificationController.getUserNotifications);
router.get('/user/:userId/unread', notificationController.getUnreadNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/user/:userId/read-all', notificationController.markAllAsRead);
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', socketioConnected: !!global.io });
  });

module.exports = router;