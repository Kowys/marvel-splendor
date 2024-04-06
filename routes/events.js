var express = require('express');

var router = express.Router();

// clients connected to server
let clients = [];
let facts = [];

// clients connected to server
router.get('/status', (request, response) => response.json({clients: clients.length}));

// manage clients
function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(facts)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: request.query.game_id,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
}
  
router.get('/events', eventsHandler);

// post request to trigger server sent event
function sendEventsToAll(clientId) {
    clients.forEach(client => {
      if (client.id === clientId) {
        client.response.write(`data: ${JSON.stringify(client.id)}\n\n`)
      }
    })
    console.log(`Sent message to clients`)
}

async function addFact(request, response, next) {
    console.log(`Sending message to clients`)
    const newFact = request.body;
    facts.push(newFact);
    response.json(newFact)
    sendEventsToAll(newFact);
}
  
router.post('/fact', addFact);

module.exports = {
	router: router,
	sendEventsToAll: sendEventsToAll
}