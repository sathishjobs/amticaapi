
let mongoose = require("mongoose");

const TicketsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Screen Name is required"]
    },
    seatInfo: {}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);


module.exports.default = mongoose.model("Booking", TicketsSchema);


