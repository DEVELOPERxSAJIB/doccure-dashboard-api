import mongoose from "mongoose";

// create schema
const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Customer",
    // },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// export default
export default mongoose.model("Review", reviewSchema);
