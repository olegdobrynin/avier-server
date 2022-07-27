import jwt from 'jsonwebtoken';

export default (...roles) => (req, res, next) => {
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
    const { id, role } = jwt.verify(token, process.env.SECRET_KEY);
    if (roles.includes(role)) {
      res.locals.user = { id, role };
      next();
    } else {
      res.sendStatus(403);
    }
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
