const express = require('express'), router = express.Router();
const fc = require('../controllers/flightController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('admin'), fc.createFlight);
router.get('/search', fc.searchFlights);

module.exports = router;
