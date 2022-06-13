import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }
  try {
    const [, token] = req.headers.authorization.split(' ');
    if (!token) {
      res.status(401).json({ message: 'Не авторизован' });
      return;
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Не авторизован' });
  }
};
