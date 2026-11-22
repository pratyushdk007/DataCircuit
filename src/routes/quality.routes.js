import { Router } from "express";

import {
  getAmountQualityProfile
} from "../services/quality.service.js";

const router = Router();

router.get("/profile", async (req, res, next) => {
  try {
    const profile = await getAmountQualityProfile();

    res.status(200).json(profile);

  } catch (error) {
    next(error);
  }
});

export default router;