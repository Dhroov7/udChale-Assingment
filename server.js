const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static('./public'))

app.set('view engine', 'hbs')
app.get('/', (req,res) => {
    res.render('index')
})

app.get('/search', (req,res) => {
    let airports = JSON.parse(fs.readFileSync('./public/airports.json'))
    let filterAirports = function(airport) {
        if(airport.name === req.query.q) {
            return true
        }
        if(airport.city === req.query.q) {
            return true
        }
        if(airport.code === req.query.q) {
            return true
        }
        return false
    }
    let result = airports.filter(filterAirports)
    res.send(result)
})

app.post('/delete', (req,res) => {
    let airports = JSON.parse(fs.readFileSync('./public/airports.json'))
    let result = airports.filter(airport => airport.code !== req.body.airportId)
    fs.writeFileSync('./public/airports.json', JSON.stringify(result), (err) => {
        if(err) {
            console.log(err)
        }
    })
    res.send(result)
})

app.listen(3838, () => {
    console.log('Server started')
})