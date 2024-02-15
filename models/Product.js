import mongoose from "mongoose";

// create schema
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
    },
    productType: {
      type: String,
      enum: ["simple", "variable", "group", "external"],
      // required: true,
    },
    productSimple: {
      regularPrice: {
        type: Number,
        // required: true,
      },
      salePrice: {
        type: Number,
      },
      productPhoto: {
        type: [String],
        // required: true,
      },
      stock: {
        type: Number,
        default: 0,
      },
    },
    productVariable: [
      {
        size: {
          type: String,
          default: null,
        },
        colors: {
          type: String,
          default: null,
        },
        regularPrice: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
        },
        productPhoto: {
          type: [String],
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    productGroup: [
      {
        name: {
          type: String,
          required: true,
        },
        regularPrice: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
        },
        productPhoto: {
          type: [String],
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    productExternal: {
      regularPrice: {
        type: Number,
        // required: true,
      },
      salePrice: {
        type: Number,
      },
      productPhoto: {
        type: [String],
        // required: true,
      },
      stock: {
        type: Number,
        default: 0,
      },
      link : {
        type : String,
        trim : true,
        // required : true
      }
    },
    shortDesc: {
      type: String,
      required: true,
    },
    longDesc: {
      type: String,
      required: true,
    },
    specification: {
      type: String,
      trim: true,
    },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Reviews",
      default : null
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      // required: true,
    },
    tag: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tag",
      // required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      // required: true,
    },
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
export default mongoose.model("Product", ProductSchema);
