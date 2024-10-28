import express from "express";
import cookieParser from "cookie-parser";

import familyRouter from "./routes/family.router";
import planRouter from "./routes/plans.router";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.use("/family", familyRouter);
app.use('/plan', planRouter);


app.get("/ping", (req, res) => {
  res.json({ message: "pong" }).status(200);
});

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);
});