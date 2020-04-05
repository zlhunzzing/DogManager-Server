import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { RoomModels, ChatModels } from "./models";
import moment from "moment";

const roomModels = new RoomModels();
const chatModels = new ChatModels();

const verifyToken = (token, secretKeyList) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKeyList[0], (err, decoded) => {
      if (err) {
        jwt.verify(token, secretKeyList[1], (err2, decoded2) => {
          if (err2) reject(err);
          else resolve(decoded2);
        });
      } else resolve(decoded);
    });
  });
};

const transformTime = async (messages) => {
  for (let i = 0; i < messages.length; i++) {
    const m = moment(new Date(messages[i].createdAt));
    messages[i].createdAt = m.format("YYYYMMDDHHmm");
  }
  return messages;
};

export default function socketInfo(nsp) {
  return (socket) => {
    console.log("socket connected");
    socket.on("login", async (data) => {
      let tokenInfo;
      try {
        tokenInfo = await verifyToken(data.token, [
          process.env.JWT_ADMIN_SECRET_KEY,
          process.env.JWT_USER_SECRET_KEY,
        ]);
      } catch (err) {
        nsp.emit("error", err);
        // console.log(err);
      }
      if (tokenInfo.isUser) {
        const roomInfo = await roomModels.findOneWithUserId(tokenInfo.id);
        if (roomInfo) {
          const room = (socket.room = roomInfo.id);
          socket.join(room);
          const messages = await chatModels.findWithRoomId(roomInfo.id);
          const result = await transformTime(messages);
          socket.emit("chatLog", result);
        } else {
          await roomModels.save({ userId: tokenInfo.id });
          const roomInfo2 = await roomModels.findOneWithUserId(tokenInfo.id);

          // const chatData = {
          //   content: "안녕하세요! 무엇을 도와드릴까요?",
          //   roomId: roomInfo2.id,
          //   writer: "admin",
          // };
          // await chatModels.save(chatData);

          const room = (socket.room = roomInfo2.id);
          socket.join(room);
          // const messages = await chatModels.findWithRoomId(roomInfo2.id);
          // const result = await transformTime(messages);
          // console.log(result);
          socket.emit("chatLog", []);
        }

        // 관리자일때
      } else {
        const roomInfo = await roomModels.findOneWithUserId(data.userId);
        const room = (socket.room = roomInfo.id);
        socket.join(room);
        const messages = await chatModels.findWithRoomId(roomInfo.id);
        const result = await transformTime(messages);
        socket.emit("chatLog", result);
      }
    });
    socket.on("chat", async (data) => {
      let tokenInfo;
      try {
        tokenInfo = await verifyToken(data.token, [
          process.env.JWT_ADMIN_SECRET_KEY,
          process.env.JWT_USER_SECRET_KEY,
        ]);
      } catch (err) {
        nsp.emit("error", err);
        console.log(err);
      }
      if (tokenInfo.isUser) {
        const roomInfo = await roomModels.findOneWithUserId(tokenInfo.id);
        const room = (socket.room = roomInfo.id);
        socket.join(room);
        const chatData = {
          content: data.content,
          roomId: roomInfo.id,
          writer: "user",
        };
        await chatModels.save(chatData);
        roomInfo.adminCheck = false;
        await roomModels.save(roomInfo);
        const messages = await chatModels.findWithRoomId(roomInfo.id);
        const result = await transformTime(messages);

        nsp.to(room).emit("chatLog", result);
        // 관리자일때
      } else {
        const roomInfo = await roomModels.findOneWithUserId(data.userId);
        roomInfo.adminCheck = true;
        await roomModels.save(roomInfo);
        const room = (socket.room = roomInfo.id);
        socket.join(room);
        const chatData = {
          content: data.content,
          roomId: roomInfo.id,
          writer: "admin",
        };
        await chatModels.save(chatData);
        const messages = await chatModels.findWithRoomId(roomInfo.id);
        const result = await transformTime(messages);
        nsp.to(room).emit("chatLog", result);
      }
    });
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  };
}
