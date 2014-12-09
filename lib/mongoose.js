'use strict';

var util = require('util'),
    mongoose = require('mongoose'),
    username = process.env.MONGODB_USERNAME,
    password = process.env.MONGODB_PASSWORD,
    host = process.env.MONGODB_HOST,
    port = process.env.MONGODB_PORT,
    database = process.env.MONGODB_DATABASE;


if (!username || !password || !host || !port || !database) {
    console.error('Environment not configured.');
    process.exit(1);
}


mongoose.connect(util.format('mongodb://%s:%s@%s:%s/%s', username, password, host, port, database));


/* events */
mongoose.connection.on('connected', function () {
    console.log('Mongoose conenction open');
});


mongoose.connection.on('error', function (error) {
    console.error('Mongoose error: ', error);
    process.exit(1);
});


mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});


process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.error('Mongoose connection closed due to app termination');
        process.exit(1);
    });
});




module.exports = mongoose;
