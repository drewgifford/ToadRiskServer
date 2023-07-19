import * as fs from "fs"
const path = require("path");
import config from 'config';

const Resource = {
    wheat: "wheat", lumber: "lumber", iron: "iron", coal: "coal", oil: "oil", uranium: "uranium"
}
const ItemType = {
    unit: "unit",
    building: "building",
    city: "city"
}

export class Item {

    id: number;
    name: string;
    type: string;
    cost: any;
    upkeep: any;

    constructor(id: number, name: string, type: string, cost: any, upkeep: any){
        this.id = id;
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.upkeep = upkeep;
    }

}

export class Region {

    id: number;
    resource: string | null = null;
    resourceAmount: number = 0;
    player: Player = null;

    constructor(id: number){
        this.id = id;
    }

}

export class Player {

    name: string;
    color: string;
    resources: object = {};

    constructor(name: string, color: string){
        this.name = name;
        this.color = color;
    }


}

export class Game {

    map: string;
    players: Player[];
    regions: Region[];
    paths: number = 0;
    items: Item[]

    constructor(map: string){

        this.map = map;

        this.players = [
            new Player("None", "#363552"),
            new Player("Wasteland", "#141416"),
        ]

        

        // Count PATHs

        console.log(path.resolve("./public/svg/"+this.map));

        const data = fs.readFileSync(path.resolve("./public/svg/"+this.map), "utf8")

        let count = (data.match(/<path/g) || []).length;

        this.paths = count;

        this.initializePlayers();
        this.initializeRegions();
        this.initializeItems();

    }

    initializeItems(){

        this.items = [];

        let items = config.get("items");
        
        for (var item of items){
            
            this.items.push(
                new Item(item.id, item.name, ItemType[item.type], item.cost, item.upkeep)
            )

        }


    }

    initializePlayers(){

        let newPlayers = config.get("players");
        newPlayers.map((p: any) => {
            this.players.push(new Player(p.name, p.color));
        })

    }

    initializeRegions(){

        this.regions = [];

        let defaultPlayer = this.players[0];

        for(var i = 0; i < this.paths; i++){
            let region = new Region(i);
            
            region.player = defaultPlayer;

            this.regions.push(region);
        }

    }


}