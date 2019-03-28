const http = require('http');
const delay = require('delay');
const express = require('express');
const bodyParser = require('body-parser');
const { createTerminus } = require('@godaddy/terminus');

const app = express();
app.use(bodyParser.json());
const mystem = require('./mystem');
const profanity = require('./profanity');
const server = http.createServer(app);
const port = process.env.PORT || 8911;

app.get('/', (req, res) => {
    res.json({error: 'Nothing to see here.'});
});

app.post('/', async (req, res) => {
    const {text} = req.body;
    const result = await mystem(text);
    res.json(result);
});

app.post('/profanity', async (req, res) => {
    const {text} = req.body;
    const result = await profanity(text);
    res.json(result);
});

async function onSignal() {
    console.log('server is starting cleanup');
    await delay(1 * 1000);
    server.close();
}
  
function onShutdown() {
    console.log('cleanup finished, server is shutting down');
}

createTerminus(server, {onSignal, onShutdown,  signal: 'SIGINT'});
createTerminus(server, {onSignal, onShutdown,  signal: 'SIGTERM'});

server.listen(port, (err) => {
    if (err) return console.error(err);
    console.log(`Listening at 0.0.0.0:${port}`);
});
