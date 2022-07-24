const { certificate } = require("./engine/certificategenerator");
const cert = certificate.generate("127.0.0.1");
const WebSocket = require('ws');
const zlib = require("node:zlib");

/**
 * Fastify instance
 */
const app = require('fastify')({
    logger: {
        transport: {
            target: 'pino-pretty'
        },
        serializers: {
            res(reply) {
                return {
                    statusCode: reply.statusCode
                };
            },
            req(request) {
                return {
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    body: request.body
                };
            }
        }
    },
    http2: true,
    https: {
        allowHTTP1: true,
        key: cert.key,
        cert: cert.cert
    }
});

const database = require('./engine/database');
const webinterface = require("./engine/webinterface");

module.exports = {
    app,
    database,
    webinterface
};

const { DatabaseLoader } = require("./engine/databaseLoader");
const { logger } = require("./plugins/utilities");
DatabaseLoader.loadDatabase();

app.removeContentTypeParser("application/json");
app.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
    if (req.headers['user-agent'].includes('Unity')) {
        try {
            zlib.inflate(body, function (err, data) {
                if (!err && data !== undefined) {
                    var inflatedString = data.toString('utf-8');
                    if (inflatedString.length > 0) {
                        var json = JSON.parse(inflatedString);
                        done(null, json);
                        return;
                    }
                    done(null, body);
                    return;
                } else {
                    done(null, body);
                    return;
                }
            });
        } catch (error) {
            err.statusCode = 400;
            done(err, undefined);
            return;
        }
    } else {
        try {
            var json = JSON.parse(body);
            done(null, json);
        } catch (err) {
            err.statusCode = 400;
            done(err, undefined);
        }
    }
});

app.addContentTypeParser('*', (req, payload, done) => {
    const chunks = [];
    payload.on('data', chunk => {
        chunks.push(chunk);
    });
    payload.on('end', () => {
        done(null, Buffer.concat(chunks));
    });
});

/**
* Register Handler
*/
app.register(require('./plugins/register.js'));

/**
 * Websocket
 */
//const wss = new WebSocket.Server({ port: 443, host: '127.0.0.1' }, () => {
//    logger.logError("Websocket started")
//});
//
//wss.on('connection', (ws) => {
//    ws.on('message', (data) => {
//        logger.logError(data);
//        ws.send(data);
//    });
//});
//
//wss.on('listening', () => {
//    console.log("Websocket is listening on port 443");
//});

/**
* Start the server
*/
async function start() {
    try {
        await app.listen({ port: 443, host: '127.0.0.1' });
        app.log.info(`Server listening on ${app.server.address().port}`);
        
        //app.log.info(`Websocket listening on ${app.websocketServer.address().port}`);
    } catch (err) {
        app.log.info(err);
        process.exit(1);
    }
}
start();
