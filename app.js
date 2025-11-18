require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./models'); 
//const authRoutes = require('./routes/authRoutes');
//const flightRoutes = require('./routes/flightRoutes');
//const bookingRoutes = require('./routes/bookingRoutes');
//const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const passport = require("./config/googleAuth");
//const googleRoutes = require("./routes/googleAuthRoutes");
const indexroutes= require("./routes/index");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15*60*1000, max: 300 }));
app.use(passport.initialize());

//app.use('/api/auth', indexroutes);
//app.use('/api/flights', indexroutes);
//app.use('/api/bookings', indexroutes);
//app.use('/api/users', indexroutes);
//app.use("/api/auth", indexroutes);
app.use("/api", indexroutes);



app.get('/', (req,res) => res.send('Flight Booking API'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    
    await sequelize.sync({ alter: true });
    console.log('Models synced');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running ${port}`));
  } catch (err) {
    console.error(err);
  }
})();
app.use(errorHandler);
