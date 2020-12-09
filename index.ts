import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routesMDW from "./middlewares/routes.mdw";

// rest of the code remains same
const app = express();
const PORT = process.env.PORT || 8000;
// middlewares
app.use(express.json());
app.use(cors());
// Key
const connect_Url =
  "mongodb+srv://admin:admin@cluster0.0n2op.mongodb.net/CARO_DACK?retryWrites=true&w=majority";
mongoose.connect(connect_Url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("connected!");
});
routesMDW(app);

app.get("/", (req, res) => res.send("Typescript"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
