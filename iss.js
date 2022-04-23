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

// const ip = '70.67.230.214'

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





module.exports = { fetchMyIP, fetchCoordsByIP };