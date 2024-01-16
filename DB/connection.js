import mongoose from "mongoose";

const DBConnection = async () => {
    await mongoose.connect(process.env.DBCONNECTIONLINKSERVER)
    .then((result) => {
        console.log(`DB Connected successfully`)
    }) 
    .catch((error) => {
        console.log(`BD failed to connect Because: ${error}`);
    })
}

export default DBConnection;