import {createServer} from "node:http";
import next from "next"
import {Server} from "socket.io"
import 'dotenv/config';

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = parseInt(process.env.PORT || "3000", 10)

const app = next({dev, hostname, port})
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        handle(req, res)
    });
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.*:3000", "http://*:3000"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        socket.on("join-room", (data: { room: string, username: string }) => {
                const {room, username} = data;
                socket.join(room);
                console.log(`Username: ${username} with ID: ${socket.id} joined room: ${room}`);
                io.to(room).emit("user_joined", {sender: "system", message: `${username} joined the room`});
            })

        socket.on("message", (data: {room: string, message: string, sender: string}) => {
            const {room, message, sender} = data;
            console.log(`Message from ${sender} in room ${room}: ${message}`);
            io.to(room).emit("message", {sender, message: message});
        })

        socket.on("disconnect", () => {
            console.log("user disconnected", )
        })
    })

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})