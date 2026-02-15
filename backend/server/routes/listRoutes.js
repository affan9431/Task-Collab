const express = require('express');
const auth = require('../middleware/auth');
const { getLists, createList } = require('../controllers/listController');

const router = express.Router();

router.get('/', auth, getLists);
router.post('/', auth, createList);

module.exports = router;
