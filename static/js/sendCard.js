var ws = new WebSocket("ws://localhost:8181");
ws.onopen = function (e) {
    console.log('Connection to server opened');
}
ws.onmessage = function(evt)
{
  console.log(evt.data)
};
function sendCards() {
    ws.send(document.getElementById("player").dataset.player);
}
// $("body").on("click", "#sendCardBtn", function(event) {
//     var req = { cards: document.getElementById('cards').value , player:document.getElementById("player").dataset.player};
//     $.ajax({
//         type: "GET",
//         url: "/sendCards",
//         data: req,
//         datatype: "json",
//         success: function(data) {
//             console.log(data);
//         }
//     });
// });