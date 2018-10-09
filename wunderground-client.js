var restify = require('restify-clients');

var wundergroundClient = restify.createJsonClient({url: 'http://api.openweathermap.org' });

function getCurrentWeather(location,Callback) {
    
    wundergroundClient.get(`/data/2.5/weather?q=${location}&appid=34aade8009f5ee667cfd92947659873a`, function (err, req, res, obj) {
        
        var observation = obj.main;
        
        if (observation) {
            Callback(`It is ${obj.weather[0].description} and ${observation.temp} degrees in ${obj.name}.`);
            
        } 
        else {
            Callback("Couldn't retrieve weather.");
        }
    });
  

}

module.exports = {
    getCurrentWeather: getCurrentWeather
};