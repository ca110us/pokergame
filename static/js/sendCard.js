$("body").on("click", "#sendCardBtn", function(event) {
    var req = { cards: document.getElementById('cards').value };
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