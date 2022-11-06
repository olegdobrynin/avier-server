import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import ApiError from '../errors/ApiError.js';

const leveling = [
  ['admin'],
  ['admin', 'artist'],
  ['admin', 'artist', 'user'],
];

const authorization = (level) => async (req) => {
  const { role } = await req.jwtVerify();

  if (!leveling.at(level).includes(role)) {
    throw new ApiError({ status: 403 });
  }
};

export default fp(async (fastify) => {
  await fastify.register(jwt, { secret: process.env.SECRET_KEY });

  fastify.decorate('authorization', authorization);
});
