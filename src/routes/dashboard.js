const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, ItemController.getDashboard);

module.exports = router;
