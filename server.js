const express = require('express');

const server = express();

server.all('/', (req, res) => {
	res.json({message: 'Grim Bot is running!'})
	res.send('Grim Bot is up!')
})

function keepAlive() {
	server.listen(3000, () => console.log('server running!'))
}

module.exports= {keepAlive}