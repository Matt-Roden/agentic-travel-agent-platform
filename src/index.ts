import { env } from "./config/env.js";
import { app } from "./app.js";

app.listen(env.port, () => {
  console.log(`Travel Agent Platform is running at http://localhost:${env.port}`);
  console.log(`POST your questions to http://localhost:${env.port}/ask`);
});
