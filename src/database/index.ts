import { createConnection } from "typeorm";

createConnection()
  .then(() => console.log("ok"))
  .catch((err) => {
    console.warn(err);
  });
