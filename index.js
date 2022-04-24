const { fetchMyIP } = require("./iss");
const { fetchCoordsByIP } = require("./iss");
const { fetchISSFlyOverTimes } = require("./iss");
const { nextISSTimesForMyLocation } = require("./iss");

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned IP:', ip);

// });

// fetchCoordsByIP('70.67.230.214', (error, coordinates) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked! Returned geo-coordinates:", coordinates);

// });

// fetchISSFlyOverTimes({ latitude: '48.4574', longitude: '-123.3436' }, (error, passTimes) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked! Returned flyover times:", passTimes);

// });

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
  }

  const unixTimestamp = passTimes.risetime;
  const milliseconds = unixTimestamp * 1000;
  const date = new Date(milliseconds);
  const dateStr = date.toGMTString();
  console.log(dateStr)

  console.log(`Next pass at ${dateStr}-0700 (Pacific Daylight Time) for ${passTimes.duration} seconds!`);
});
//this should be separated out into a call and a printing function that nextISS also calls.
//also fix date print out! which method to use on date object