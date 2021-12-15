// Update with your config settings.
require("dotenv").config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
        database: process.env.DATABASE,
        user: process.env.USERNAME,
        password: process.env.PASSWORD
    }
    }
  
};
