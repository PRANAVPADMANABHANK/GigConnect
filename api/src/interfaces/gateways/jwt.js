import jwt from "jsonwebtoken";
import createError from "../../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(createError(403, "Token is not valid"));
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};


export const verifyAdminToken = (req, res, next) => {
  const adminToken = req.cookies.adminAccessToken;
  if (!adminToken) return next(createError(401, "Admin token is missing!"));

  jwt.verify(adminToken, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(createError(403, "Admin token is not valid"));
    if (!payload.isAdmin)
      return next(createError(403, "You are not authorized as an admin"));
    
    req.adminId = payload.id;
    next();
  });
};
