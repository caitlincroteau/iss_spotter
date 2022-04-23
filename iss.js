/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

// use request to fetch IP address from JSON API
const fetchMyIP = function(callback) {
  const url = "https://api.ipify.org?format=json";

  request(url, (error, response, body) => {
    //error if invalid domain, user is offline etc.
    if (error) {
      callback(error, null);
      return;
    }
    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

//output ip:'70.67.230.214',

//fetch geo coordinatates

const fetchCoordsByIP = function(ip, callback) {

  const url = "https://api.freegeoip.app/json/" + ip + "?apikey=db8ecfe0-c29c-11ec-abaa-375097b78fd6";
  
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching geo-coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
    //or can do:
    ////const coords = { latitude: JSON.parse(body).latitude, longitude: JSON.parse(body).longitude };
    //callback(null, coords);
  });
};

//output: { latitude: 48.4574, longitude: -123.3436 }

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {

  const longitude = coords.longitude;
  const latitude = coords.latitude;
  const url =  "https://iss-pass.herokuapp.com/json/?lat=" + latitude + "&lon=" + longitude;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const passes = data.response;
    callback(null, passes);
  });

};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 

 const nextISSTimesForMyLocation = function(callback) {
   fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
  
    //console.log('It worked! Returned IP:', ip);

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error, null);
        return;
      }
    
      //console.log("It worked! Returned geo-coordinates:", coordinates);
      
      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) {
          callback(error, null);
          return;
        }
      
        //console.log("It worked! Returned flyover times:", passTimes);

        for (let pass of passTimes) {
          callback(null, pass);
        }
      
      });
    });
  });
 };  
  

//you do not need to put the callback as constants - why? how does it pull ip, coordinates, and passTimes?


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };