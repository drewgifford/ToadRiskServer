

var playersList = [];

function loadMap(svgUrl){

    return new Promise((resolve, reject) => {
        fetch(`/svg/${svgUrl}`).then((res) => {

            res.text().then((text) => {
                $("#map-container").html(text);
                resolve(true);
            })
            
        });
    })

    
}

function loadPlayers(players){
    playersList = [];

    $(".players-list").find("tr.player").remove();

    for(var i = 0; i < players.length; i++){

        let player = players[i];
        playersList.push(player);

        $(`<tr class='player' data-player='${i}' style='background-color: ${player.color}'>
        
            <td>${player.name}</td>
    
            </tr>`).appendTo(".players-list");
    }

    selectPlayer(0);
}

function loadRegions(regions){

    let svgWidth = $("#map-container svg").attr("width");
    RESOURCE_ICON_SCALE = svgWidth/2500;

    $("#map-resources").children().remove();

    let paths = $("#map-container svg").find("path");

    for(var i = 0; i < regions.length; i++){

        let region = regions[i];
        let path = paths[i];
        let player = region.player;

        if(!player) continue;

        $(path).attr("fill", player.color);

        loadResource(region);
    }

    // LOAD RESOURCE TILES
}

function loadResource(region){

    

    if (!region.resource || region.resourceAmount <= 0) return;

    let path = $(`#map-container svg path:eq(${region.id})`);

    let resourceIcons = $(`.templates .resource-${region.resourceAmount}`).clone();
    resourceIcons.find("img").attr("src", `/img/${region.resource}.svg`);

    let bBox = $(path)[0].getBoundingClientRect();


    let x = (bBox.x + bBox.width / 2 - (26)/2);
    let y = (bBox.y + bBox.height / 2 - (26)/2)

    resourceIcons.css({"left": x, "top": y, "transform": `scale(${RESOURCE_ICON_SCALE})`});

    $(resourceIcons).appendTo("#map-resources");

}


function finishLoading(){

    $(".loading-box").fadeOut(500);


}