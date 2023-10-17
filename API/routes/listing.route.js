import express from "express";
import {
  UpdateListing,
  createListing,
  deleteListing,
  getListing,
  getListings,
} from "../controllers/listhin.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, UpdateListing);

router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
