import app from "./app.js";

const PORT = process.env.port || 8080;

app
  .listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`);
  })
  .on("error", (error) => {
    console.log(`Server Error ${error}`);
  });
