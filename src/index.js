import "dotenv/config";
import app from "./app/app.js";

const PORT = process.env.SERVER_PORT || 5000;

const start = async () => {
  console.log(`Starting server...`);
  try {
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
