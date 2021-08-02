const express = require('express');
const server = express();

server.all('/', (req, res) => {

	const uptime = client.uptime;
})

function keepAlive() {
	server.listen(3000, () => console.log('server running!'))
}

module.exports= {keepAlive}