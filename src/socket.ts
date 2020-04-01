import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { RoomModels, ChatModels } from "./models";

const roomModels = new RoomModels();
const chatModels = new ChatModels();

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

const getTime = time => {
  const year = time.getFullYear();
  let month = (time.getMonth() + 1).toString();
  month = Number(month) < 10 ? "0" + month : month;
  let date = time.getDate();
  date = Number(date) < 10 ? "0" + date : date;
  let hour = time.getHours();
  hour = Number(hour) < 10 ? "0" + hour : hour;
  let minute = time.getMinutes();
  minute = Number(minute) < 10 ? "0" + minute : minute;
  const result2 = "" + year + month + date + hour + minute;
  return result2;
};

const transformTime = async messages => {
  for (let i = 0; i < messages.length; i++) {
    const time = new Date(messages[i].createdAt);
    messages[i].createdAt = await getTime(time);
  }
  return messages;
};

export default function socketInfo() {
  return socket => {
    console.log("socket connected");
    socket.on("login", async data => {
      let tokenInfo;
      try {
        tokenInfo = await verifyToken(data.token, process.env.JWT_SECRET_KEY);
      } catch (err) {
        socket.emit("error", err);
        console.log(err);
      }
      if (tokenInfo.isUser) {
        const room = await roomModels.findOneWithUserId(tokenInfo.id);
        if (room) {
          const messages = await chatModels.findWithRoomId(room.id);
          const result = await transformTime(messages);
          socket.emit("chatLog", result);
        } else {
          await roomModels.save({ userId: tokenInfo.id });
          socket.emit("chatLog", []);
        }
      } else {
        const room = await roomModels.findOneWithUserId(data.userId);
        const messages = await chatModels.findWithRoomId(room.id);
        const result = await transformTime(messages);
        socket.emit("chatLog", result);
      }
    });
    socket.on("chat", async data => {
      let tokenInfo;
      try {
        tokenInfo = await verifyToken(data.token, process.env.JWT_SECRET_KEY);
      } catch (err) {
        socket.emit("error", err);
        console.log(err);
      }
      if (tokenInfo.isUser) {
        const room = await roomModels.findOneWithUserId(tokenInfo.id);
        const chatData = {
          content: data.content,
          roomId: room.id,
          writer: "user"
        };
        await chatModels.save(chatData);
        const messages = await chatModels.findWithRoomId(room.id);
        const result = await transformTime(messages);

        socket.emit("chatLog", result);
      } else {
        const room = await roomModels.findOneWithUserId(data.userId);
        const chatData = {
          content: data.content,
          roomId: room.id,
          writer: "admin"
        };
        await chatModels.save(chatData);
        const messages = await chatModels.findWithRoomId(room.id);
        const result = await transformTime(messages);
        socket.emit("chatLog", result);
      }
    });
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  };
}
