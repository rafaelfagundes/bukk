console.clear();
const mongoose = require("mongoose");
const cors = require("cors");
const fastify = require("fastify")({
  logger: true
});

const config = require("./config/keys");

const routes = require("./routes");

// Connect to DB
mongoose
  .connect(
    config.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// // Declare a route
// fastify.get("/", async (request, reply) => {
//   return { hello: "world" };
// });

// Cross origin
fastify.use(cors());

routes.forEach(route => {
  fastify.route(route);
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(4000, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
