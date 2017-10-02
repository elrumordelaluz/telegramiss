const fs = require('fs')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
})
const geocoder = NodeGeocoder({ provider: 'google' })

const tmp = require('tmp')

bot.on('text', msg => {
  const points = []
  fetch('http://api.open-notify.org/iss-now.json')
    .then(res => res.json())
    .then(({ iss_position: { latitude, longitude }, timestamp }) => {
      console.log({ latitude, longitude })
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process
          .env.GMAPS_API_KEY}`
      )
        .then(res => res.json())
        .then(places => console.log(places))
      fetch(
        `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&size=600x300&zoom=5&maptype=hybrid&key=${process
          .env.GMAPS_API_KEY}`
      )
        .then(res => {
          return res.buffer()
        })
        .then(buffer => {
          tmp.file((err, path, fd, cleanupCallback) => {
            if (err) throw err

            fs.writeFile(path, buffer, err => {
              if (err) {
                console.log(err)
              }
              bot.sendPhoto(msg.chat.id, path).then(() => cleanupCallback())
            })
          })
        })
    })
})
