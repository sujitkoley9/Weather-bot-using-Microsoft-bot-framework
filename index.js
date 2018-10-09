require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var weatherClient = require('./wunderground-client');

// Setup Restify Server
var server = restify.createServer();


server.listen(process.env.port, function () {
    console.log('%s listening to %s', server.name, server.url);
});



// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID1,
    appPassword: process.env.MICROSOFT_APP_PASSWORD1
});

server.post('/api/messages', connector.listen());


var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('Sorry, I did not understand. You said: %s  .', session.message.text);
});

bot.set('storage', inMemoryStorage);

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);
// insert intent handlers here



bot.dialog('Greeting', [
    function (session) {
            session.send("Hi , How can I help you");
        }


]).triggerAction({
    matches: 'Greeting'
});

bot.dialog('test', [
    function (session, args, next)  {
        var locationEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Weather.Location');
        if (locationEntity) {
            return next({ response: locationEntity.entity });
        } else {
            builder.Prompts.text(session, 'What location?');
        }
    },
    function (session, results) {
        weatherClient.getCurrentWeather(results.response, function  (responseString) {
            session.send(responseString);
        });
    }
]).triggerAction({
    matches: 'Weather.GetCondition'
})
;


