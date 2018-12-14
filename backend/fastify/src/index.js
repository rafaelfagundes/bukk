console.clear();
const mongoose = require("mongoose");
const cors = require("cors");
const fastify = require("fastify")({
  logger: true
});

const routes = require("./routes");

// Connect to DB
mongoose
  .connect(
    "mongodb://localhost/bukk",
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
    // fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
