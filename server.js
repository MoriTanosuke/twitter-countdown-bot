/* Setting things up. */
var path = require('path'),
    Twit = require('twit'),
    moment = require('moment'),
    fs = require('fs'),
    cron = require('node-cron'),
    express = require('express'),
    config = {
/* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/make-an-image-posting-twitter-bot/#creating-a-twitter-app*/      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter),
    stream = T.stream('statuses/sample');

//TODO make this an array of events and display the next one after today
var eventDates = [
  {
    title: '#Crossfit Open 17.1 #InTheOpen #CrossfitOpen',
    eventDate: moment([2017, 1, 23])
  },
  {
    title: '#Crossfit Open 17.2 #InTheOpen #CrossfitOpen',
    eventDate: moment([2017, 2, 3])
  },
  {
    title: '#Crossfit Open 17.3 #InTheOpen #CrossfitOpen',
    eventDate: moment([2017, 2, 10])
  },
  {
    title: '#Crossfit Open 17.4 #InTheOpen #CrossfitOpen',
    eventDate: moment([2017, 2, 17])
  },
  {
    title: '#Crossfit Open 17.5 #InTheOpen #CrossfitOpen',
    eventDate: moment([2017, 2, 24])
  }
];

function getEvent() {
  for(var i in eventDates) {
    var event = eventDates[i];
    if(event.eventDate.isBefore(moment())) continue;

    return event;
  }
}

function getDays(m) {
  if(m === undefined) return 'infinite days';
  
  var now = moment();
  return m.diff(now, 'days') + ' days';
}

var event = getEvent();
console.log(getDays(event.eventDate) + ' til ' + event.title);

var app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {title: 'Crossfit Countdown Bot', href: 'https://twitter.com/cfcountdownbot', message: getDays() + ' til the #CrossfitOpen'});
});
app.get('/tweet', function(req, res) {
  var event = getEvent();
  if(event !== undefined) {
    var days = getDays(event.eventDate);
    var title = event.title;
    T.post('statuses/update', { status: days + ' til ' + title }, function(err, data, response) {
      if (err){
        console.log('Error!');
        console.log(err);
      } else {
        console.log('Tweeted');
      }
      res.redirect('/')
    });
  } else {
    console.log('No event found');
    res.redirect('/');
  }
});

listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
