import mongoose from "mongoose";

try {
  console.log("Connecting...");

  await mongoose.connect(
    // "mongodb+srv://imtiazali78652_db_user:4JbxGe7WmL0Qq39z@cluster0.kaw0faj.mongodb.net/?appName=Cluster0"
    "mongodb://imtiazali78652_db_user:4JbxGe7WmL0Qq39z@ac-ysqtn4i-shard-00-00.kaw0faj.mongodb.net:27017,ac-ysqtn4i-shard-00-01.kaw0faj.mongodb.net:27017,ac-ysqtn4i-shard-00-02.kaw0faj.mongodb.net:27017/?ssl=true&replicaSet=atlas-bowrd8-shard-0&authSource=admin&appName=Cluster0"
  );

  console.log("CONNECTED SUCCESSFULLY");
  process.exit(0);

} catch (err) {
  console.log("FAILED CONNECTION:");
  console.log(err);
  process.exit(1);
}