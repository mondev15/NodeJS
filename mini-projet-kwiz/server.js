/**
 * Created by jgarcia on 01/12/2017.
 */

var fs = require('fs');
var favicon = require('serve-favicon');
var path = require('path');
var express = require('express');
var app = express();

var clients = [];
var pseudos = [];

//load questions file
var quiz = require('./data/bluffer.json');

//make the server and the socketsio
var server = require('http').createServer(app);
// Socket io ecoute l'appli
var io = require('socket.io')(server);

//server static file in the public directory
app.use(express.static('public'))
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

function Client(socketId) { //-------------------------------------------------------------varibale pour stocker les informations d'un client
    this.idClient = socketId;
    this.sonpseudo = "";
    this.question_1 = "";
    this.question_2 = "";
    this.question_3 = "";
    this.score = 0;
};

function Counter() {
    this.counterRadio1 = 0;
    this.counterRadio2 = 0;
    this.counterRadio3 = 0;
}

var counter_Q1 = new Counter();
var counter_Q2 = new Counter();
var counter_Q3 = new Counter();
//--------------------------------------------------------------------------------------Connect
io.sockets.on('connection', function (socket) {
    socket.emit('demandePseudo', {content: 'votre pseudo'});
    clients.push(new Client(socket.id));

    //--- ajout du pseudo du client dans le tableau pseudos
    socket.on('nouveauClient', function (pseudo) {
        pseudos.push(pseudo);
        clients.forEach(function (client) {
            if (client.idClient === socket.id) {
                client.pseudo = pseudo;
                client.score = 0;
            }
        });
        io.sockets.emit('listeclients', {'liste': pseudos});
    });

    io.sockets.emit('totalUsers', {count: clients.length});
    socket.emit("quiz", quiz);

    //---affichage dans la console
    console.log('  new connection ...');
    console.log('Connected: %s sockets', clients.length);

    //----------------------------------------------------------------------------------Traitement des Réponses des clients
    socket.on('handlingQuestions', function (reponse) {

        switch (reponse.laReponse.questionId) {
            case "q1" :
                clients.forEach(function (client) {
                    if (socket.id === client.idClient) {
                        if (client.question_1 === "") {
                            client.question_1 = reponse.laReponse.reponseChoisie;

                            switch (reponse.laReponse.radioId) {
                                case "radio_q1_0":
                                    counter_Q1.counterRadio1++;
                                    break;
                                case "radio_q1_1":
                                    counter_Q1.counterRadio2++;
                                    break;
                                case "radio_q1_2":
                                    counter_Q1.counterRadio3++;
                                    break;
                            }
                            io.emit('handlingQuestion_1', {compteurQ1: counter_Q1});
                        }
                    }
                });
                break;
            case "q2" :
                clients.forEach(function (client) {
                    if (socket.id === client.idClient) {
                        if (client.question_2 === "") {
                            client.question_2 = reponse.laReponse.reponseChoisie;

                            switch (reponse.laReponse.radioId) {
                                case "radio_q2_0":
                                    counter_Q2.counterRadio1++;
                                    break;
                                case "radio_q2_1":
                                    counter_Q2.counterRadio2++;
                                    break;
                                case "radio_q2_2":
                                    counter_Q2.counterRadio3++;
                                    break;
                            }
                            io.emit('handlingQuestion_2', {compteurQ2: counter_Q2});
                        }
                    }
                });
                break;
            case "q3" :
                clients.forEach(function (client) {
                    if (socket.id === client.idClient) {
                        if (client.question_3 === "") {
                            client.question_3 = reponse.laReponse.reponseChoisie;

                            client.question_3 = reponse.laReponse.reponseChoisie;
                            switch (reponse.laReponse.radioId) {
                                case "radio_q3_0":
                                    counter_Q3.counterRadio1++;
                                    break;
                                case "radio_q3_1":
                                    counter_Q3.counterRadio2++;
                                    break;
                                case "radio_q3_2":
                                    counter_Q3.counterRadio3++;
                                    break;
                            }
                            io.emit('handlingQuestion_3', {compteurQ3: counter_Q3});
                        }
                    }
                });
                break;
        }

    });


    //----------------------------------------------------------------------------------Disconnect
    socket.on('disconnect', function (data) {
        //---on met à jour le tableau de client
        pseudos.splice(pseudos.indexOf(socket), 1);
        clients.splice(clients.indexOf(socket), 1);
        io.sockets.emit('totalUsers', {count: clients.length});
        io.sockets.emit('listeclients', {'liste': pseudos});
        //---affichgage dans la console
        console.log('     disconnection ...');
        console.log('Connected: %s sockets', clients.length);
    });

});


server.listen(8080);
console.log('KWIZZZ running at http://localhost:8080/...');