let gameItems = [];

function updateItems(items){

    gameItems = [];

    $(".items-list").children().remove();

    for(var item of items){

        let type = item.type;
        let list = $(`div[data-item-type='${type}']`).find(".items-list");

        let div = $(`<div class="item-shop" data-id="${item.id}"></div>`);
        let img = $(`<img src="/img/${item.type}/${item.id}.svg"/>`);

        img.appendTo(div);
        

        gameItems.push(item);

        let tooltip = $(".templates .item-tooltip").clone();

        tooltip.find("*[data-content=name]").text(item.name);

        //FOR EACH ITEM COST

        for (var key of Object.keys(item.cost)){

            console.log(key, item.cost[key]);

            let costItem = $(`<span>${item.cost[key]}<img src='/img/${key}.svg'/></span>&nbsp;`)

            tooltip.find("*[data-content=cost]").append(costItem);

        }

        for (var key of Object.keys(item.upkeep)){

            console.log(key, item.upkeep[key]);

            let upkeepItem = $(`<span>${item.upkeep[key]}<img src='/img/${key}.svg'/></span>&nbsp;`)

            tooltip.find("*[data-content=upkeep]").append(upkeepItem);

        }



        tooltip.appendTo(div);

        div.appendTo(list);


    }

}


/*let hoveredItem = null;
$(document).on("mouseover", ".item-shop", function(){

    let item = gameItems.find(i => i.id == $(this).attr('data-id'));

    console.log(item);

    hoveredItem = item;

});
$(document).on("mouseout", ".item-shop", function(){

    let item = gameItems.find(i => i.id == $(this).attr('data-id'));

    if(hoveredItem == item) hoveredItem = null;

    console.log(hoveredItem);

});*/
