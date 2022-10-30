import artRouter from './art.js';
import artistRouter from './artist.js';
import likeRouter from './like.js';
import markRouter from './mark.js';
import typeRouter from './type.js';
import userRouter from './user.js';

export default async (fastify) => fastify
  .register(artRouter, { prefix: '/art' })
  .register(artistRouter, { prefix: '/artist' })
  .register(likeRouter, { prefix: '/like' })
  .register(markRouter, { prefix: '/mark' })
  .register(typeRouter, { prefix: '/type' })
  .register(userRouter, { prefix: '/user' });
