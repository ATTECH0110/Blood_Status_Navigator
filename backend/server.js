require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/hospitals", require("./routes/hospital.routes"));
app.use("/api/requests", require("./routes/request.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" ,
  methods:["GET","POST","PUT","PATCH"]
  },
});

app.set("io", io);
io.on("connection" , (socket)=>{
  console.log("socket connected:", socket.id );

  socket.on("disconnet", ()=>{
    console.log("Socket disconnected");
  })
});



server.listen(5000, () => {
  console.log("Server running on 5000 with Socket.IO");
});
