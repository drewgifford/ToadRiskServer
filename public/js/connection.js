const socket = io();

socket.on("connect", () => {
    $(document).ready(function(){
        socket.emit("updateAll");
    })
    
})

socket.on("client_updateAll", (gameData) => {

    loadMap(gameData.map).then(() => {
        loadPlayers(gameData.players);
        loadRegions(gameData.regions);
        updateItems(gameData.items);
        finishLoading();
    })
})

