import NotFoundError from '../errors/NotFoundError.js';

export default (_req, _res, next) => {
  next(new NotFoundError('Not found'));
};
