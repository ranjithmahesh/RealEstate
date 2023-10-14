import Listing from "../models/listing.modle.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delet your own listing!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("listing has been deleted");
  } catch (error) {
    next(error);
  }
};
