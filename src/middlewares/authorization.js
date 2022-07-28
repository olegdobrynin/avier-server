import jwt from 'jsonwebtoken';

export default (level) => (req, res, next) => {
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
    const { id, login, role } = jwt.verify(token, process.env.SECRET_KEY);
    res.locals.user = { id, login, role };
    switch (level) {
      case 1:
        if (role === 'admin') {
          next();
          return;
        }
        break;
      case 2:
        if (['admin', 'artist'].includes(role)) {
          next();
          return;
        }
        break;
      default:
        next();
        return;
    }
    res.sendStatus(403);
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
