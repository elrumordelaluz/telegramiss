const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const NodeGeocoder = require('node-geocoder')
const geolib = require('geolib')
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
})
const geocoder = NodeGeocoder({ provider: 'google' })

bot.on('text', msg => {
  const points = []
  fetch('http://api.open-notify.org/iss-now.json')
    .then(res => res.json())
    .then(({ iss_position: { latitude: lat, longitude: lng }, timestamp }) => {
      points.push({ lat, lng, timestamp })
      geocoder.reverse({ lat, lon: lng }, (err, res) => {
        console.log(res, 0)
      })
      setTimeout(() => {
        fetch('http://api.open-notify.org/iss-now.json')
          .then(res => res.json())
          .then(
            ({ iss_position: { latitude: lat, longitude: lng }, timestamp }) => {
              points.push({ lat, lng, timestamp })
              geocoder.reverse({ lat, lon: lng }, (err, res) => {
                console.log(res, 1)
              })
              console.log(
                geolib.getSpeed(
                  {
                    lat: points[0].lat,
                    lng: points[0].lat,
                    time: points[0].timestamp,
                  },
                  {
                    lat: points[1].lat,
                    lng: points[1].lat,
                    time: points[1].timestamp,
                  },
                  {unit: 'kmh'}
                ), points
              )
            }
          )
      }, 1000)
    })
})
