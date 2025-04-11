const mongoose = require('mongoose');
const UserSchema = require('./user');
const WeatherSchema = require('./weather');
const CustomAlertSchema = require('./custom-alert');


const User = mongoose.model('User', UserSchema);
const Weather = mongoose.model('Weather', WeatherSchema);
const CustomAlert = mongoose.model('CustomAlert', CustomAlertSchema);

const connect = async () => {
    await mongoose.connect(process.env.MONGO_URL);
  }

  module.exports = {
    connect,
    User,
    Weather, 
    CustomAlert,   
  }
  