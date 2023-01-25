import { Router } from "express";
import * as DatabaseController from "../controllers/database.controller";
import { validateAll, validateRestore } from '../validators/database.validators.js';

const router = Router();

router.post("/tables", [validateAll], DatabaseController.index);
router.post("/restore", [validateRestore], DatabaseController.restore);

export default router;
