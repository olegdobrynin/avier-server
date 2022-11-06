import { hash, compareSync } from 'bcrypt';
import { Op, ForeignKeyConstraintError } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';

const { User } = models;

export default class UserController {
  static async registration(req, reply) {
    const { login, password } = req.body;
    if (!login) {
      throw new ApiError({ message: 'Введите логин' });
    }
    const candidate = await User.findOne({ where: { login: { [Op.iLike]: login } } });
    if (candidate) {
      throw new ApiError({ message: 'Такой логин уже зарегистрирован' });
    }
    if (password.length < 8) {
      throw new ApiError({ message: 'Введите пароль длиннее 8 символов' });
    }
    const hashPassword = await hash(password, 5);
    return sequelize.transaction(async (transaction) => {
      const user = await User.create(
        { login, password: hashPassword },
        { returning: ['id', 'login', 'role'], transaction },
      );

      const payload = { id: user.id, login, role: user.role };
      const token = await reply.jwtSign(payload, { expiresIn: '7d' });

      reply.code(201);
      return { user, token };
    });
  }

  static async login(req, reply) {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });
    if (!user) {
      throw new ApiError({ message: 'Пользователь не найден' });
    }
    const comparePassword = compareSync(password, user.password);
    if (!comparePassword) {
      throw new ApiError({ message: 'Пароль не верный' });
    }
    const payload = { id: user.id, login, role: user.role };
    const token = await reply.jwtSign(payload, { expiresIn: '7d' });

    return { user, token };
  }

  static async check(req, reply) {
    const { user } = req;
    const token = await reply.jwtSign(user, { expiresIn: '7d' });

    return { user, token };
  }

  static async changeRole(req, reply) {
    const { login, role } = req.body;
    await User.update({ role }, { where: { login }, fields: ['role'] });

    reply.code(204);
  }

  static async delete(req, reply) {
    try {
      const { id: userId, role } = req.user;
      const { id } = req.params;
      if (id !== userId && role !== 'admin') {
        throw new ApiError({ status: 403 });
      }
      const user = await User.findByPk(id, { rejectOnEmpty: true });
      await user.destroy();

      reply.code(204);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new ApiError({ message: 'Невозможно удалить пользователя с художниками!' });
      }
      throw error;
    }
  }
}
