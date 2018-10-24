$(function () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
  
    var connection = new WebSocket('ws://127.0.0.1:3030');
  
    connection.onopen = function () {
        $('#status').text('Connecté');
    };

    connection.onclose = function () {
        $('#status').text('Déconnecté');
    };
  
    connection.onerror = function (error) {
        $('#status').text('Erreur');
        $('#content').append('Une erreur est survenue');
    };
  
    connection.onmessage = function (message) {
        $('#status').text('Connecté');
        //Ici on transforme la touche 'entrée' en tag HTML <br /> pour créer un retour à la ligne
        $('#content').append(message.data.replace(/\r/g, "<br />"));
    };
  });