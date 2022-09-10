const mongoose = require("mongoose");

mongoose.connect(
    process.env.MONGODB_URI || "mongodb:",
    {
        useNewUrlPasrser: true,
        useUnifiedTopology: true,
    }
);

module.exports = mongoose.connection;