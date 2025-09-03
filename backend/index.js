import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { app } from "./app.js";

dotenv.config()

const port = process.env.PORT || 5000;
connectDb()
.then(() => {
  app.listen(port, () => {
    console.log(`server is listening at ${port}`);
  });
});



