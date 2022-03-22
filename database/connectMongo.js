const mongoose = require("mongoose");
class ConnectMongo {
  constructor() {
    this.gfs = null;
  }
  static getConnect() {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => console.log("DB is connected"));
    const conn = mongoose.connection;
    conn.once("open", () => {
      console.log("DB is connected");
      this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
      });
    });
  }
}
// const connectDB = () => {
//   try {
//     if (!mongoose.connection.readyState) {
//       const conn = mongoose
//         .createConnection(process.env.MONGO_URL, {
//           useNewUrlParser: true,
//           useFindAndModify: true,
//           useUnifiedTopology: true,
//           useCreateIndex: true,
//         })
//         .then(() => {
//           console.log("DB is connected");
//         });
//     }
//   } catch (error) {}
// };

exports.ConnectMongo = ConnectMongo;
