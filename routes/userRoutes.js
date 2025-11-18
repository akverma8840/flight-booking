const express = require('express'), router = express.Router();
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, async (req,res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id','name','email','role'] });
  res.json(user);
});

module.exports = router;
