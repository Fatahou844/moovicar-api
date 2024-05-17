const WebSocket = require("ws");

const ws = new WebSocket("http://localhost:3001");

ws.on("open", function open() {
  console.log("connected");
  ws.send(JSON.stringify({ type: "register", userId: 1 }));
});

ws.on("message", function incoming(data) {
  console.log(`Received message: ${data}`);
});

ws.on("close", function close() {
  console.log("disconnected");
});
