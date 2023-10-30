const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const followRoutes = require("./routes/follow");

//file imports
const db = require("./config/db");
const { cleanUpBin } = require("./utils/cron");


//middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);


app.listen(PORT, () => {
    console.log("Server is running at port: ", PORT);
    cleanUpBin();
  });


//routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/follow", followRoutes);