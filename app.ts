import express, { Express } from "express";
import { authRouter } from "./src/routes/auth.route";
import { postRouter } from "./src/routes/post.route";
import { followRouter } from "./src/routes/follow_info.route";
import { actionRouter } from "./src/routes/actions.route";
import connect from "./src/database/db_connection";

const app:Express = express();
app.use(express.json());
const port = 6000;
connect;

app.use("/auth", authRouter);
app.use("/upload", postRouter);
app.use("/data", followRouter);
app.use("/data", actionRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


