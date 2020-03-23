require('dotenv').config();
const axios = require('axios');

const api_key_2= process.env.API_KEY_2;

const api = axios.create({
  baseURL: 'https://free.currconv.com/api/v7',
  timeout: 5000,
});

module.exports = {
  convertCurrency: async (from, to) => {
    const response = await api.get(`/convert?q=${from}_${to}&compact=ultra&apiKey=${api_key_2}`);

    const myObj = response.data;
    const key = Object.keys(response.data)[0];

    const  val  = response.data[key];

    return { rate: val };
  },
/*  doUserLogin: async (from, to) => {
    const response = await api.get(`/convert?q=${from}_${to}&compact=ultra&apiKey=${api_key_2}`);

    const myObj = response.data;
    const key = Object.keys(response.data)[0];

    const  val  = response.data[key];

    return { accessToken: 'somehash223344EEE', refreshToken: 'morehashdatahereXXXCCC1234'};
  },*/
};
