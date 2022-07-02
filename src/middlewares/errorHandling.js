import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

export default (err, _req, res, _next) => { // eslint-disable-line no-unused-vars
  const { status, message } = err;
  if (err instanceof ApiError) {
    res.status(status).json({ message });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: 'Не найден' });
    return;
  }
  res.status(500).json({ message });
};
