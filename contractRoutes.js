const express = require('express');
const router = express.Router();
const { getContracts, getContract, createContract, updateContract, deleteContract, addNote, getExpiringContracts } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/expiring', getExpiringContracts);
router.route('/').get(getContracts).post(createContract);
router.route('/:id').get(getContract).put(updateContract).delete(deleteContract);
router.post('/:id/notes', addNote);

module.exports = router;
