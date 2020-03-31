import express from "express";
import bodyParser from "body-parser";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import cors from "cors";
import { createTypeormConnection } from "./utils/createTypeormConnection";
import morgan from "morgan";
import http from "http";
import socketIo from "socket.io";
import socektInfo from "./socket";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT: number = 3002;
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://dogandcodemate.s3-website.ap-northeast-2.amazonaws.com",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

if (process.env.NODE_ENV !== "test") {
  createTypeormConnection();
  app.use(morgan("dev"));
}

const nsp = io.of("/chat");
nsp.on("connection", socektInfo());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

server.listen(PORT, async () => {
  console.log(`app is listening in port ${PORT}`);
});

export default app;
