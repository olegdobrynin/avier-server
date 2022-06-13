import models from '../models/index.js';
import ApiError from '../errors/ApiError.js';

const { MarkArt } = models;

export default class MarkController {
  static async mark(req, res, next) {
    try {
      const { id } = req.params;
      const { artId } = req.body;
      await MarkArt.create({ mark_id: id, art_id: artId });

      res.status(204).end();
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  async unMark(req, res) {

  }

  async getAll(req, res) {

  }
}
