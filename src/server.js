const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const sessionRoutes = require("./routes/session");
const tokenRoutes = require("./routes/token");
const contactRoutes = require("./routes/contact");
const uploadsRoutes = require("./routes/uploads");
const socketRouter = require("./routes/socket")(io);

env.config();

mongoose
  .connect(
    `mongodb+srv://doadmin:5kD0z67Z3b1wt9J8@db-mongodb-nyc1-08756-4e0305ee.mongo.ondigitalocean.com/admin?tls=true&authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", sessionRoutes);
app.use("/api", tokenRoutes);
app.use("/api", contactRoutes);
app.use("/api", uploadsRoutes);
app.use("/api", socketRouter);

io.on("connection", (socket) => {
  console.log(`ID: ${socket.id}`);
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${ process.env.PORT }`);
});
