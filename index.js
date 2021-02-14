const express = require('express')
const app = express()
const port = 3000

const bodyparser = require(`body-parser`)
const path = require(`path`)
const firebase = require(`firebase`)

require(`dotenv`).config()

const firebaseConfig = {
  apiKey: `${process.env.api}`,
  authDomain: `${process.env.ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.ID}.firebaseio.com`,
  projectId: `${process.env.ID}`,
  storageBucket: `${process.env.ID}.appspot.com`,
  messagingSenderId: `${process.env.SENDER}`,
  appId: `1:${process.env.SENDER}:web:b15a7d98e5833c433c1d9e`
}

firebase.initializeApp(firebaseConfig)

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.engine(`html`, require(`ejs`).renderFile)

const renderTemplate = (res, req, plik, data = {}, status = 200) => {
  res.status(status).render(path.resolve(plik), Object.assign(data))
}

const { database } = require(`firebase`)

app.get('/', (req, res) => {
  renderTemplate(res, req, __dirname + `/views/index.ejs`)
})

app.listen(port, () => {
  console.log(`Dashboard avaible at: http://localhost:${port}`)
})

app.post('/', (req, res) => {
  const value = Math.floor(Math.random() * 1024)

  if (req.body.buttonUp !== undefined) {
    database().ref(`/up`).set({
      value
    })
  } else if (req.body.buttonMiddle !== undefined) {
    database().ref(`/all`).set({
      value
    })
  } else if (req.body.buttonDown !== undefined) {
    database().ref(`/down`).set({
      value
    })
  }

  renderTemplate(res, req, __dirname + `/views/index.ejs`)  
})
