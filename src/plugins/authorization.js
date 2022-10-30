import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

const leveling = [
  ['admin'],
  ['admin', 'artist'],
  ['admin', 'artist', 'user'],
];

const authorization = (level) => async (req, reply) => {
  const { role } = await req.jwtVerify();

  if (!leveling.at(level).includes(role)) {
    reply.code(403);
  }
};

export default fp(async (fastify) => {
  await fastify.register(jwt, { secret: process.env.SECRET_KEY });

  fastify.decorate('authorization', authorization);
});
