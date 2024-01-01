import process from 'node:process';
import express from "express";
import { createClient } from "redis";

const app = express();
const PORT = 3000 || process.env.PORT;

const client = createClient({
  url: "redis://default:default@redis-server:6379",
});

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  await client.set("visits", 0);
})();

app.get("/", async (req, res) => {
  // process.exit(0);
  const visits = await client.get('visits');
  res.send(`Number of visits: ${visits}`);
  await client.set("visits", parseInt(visits) + 1);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
