#!/usr/bin/env node

/**
 * Module dependencies.
 */
import dotenv from 'dotenv'
dotenv.config() // config() 中是配置.env文件的位置，如果在根目录，此处括号中可以留空
import app from '../app';
import Debug from 'debug';
import http from 'http';
const debug = Debug('http');
import config from '../config';
/**
 * Get port from environment and store in Express.
 */

const port:any = normalizePort(config.server.port || 3000);
// app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val:any) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error:any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind =  port instanceof String
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr: any = server.address();
    console.log('Listening:http://localhost:'+ addr.port)
    let bind =  addr instanceof String
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug(`Listening on ${bind}` );
}
