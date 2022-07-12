import jwt from 'jsonwebtoken';

export default (role) => (req, res, next) => {
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
    if (decoded.role !== role) {
      res.status(403).json({ message: 'Нет доступа' });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};
