import "./sr/config/env.js";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import app from "./sr/app.js";
import connectDB from "./sr/config/db.js";



connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


