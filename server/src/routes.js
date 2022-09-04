import { Router } from "express";

import itemRoutes from "./routes/item.routes";
import tableRoutes from "./routes/table.routes";

const router = Router();

router.use("/tables", tableRoutes);
router.use("/tables", itemRoutes);

export default router;
