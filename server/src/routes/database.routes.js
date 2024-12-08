import { Router } from "express";
import * as DatabaseController from "../controllers/database.controller";
import { validateAll, validateRestore } from "../validators/database.validators";

const router = Router();

router.put("/connect", [validateAll], DatabaseController.connect);
router.put("/disconnect", DatabaseController.disconnect);
router.post("/tables", [validateAll], DatabaseController.index);
router.post("/restore/:uid", [validateRestore], DatabaseController.restore);
router.get("/stream/:uid", [], DatabaseController.stream);

export default router;
