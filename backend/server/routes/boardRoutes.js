const express = require('express');
const auth = require('../middleware/auth');
const { getBoards, getBoard, createBoard, deleteBoard, addMember } = require('../controllers/boardController');

const router = express.Router();

router.get('/', auth, getBoards);
router.get('/:id', auth, getBoard);
router.post('/', auth, createBoard);
router.delete('/:id', auth, deleteBoard);
router.put('/:id/members', auth, addMember);

module.exports = router;
