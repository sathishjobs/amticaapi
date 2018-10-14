let mongoose = require("mongoose");

const TicketsSchema = new TicketsSchema({
    name : {
        type : String,
        required : [true, "Screen Name is required"]
    },
    seatInfo
})