let HTTPStatus = require("http-status");
let Booking = require("./booking.model").default;

module.exports.createMovieScreen = (req, res) => {
  try {
    //Check screen name already exist or not
    for (var key in req.body.seatInfo) {
      let seatInto = req.body.seatInfo[key];
      // create unreserved tickets array based on ticket counts
      seatInto.unReservedSeats = [
        ...Array(parseInt(seatInto.numberOfSeats)).keys()
      ].map(x => ++x);
      seatInto.reservedSeats = [];
    }
    let screen = Booking.findOne({ name: req.body.name });
    screen.then(data => {
      // If data found update the screen info
      if (data) {
        let update = Booking.findByIdAndUpdate(
          data._id,
          { $set: req.body },
          { new: true }
        );
        update.then(updateddata => {
          return res.status(HTTPStatus.CREATED).json(updateddata);
        });
      }
      // Else create screen info
      else {
        let result = Booking.create(req.body);
        result.then(data => {
          return res.status(HTTPStatus.CREATED).json(data);
        });
      }
    });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

module.exports.reserveScreen = (req, res) => {
  try {
    let screenName = req.params.screenName;
    if (screenName) {
      //getInfo by screenName
      let screenInfo = Booking.findOne({ name: screenName });
      screenInfo.then(data => {
        //if data is empty
        if (!data) {
          return res
            .status(HTTPStatus.BAD_REQUEST)
            .json({ error: true, message: "Screen Not Found" });
        } else {
          // reserve the seats
          for (var key in req.body.seats) {
            let seatInto = data.seatInfo[key];
            if (!seatInto)
              return res.status(HTTPStatus.BAD_REQUEST).json({
                error: true,
                message: `${key} Seat not found in ${data.name} screen`
              });

            req.body.seats[key].forEach((value, index) => {
              seatInto.unReservedSeats = seatInto.unReservedSeats.filter(
                e => e !== value
              );
              seatInto.reservedSeats.push(value);
            });
          }
        }
        //update the reserved and unserved tickets info to the db
        let update = Booking.findByIdAndUpdate(
          data._id,
          { $set: data },
          { new: true }
        );
        update.then(updateddata => {
          return res.status(HTTPStatus.CREATED).json(updateddata);
        });
      });
    } else {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: true, message: "Screen Name is required" });
    }
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

module.exports.getUnservedSeatsByScreen = (req, res) => {
  try {
    let screenName = req.params.screenName;
    let screenTicketStatus = req.query.status;
    let numSeats = req.query.numSeats;
    let choice = req.query.choice;
    // get unreserved or reserved seat info by screen name
    if (screenTicketStatus) {
      let seats = { seats: {} };
      let getUnReservedSeats = Booking.findOne({ name: screenName });
      getUnReservedSeats.then(data => {
        if (!data)
          return res.status(HTTPStatus.BAD_REQUEST).json({
            error: true,
            message: "Screen Info Not Found.. Please Check Screen Name again.."
          });
        for (let key in data.seatInfo) {
          // unreserved tickets seats by row
          if (screenTicketStatus === "unreserved") {
            if (data.seatInfo[key].unReservedSeats.length > 0)
              seats["seats"][key] = data.seatInfo[key].unReservedSeats;
          } else if (screenTicketStatus === "reserved") {
            if (data.seatInfo[key].reservedSeats.length > 0)
              seats["seats"][key] = data.seatInfo[key].reservedSeats;
          }
        }
        //if no unreserved seats found return no seats found
        if (Object.getOwnPropertyNames(seats.seats).length === 0) {
          return res
            .status(HTTPStatus.BAD_REQUEST)
            .json({ error: true, message: "No UnReserved Seats Found" });
        }
        return res.status(HTTPStatus.CREATED).json(seats);
      });
    } else if (numSeats && choice) {
      //split the row name from choice
      let rowName = choice.charAt(0);
      let seatNumber = choice.substr(1);
      let screenInfo = Booking.findOne({ name: screenName });
      screenInfo.then(data => {
        if (!data)
          return res.status(HTTPStatus.BAD_REQUEST).json({
            error: true,
            message: "Screen Info Not Found.. Please Check Screen Name again.."
          });
        //check row valid or not
        let getrow = data.seatInfo[rowName];
        if (!getrow)
          return res
            .status(HTTPStatus.BAD_REQUEST)
            .json({ error: true, message: "Unknown Row.. Please Check Again" });
        //check choice is available
        let isPrimaryChoiceSeatFound = getrow.unReservedSeats.indexOf(
          parseInt(seatNumber)
        );
        if (isPrimaryChoiceSeatFound == -1) {
          return res.status(HTTPStatus.BAD_REQUEST).json({
            error: true,
            message: `We do not have ${numSeats} seats at ${choice}`
          });
        } else {
          //primary choice seat is found...
          let isAvailable = {};
          let startPosition = 0;
          let endPosition = 0;
          let backwardAsileInfo = {};
          let backwardAsileStatus = false;
          let middleAsileInfo = {};
          let middleAsileStatus = false;
          let forwardAsileInfo = {};
          let forwardAsileStatus = false;
          //check available seats forward
          //ex if choice A4 numofseats : 3 result should be A{4,5,6}
          startPosition = parseInt(seatNumber) - 1;
          endPosition = parseInt(seatNumber) - 1 + parseInt(numSeats);
          isAvailable = getrow.unReservedSeats.slice(
            startPosition,
            endPosition
          );
          if (isAvailable.length == numSeats) {
            // available seats found
            // check isAvailable seats is in asile seats or not
            isAvailable.forEach((value, index) => {
              if (index == 0) {
                // do not check first seat for asile
              } else if (index == isAvailable.length - 1) {
                // do not check the last asile seat
              } else {
                // check inside array except first and last for asile seats
                let forwardAsileTest = getrow["aisleSeats"].indexOf(value);
                if (!forwardAsileStatus) {
                  if (forwardAsileTest != -1) {
                    forwardAsileInfo.aisleSeat = `${rowName}${value}`;
                    forwardAsileStatus = true;
                  }
                }
              }
            });

            if (!forwardAsileStatus) {
              let availableSeats = { [rowName]: isAvailable };
              return res.status(HTTPStatus.OK).json({ availableSeats });
            }
          }

          //check available seats middle
          //ex if choice A4 numofSeats : 3 result should be A{3,4,5}
          startPosition = parseInt(seatNumber) - 2;
          endPosition = parseInt(seatNumber) - 2 + parseInt(numSeats);
          isAvailable = getrow.unReservedSeats.slice(
            startPosition,
            endPosition
          );
          if (isAvailable.length == numSeats) {
            // available seats found
            // check isAvailable seats is in asile seats or not
            isAvailable.forEach((value, index) => {
              if (index == 0) {
                // do not check first seat for asile
              } else if (index == isAvailable.length - 1) {
                // do not check the last asile seat
              } else {
                // check inside array except first and last for asile seats
                let middleAsileTest = getrow["aisleSeats"].indexOf(value);
                if (!middleAsileStatus) {
                  if (middleAsileTest != -1) {
                    middleAsileInfo.aisleSeat = `${rowName}${value}`;
                    middleAsileStatus = true;
                  }
                }
              }
            });
            if (!middleAsileStatus) {
              let availableSeats = { [rowName]: isAvailable };
              return res.status(HTTPStatus.OK).json({ availableSeats });
            }
          }
          //check available seats backward
          //ex if choice A4 numOfSeats : 3 result should be A{2,3,4}
          startPosition = parseInt(seatNumber) - 3;
          endPosition = parseInt(seatNumber) - 3 + parseInt(numSeats);
          isAvailable = getrow.unReservedSeats.slice(
            startPosition,
            endPosition
          );
          if (isAvailable.length == numSeats) {
            // available seats found
            // check isAvailable seats is in asile seats or not
            isAvailable.forEach((value, index) => {
              if (index == 0) {
                // do not check first seat for asile
              } else if (index == isAvailable.length - 1) {
                // do not check the last asile seat
              } else {
                // check inside array except first and last for asile seats
                let backwardAsileTest = getrow["aisleSeats"].indexOf(value);
                if (!backwardAsileStatus) {
                  if (backwardAsileTest != -1) {
                    backwardAsileInfo.aisleSeat = `${rowName}${value}`;
                    backwardAsileStatus = true;
                  }
                }
              }
            });
            if (!backwardAsileStatus) {
              let availableSeats = { [rowName]: isAvailable };
              return res.status(HTTPStatus.OK).json({ availableSeats });
            }
          }
          if (forwardAsileInfo) {
            return res.status(HTTPStatus.OK).json({
              error: true,
              message: `we do not have ${numSeats} continious seats for the user (${
                forwardAsileInfo.aisleSeat
              }) is an isle seat`
            });
          }
          if (middleAsileInfo) {
            return res.status(HTTPStatus.OK).json({
              error: true,
              message: `we do not have ${numSeats} continious seats for the user (${
                middleAsileInfo.aisleSeat
              }) is an isle seat`
            });
          }
          if (backwardAsileStatus) {
            return res.status(HTTPStatus.OK).json({
              error: true,
              message: `We do not have ${numSeats} continious seats for the user (${
                backwardAsileInfo.aisleSeat
              } is an isle seat)`
            });
          }
        }
      });
    }
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};
