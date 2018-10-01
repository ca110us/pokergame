$("body").on("click", "#sendCardBtn", function(event) {
    var req = { cards: document.getElementById('cards').value , player:document.getElementById("player").dataset.player};
    $.ajax({
        type: "GET",
        url: "/sendCards",
        data: req,
        datatype: "json",
        success: function(data) {
            console.log(data);
        }
    });
});