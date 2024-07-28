const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const auth = require('../middleware/auth');

router.post('/', auth, ItemController.createItem);
router.get('/', ItemController.getItems);
router.get('/:id', ItemController.getItem);
router.put('/:id', auth, ItemController.updateItem);
router.delete('/:id', auth, ItemController.deleteItem);

module.exports = router;
