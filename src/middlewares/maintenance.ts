import { RequestHandler } from 'express';
import { MAINTENANCE_MODE } from '../config';

const maintenance: RequestHandler = (req, res, next) => {
  if (MAINTENANCE_MODE) {
    return res.status(503).json({
      message: 'Service unavailable, please try again later'
    });
  }
  next();
};

export default maintenance;
