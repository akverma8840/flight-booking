const express = require('express'), router = express.Router();
const bc = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, bc.createBooking);

module.exports = router;
