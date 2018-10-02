var socket = io.connect('http://localhost:1214');
socket.on('connect', function (data) {
  socket.emit('bindSocket', { player: document.getElementById("player").dataset.player});
});
// var ws = new WebSocket("ws://localhost:8181");
// ws.onopen = function (e) {
//     console.log('Connection to server opened');
// }
// ws.onmessage = function(evt)
// {
//   console.log(evt.data)
// };
socket.on('playerCards', function (cards) {
    console.log(cards);
});
function sendCards() {
    socket.emit('outCards', { player: document.getElementById("player").dataset.player , cards: document.getElementById('cards').value });
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