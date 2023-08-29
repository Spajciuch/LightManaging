const express = require('express')
const app = express()
const http = require("http")
const port = 3000

const bodyparser = require(`body-parser`)
const path = require(`path`)

const fs = require("fs")

const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const { set } = require("./serialCommunicator")

require(`dotenv`).config()

let states = {
  u: true,
  d: false
}

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.engine(`html`, require(`ejs`).renderFile)

const renderTemplate = (res, req, plik, data = {}, status = 200) => {
  res.status(status).render(path.resolve(plik), Object.assign(data))
}

app.get('/', (req, res) => {
  renderTemplate(res, req, __dirname + `/views/index.ejs`)
})

app.get('/preset', (req, res) => {
  renderTemplate(res, req, __dirname + `/views/preset.ejs`)
})


// ======================= SOCKET.IO ============================ //


io.on('connection', (socket) => {
  const list = fs.readFileSync("./database/alarms.json")

  socket.emit("alarmList", JSON.parse(list))

  socket.on("sync", data => {
    let temp_alarms = {}

    for (var i = 0; i <= data.length - 1; i++) {
      if (i == 0) {
        temp_alarms.list = [data[i][0]]
        temp_alarms.switches = [data[i][1]]
      }
      else {
        temp_alarms.list.push(data[i][0])
        temp_alarms.switches.push(data[i][1])
      }
    }

    fs.writeFileSync("./database/alarms.json", JSON.stringify(temp_alarms))
  })
})



// =================================================== //



app.get("/up", (req, res) => {
  set("UP")
  states.u = !states.u
  res.end()
})

app.get("/all", (req, res) => {
  set("ALL")

  states.u = !states.u
  states.d = !states.d

  res.end()
})

app.get("/down", (req, res) => {
  set("DOWN")
  states.d = !states.d
  res.end()
})

app.post('/', (req, res) => {
  const value = Math.floor(Math.random() * 1024)

  if (req.body.buttonUp !== undefined) {
    set("UP")
    states.u = !states.u
  } else if (req.body.buttonMiddle !== undefined) {
    set("ALL")
    states.u = !states.u
    states.d = !states.d
  } else if (req.body.buttonDown !== undefined) {
    set("DOWN")
    states.d = !states.d
  }

  renderTemplate(res, req, __dirname + `/views/index.ejs`)
})

let intervalState = 0

setInterval(function () {
  const data_raw = fs.readFileSync("./database/alarms.json")
  const alarms = JSON.parse(data_raw)

  for (let i = 0; i <= alarms.list.length - 1; i++) {
    const time = alarms.list[i].split(":")

    const alarmHour = time[0]
    const alarmMinutes = time[1]

    if (new Date().getHours() == Number(alarmHour)) {
      if (new Date().getMinutes() == Number(alarmMinutes)) {
        if (alarms.switches[i]) {
          if(states.u == false) {
            states.u = true
            set("UP")
          } 

          if (states.d == false) {
            states.d = true
            set('DOWN')
          }
        }
      }
    }
  }
}, 1000)

server.listen(port, () => {
  console.log(`Dashboard available at: http://localhost:${port}`)
  setTimeout(function () {
    set("DOWN")
    states.d = false
  }, 2000)
})
