var RESOURCE_ICON_SCALE = 1;

const Resource = {
    wheat: "wheat", lumber: "lumber",  iron: "iron", coal: "coal", oil: "oil", uranium: "uranium"
}

const ResourceSpawn = {

    wheat: {
        frequency: 0.35,
        minimum: 0.2,
        maxSpawn: 4,
        amplitude: 1.2,
    },
    lumber: {
        frequency: 0.35,
        minimum: 0.15,
        maxSpawn: 4,
        amplitude: 1.2,
    },
    coal: {
        frequency: 0.25,
        minimum: 0.125,
        maxSpawn: 4,
        amplitude: 1.2,
    },
    iron: {
        frequency: 0.25,
        minimum: 0.1,
        maxSpawn: 4,
        amplitude: 1.2,
    },
    oil: {
        frequency: 0.4,
        minimum: 0.075,
        maxSpawn: 3,
        amplitude: 1.2,
    },
    uranium: {
        frequency: 0.1,
        minimum: 0.05,
        maxSpawn: 2,
        amplitude: 0.9,
    }


}

var selectedPlayer = null;

$(document).on("click", "#map-container svg path", function(){

    let index = $(this).index();

    socket.emit("updateRegion", { id: index, playerId: playersList.indexOf(selectedPlayer) });

});


function selectPlayer(playerId){

    let player = playersList[playerId];
    $("tr.player").removeClass("selected");
    $(`tr.player[data-player=${playerId}]`).addClass("selected");

    selectedPlayer = player;
}

$(document).on("click", "tr.player", function(){

    let playerId = $(this).attr("data-player");
    selectPlayer(playerId);

});

function generateResources(){
    // CALCULATE RESOURCE WIDTH

    




    let regions = []

    var paths = $("#map-container svg path");

    for(let i = 0; i < paths.length; i++){

        regions.push({
            id: i,
            resource: null,
            resourceAmount: 0,
        });

    }

    const NOISE_SIZE = 100;


    for(let i = 0; i < Object.keys(Resource).length; i++){

        let resource = Object.keys(Resource)[i];
        let resourceFrequency = ResourceSpawn[resource];


        var width = $("#map-container svg").width();
        var height = $("#map-container svg").height();

        var matrix = window.getComputedStyle($("#map")[0]).getPropertyValue("transform").replace("matrix(", "").replace(")", "").split(", ").map(e => parseFloat(e));
        
        var scaleX = matrix[0];
        var scaleY = matrix[3];

        var translateX = matrix[4];
        var translateY = matrix[5];

        let min = Math.ceil(paths.length * resourceFrequency.minimum);
        let placedNodes = 0;
        let iterations = 0;

        while (placedNodes < min && iterations++ < 100){

            var generator = new NoiseMap.MapGenerator();

            var heightmap = generator.createMap(NOISE_SIZE, NOISE_SIZE, {
                type: "simplex",
                frequency: resourceFrequency.frequency,
                frequencyCoef: 1000,
                generateSeed: true,
                amplitude: resourceFrequency.amplitude
            });

            for(let j = 0; j < paths.length; j++){

                if (regions[j].resource != null) continue;

                let path = paths[j];

                

                let bb = $(path)[0].getBoundingClientRect();

                let localX = Math.round(((bb.x - translateX) / scaleX) / width * NOISE_SIZE);
                let localY = Math.round(((bb.y - translateY) / scaleY) / height * NOISE_SIZE);

                let val = (heightmap.get(localX, localY));

                let max = resourceFrequency.maxSpawn;

                if(val > 0.98)       regions[j].resourceAmount = 4 >= max ? max : 4;
                else if (val > 0.95) regions[j].resourceAmount = 3 >= max ? max : 3;
                else if (val > 0.9) regions[j].resourceAmount = 2 >= max ? max : 2;
                else if (val > 0.85) regions[j].resourceAmount = 1 >= max ? max : 1;

                if(val > 0.85){
                    regions[j].resource = resource;
                    placedNodes++;
                }

            }

        }
        


    }
    socket.emit("updateResources", regions);

}

$(document).on("click", "#generateResources", function(){
    generateResources();
})