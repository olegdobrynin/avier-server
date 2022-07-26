import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.sendStatus(401);
      return;
    }
    const [method, token] = req.headers.authorization.split(' ');
    if (method !== 'Bearer') {
      res.status(400).json({ message: 'Авторизационный метод неподдерживается' });
      return;
    }
    res.locals.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch ({ name, message }) {
    switch (name) {
      case 'TokenExpiredError':
        res.status(401).json({ message });
        return;
      case 'JsonWebTokenError':
        res.status(400).json({ message });
        return;
      case 'NotBeforeError':
        res.status(403).json({ message });
        return;
      default:
        res.status(500).json({ message });
    }
  }
};
