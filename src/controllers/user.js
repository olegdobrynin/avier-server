import { hash, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op, ForeignKeyConstraintError } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';

const { Mark, User } = models;

const generateJwt = (id, login, role) => jwt.sign(
  { id, login, role },
  process.env.SECRET_KEY,
  { expiresIn: '7d' },
);

export default class UserController {
  static async registration(req, res, next) {
    try {
      const { login, password } = req.body;
      if (!login) {
        next(new ApiError('Введите логин', 400));
        return;
      }
      const candidate = await User.findOne({ where: { login: { [Op.iLike]: login } } });
      if (candidate) {
        next(new ApiError('Такой логин уже зарегистрирован', 400));
        return;
      }
      if (password.length < 8) {
        next(new ApiError('Введите пароль длиннее 8 символов', 400));
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

  static async check(_req, res, next) {
    try {
      const { id, login, role } = res.locals.user;
      const token = generateJwt(id, login, role);

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(Number(id), { rejectOnEmpty: true });

      await sequelize.transaction(async (transaction) => {
        await user.destroy({ transaction });

        res.sendStatus(204);
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        next(new ApiError('Невозможно удалить пользователя с художниками!', 400));
        return;
      }
      next(error);
    }
  }
}
