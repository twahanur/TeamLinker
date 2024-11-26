const cors = require('cors');
const fileUpload = require('express-fileupload');
const express = require('express');
const { getCountries } = require('node-countries');
const geoip = require('geoip-lite');

const rootMiddleware = (app) => {
    app.use(cors());
    app.use(express.json({ limit: '2048mb' }));
    app.use(express.urlencoded({ limit: '2048mb', extended: true }));

    //file upload middleware
    app.use(fileUpload(
        // {
        //     useTempFiles: true,
        //     tempFileDir: './temp/'
        // }
    ));
}


module.exports = rootMiddleware;