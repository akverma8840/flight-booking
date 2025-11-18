const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

exports.authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach minimal user info
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) { return res.status(401).json({ message:'Invalid token' }); }
};

exports.authorize = (roles=[]) => {
  if (typeof roles === 'string') roles=[roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message:'Unauthenticated' });
    if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ message:'Forbidden' });
    next();
  };
};
