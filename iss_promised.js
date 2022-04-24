// iss_promised.js
const request = require('request-promise-native');

const fetchMyIP = function() {
  return request("https://api.ipify.org?format=json");
};
//returns a promise - it doesn't return the ip
//promise could either succeed or fail

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://api.freegeoip.app/json/${ip}?apikey=db8ecfe0-c29c-11ec-abaa-375097b78fd6`);
};
//returns a promise

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};
//returns a promise

const nextISSTimesForMyLocation = function() {
  //the first return bundles 3 promise into 1 promise which is returned
  return fetchMyIP()
  //access the resolve or reject by use .then (resolve of the promise) or .catch for (reject(ion) of the promise)
  //inside .then, the promise is resolved. Inside .then is the result (eg IP).
  .then(fetchCoordsByIP)
  //pass the whole JSON object to fetchCoords returned from fetchMyIP - passing everything inside .then. 
  // see line 10 - accepts the whole body from fetchMyIP, not just ip
  .then(fetchISSFlyOverTimes)
  //again, pass whole body (JSON object) from fetchCoords .then promise to the fetchISS function
  .then((data) => {
    console.log(data)
    const { response } = JSON.parse(data);
    return response;
    //don't want to pass body from fetchISS any further.
  });
};

//module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
module.exports = { nextISSTimesForMyLocation };