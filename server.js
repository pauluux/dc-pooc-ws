const express = require('express')
const app = express()
const port = 3000

//Création et configuration d'un server dse websockets
const websocket = require('ws');
const wss = new websocket.Server({ port: 3030 });
var clients = [];
wss.on('connection', function connection(ws) {
	clients.push(ws);
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});
});
//fonction pour envoyer du texte à tous les clients
function sendText(text) {
	for(index in clients) {
		clients[index].send(text);
	}
}

//Configuration de la console pour lire le clavier
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
	//On détecte le Ctrl-C pour stopper le serveur.
	if (key.ctrl && key.name === 'c') {
		process.exit();
	} else {
		//On envoie directement la touche reçue au client.
		sendText(str);
	}
});

//OS est un utilitaire node qui va nous servir à afficher le nom de notre raspberry
const os = require("os");
//MustacheExpress est notre moteur de template
const mustacheExpress = require('mustache-express');

//Configuration du moteur de template
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

//Ici on dit au serveur de servir les fichiers statiques depuis le dossier /public
app.use(express.static('public'))

//On retrouve le même comportement que notre serveur précédent
app.get('/', (request, response) => {
	//Ici on indique que nous voulons transformer notre fichier index.mustache en HTML
	response.render('index');
});

app.listen(port, (err) => {
	if (err) {
		return console.log('Erreur du serveur : ', err)
  	}
	//On utilise l'utilitaire OS pour récupérer le nom de notre raspberry.
	console.log('Le serveur écoute sur le port '+port+'\nRendez vous sur http://'+os.hostname()+'.local:'+port);
	console.log('Tappez votre texte ici, il sera envoyé sur votre page web instantanément.');
});
