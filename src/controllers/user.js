import { hash, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

const { Artist, Mark, User } = models;

const generateJwt = (id, login, role) => jwt.sign(
  { id, login, role },
  process.env.SECRET_KEY,
  { expiresIn: '24h' },
);

export default class UserController {
  static async registration(req, res, next) {
    try {
      const { login, password, role } = req.body;
      if (!login || !password) {
        next(new ApiError({ message: 'Неккоректный логин или пароль' }, 404));
        return;
      }
      const candidate = await User.findOne({ where: { login: { [Op.iLike]: login } } });
      if (candidate) {
        next(new ApiError({ message: 'Такой логин уже зарегистрирован' }, 404));
        return;
      }
      const hashPassword = await hash(password, 5);
      await sequelize.transaction(async (transaction) => {
        const user = await User.create(
          { login, role, password: hashPassword },
          { returning: ['id', 'login', 'role'], transaction },
        );
        await Mark.create({ user_id: user.id }, { returning: false, transaction });

        const token = generateJwt(user.id, user.login, user.role);
        res.json({ token });
      });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ where: { login } });
      if (!user) {
        next(new ApiError({ message: 'Пользователь не найден' }, 500));
        return;
      }
      const comparePassword = compareSync(password, user.password);
      if (!comparePassword) {
        next(new ApiError({ message: 'Пароль не верный' }, 500));
        return;
      }
      const token = generateJwt(user.id, user.login, user.role);

      res.json({ token });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async check(req, res, next) {
    try {
      const { id, login, role } = req.user;
      const token = generateJwt(id, login, role);

      res.json({ token });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async info(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        attributes: ['login'],
        include: { model: Artist, as: 'artists', attributes: ['id', 'name', 'img'] },
      });

      if (user) {
        res.json(user);
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }
}
