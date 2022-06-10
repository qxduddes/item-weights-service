const express = require("express");
const cors = require("cors");
const dbConfig = require('./config/db.config');

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json({limit: '25mb'}));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const db = require("./models");
const { disabled } = require("express/lib/application");
const Role = db.ROLE;

// Initialize mongodb connection
const mongoDbEnv = process.env.MONGODB_ENV;
const mongoDBConnection = mongoDbEnv === "local" ? dbConfig.local : dbConfig.live;
db.mongoose
  .connect(mongoDBConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connected to MongoDB ' + mongoDbEnv);
    initial();
  })
  .catch(err => {
    console.log('Connection error', err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Shipping Item Weights Service." });
  });
  
// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/itemWeights.routes')(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("Role error", err);
        }

        console.log("Add 'user' to roles collection.");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if(err) {
          console.log("Role error", err);
        }

        console.log("Add 'admin' to role collection.");
      });
    }
  })
}

