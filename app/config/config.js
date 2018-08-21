require('dotenv').config();

const config = {
    apiUrl: process.env.APIURL,
    apiAuth: process.env.APIAUTH,
};

module.exports = config;