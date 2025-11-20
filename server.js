import express from 'express'
import http from 'http'
import next from 'next';
import { Server } from 'socket.io';

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

let busLocations = {};

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("driverLocationUpdate", (data) => {
      busLocations[data.busId] = data;
      io.emit("busLocationUpdate", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
    