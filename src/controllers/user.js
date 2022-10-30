import { hash, compareSync } from 'bcrypt';
import { Op, ForeignKeyConstraintError } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';

const { Mark, User } = models;

export default class UserController {
  static async registration(req, reply) {
    const { login, password } = req.body;
    if (!login) {
      throw new ApiError('Введите логин', 400);
    }
    const candidate = await User.findOne({ where: { login: { [Op.iLike]: login } } });
    if (candidate) {
      throw new ApiError('Такой логин уже зарегистрирован', 400);
    }
    if (password.length < 8) {
      throw new ApiError('Введите пароль длиннее 8 символов', 400);
    }
    const hashPassword = await hash(password, 5);
    return sequelize.transaction(async (transaction) => {
      const user = await User.create(
        { login, password: hashPassword },
        { returning: ['id', 'login', 'role'], transaction },
      );
      await Mark.create({ userId: user.id }, { returning: false, transaction });

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
      throw new ApiError('Пользователь не найден', 400);
    }
    const comparePassword = compareSync(password, user.password);
    if (!comparePassword) {
      throw new ApiError('Пароль не верный', 400);
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
        reply.code(403);
        return;
      }
      const user = await User.findByPk(id, { rejectOnEmpty: true });
      await user.destroy();

      reply.code(204);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new ApiError('Невозможно удалить пользователя с художниками!', 400);
      }
      throw error;
    }
  }
}
