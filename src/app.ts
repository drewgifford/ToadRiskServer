import express from 'express';
import config from 'config';
import { Game } from "./Game";
import { Server } from "socket.io";
import http from "http";
var bodyParser = require('body-parser');

const app = express();
const port = config.get("port");

const server = http.createServer(app);
const io = new Server(server);

let game = new Game("Ohio.svg");

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('index');
});


/* Socket */
io.on("connection", (socket) => {

    socket.on("updateAll", () => {

        socket.emit("client_updateAll", game);

    });

    socket.on("updateRegion", (region) => {

        console.log("hello");

        let id = region.id;
        let player;

        console.log(region.playerId);

        if(region.playerId == -1){
            player = game.players[0];
        } else {
            player = game.players[region.playerId];
        }

        let currentRegion = game.regions[id];

        if(currentRegion.player == player) return;

        currentRegion.player = player;
        
        io.emit("client_updateRegion", currentRegion);


    });

    socket.on("updateResources", (regions) => {

        for(let i = 0; i < regions.length; i++){

            game.regions[i].resource = regions[i].resource;
            game.regions[i].resourceAmount = regions[i].resourceAmount;

        }

        io.emit("client_updateAllRegions", game.regions);


    });












});




server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

