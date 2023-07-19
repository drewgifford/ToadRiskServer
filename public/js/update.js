socket.on("connect", () => {

    socket.on("client_updateRegion", (region) => {

        let path = $(`#map-container svg path:eq(${region.id})`);

        $(path).attr("fill", region.player.color);

    });

    socket.on("client_updateAllRegions", (regions) => {
        window.location.reload();
        //loadRegions(regions);

    });

});