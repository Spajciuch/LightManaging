const express = require('express')
const app = express()
const port = 3000

const bodyparser = require("body-parser")
const path = require("path")
const firebase = require("firebase")

const firebaseConfig = {
  // YOUR CONFIG
}

firebase.initializeApp(firebaseConfig)

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.engine("html", require("ejs").renderFile)

const renderTemplate = (res, req, plik, data = {}, status = 200) => {
  res.status(status).render(path.resolve(plik), Object.assign(data))
}

const { database } = require("firebase")

app.get('/', (req, res) => {
  renderTemplate(res, req, __dirname + "/views/index.ejs")
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

  renderTemplate(res, req, __dirname + "/views/index.ejs")  
})
