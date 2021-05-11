const connect = require('connect');
const serveStatic = require('serve-static');
const dotenv = require("dotenv")
const express = require("express")
dotenv.config();
express()
    .use(serveStatic(__dirname))
    .listen(8080, () => console.log('Server running on 8080...'));