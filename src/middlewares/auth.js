import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }
  try {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Не авторизован' });
      return;
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.locals.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Истек срок жизни токена.' });
      return;
    }
    next(error);
  }
};
