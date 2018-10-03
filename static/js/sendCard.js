var socket = io.connect('http://198.13.48.65:1214');
socket.on('connect', function (data) {
  socket.emit('bindSocket', { player: document.getElementById("player").dataset.player});
});
socket.on('playerCards', function (cards) {
    console.log(cards);
});
socket.on('receiveMessage', function (message) {
    console.log(message);
});
function sendCards() {
    socket.emit('outCards', { player: document.getElementById("player").dataset.player , cards: document.getElementById('cards').value });
}