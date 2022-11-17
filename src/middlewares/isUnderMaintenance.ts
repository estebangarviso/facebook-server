import { RequestHandler } from "express";
import { MAINTENANCE_MODE, MAINTENANCE_MODE_WHITELIST_IPS } from "~/config";

const isUnderMaintenance: RequestHandler = (req, res, next) => {
  if (MAINTENANCE_MODE && !MAINTENANCE_MODE_WHITELIST_IPS.includes(req.ip)) {
    return res.status(503).json({
      message: "Service unavailable, please try again later",
    });
  }
  next();
};

export default isUnderMaintenance;
