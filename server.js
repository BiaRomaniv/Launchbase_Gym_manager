const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const methodOverride = require('method-override')
const server = express()

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true })) // RESPONSAVEL POR FUNCIONAR O REQ BODY
server.use(methodOverride('_method')) // a ordem importa para que ele subescreva os dados
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})



server.listen(5000, function() {
    console.log("server is running")
})