require('dotenv').config();
const axios = require('axios');


const api = axios.create({
  baseURL: 'http://localhost:3600',
  timeout: 5000,
});

module.exports = {

  doUserLogin: async (uname , password) => {
    const response = await api.post('/auth', {
       "email" : "sunilvb@gmail.com",
       "password" : "sunder74"
    });

    return response.data;
    },

};
