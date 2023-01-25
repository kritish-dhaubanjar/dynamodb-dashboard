import { Router } from "express";

import itemRoutes from "./routes/item.routes";
import tableRoutes from "./routes/table.routes";
import databaseRoutes from "./routes/database.routes";

const router = Router();

router.use("/tables", tableRoutes);
router.use("/tables", itemRoutes);
router.use("/database", databaseRoutes);

export default router;
