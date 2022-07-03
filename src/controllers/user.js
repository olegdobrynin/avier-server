import { hash, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op, ForeignKeyConstraintError } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

const { Artist, Mark, User } = models;

const generateJwt = (id, login, role) => jwt.sign(
  { id, login, role },
  process.env.SECRET_KEY,
  { expiresIn: '15m' },
);

export default class UserController {
  static async registration(req, res, next) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        next(new ApiError('Неккоректный логин или пароль', 400));
        return;
      }
      const candidate = await User.findOne({ where: { login: { [Op.iLike]: login } } });
      if (candidate) {
        next(new ApiError('Такой логин уже зарегистрирован', 400));
        return;
      }
      const hashPassword = await hash(password, 5);
      await sequelize.transaction(async (transaction) => {
        const user = await User.create(
          { login, password: hashPassword },
          { returning: ['id', 'login', 'role'], transaction },
        );
        await Mark.create({ user_id: user.id }, { returning: false, transaction });

        const token = generateJwt(user.id, user.login, user.role);
        res.json({ token });
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ where: { login } });
      if (!user) {
        next(new ApiError('Пользователь не найден', 400));
        return;
      }
      const comparePassword = compareSync(password, user.password);
      if (!comparePassword) {
        next(new ApiError('Пароль не верный', 400));
        return;
      }
      const token = generateJwt(user.id, user.login, user.role);

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  static async check(req, res, next) {
    try {
      const { id, login, role } = req.user;
      const token = generateJwt(id, login, role);

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  static async info(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['login'],
        include: { ...Artist.getModel('id', 'name', 'img'), through: undefined },
      });

      if (user) {
        res.json(user);
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await User.findByPk(Number(id))
        .then((user) => user.destroy())
        .then(() => res.sendStatus(204))
        .catch((error) => (error instanceof ForeignKeyConstraintError
          ? next(new ApiError('Невозможно удалить пользователя с художниками!', 400))
          : next(error)
        ));
    } catch (error) {
      next(error);
    }
  }
}
