import Fastify from "fastify"

const fastify = Fastify()

fastify.get("/", (request, reply) => {
  return reply.send('Order endpoint works');
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001 })
    console.log("Order service is running on port 8001");
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};

start()
