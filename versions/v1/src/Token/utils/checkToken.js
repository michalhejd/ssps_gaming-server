import express from "express";
import jwt from "jsonwebtoken";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";

const router = express.Router();
router.use(async (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, process.env.JWT, (err, decoded) => {
        if (err) {
          throw next(new Error(responseErrors.token_unauthorized));
        }
        req.user = decoded._id;
        next();
      });
    } else {
      next();
    }
});

export default router;