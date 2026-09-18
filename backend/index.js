require("dotenv").config();
const app = require("./src/app");
const db = require("./src/configs/database");
require("./src/models/Associations");

const PORT = process.env.PORT || 3000;

db.authenticate()
  .then(() => {
    console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
