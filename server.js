const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static('./public'))

app.set('view engine', 'hbs')
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/search', (req, res) => {
    let airports = JSON.parse(fs.readFileSync('./public/airports.json'))
    let filterAirports = function (airport) {
        if (airport.name === req.query.q) {
            return true
        }
        if (airport.city === req.query.q) {
            return true
        }
        if (airport.code === req.query.q) {
            return true
        }
        return false
    }
    let result = airports.filter(filterAirports)
    res.send(result)
})

app.post('/delete', (req, res) => {
    let airports = JSON.parse(fs.readFileSync('./public/airports.json'))
    let result = airports.filter(airport => airport.code !== req.body.airportId)
    fs.writeFileSync('./public/airports.json', JSON.stringify(result), (err) => {
        if (err) {
            console.log(err)
        }
    })
    res.send(result)
})

app.get('/edit/:id', (req, res) => {
    let airports = JSON.parse(fs.readFileSync('./public/airports.json'))
    let result = airports.filter(airport => airport.code === req.params.id)
    res.render('edit', { airport: result[0] })
})

app.post('/edit/:id', (req, res) => {
    let airports = JSON.parse(fs.readFileSync('./public/airports.json'))
    let updatedAirports = airports
    for (let i = 0; i < updatedAirports.length; i++) {
        if (updatedAirports[i].code === req.body.code) {
            updatedAirports[i].name = req.body.name
            updatedAirports[i].city = req.body.city
            updatedAirports[i].country_code = req.body.country_code
        }
    }
    fs.writeFileSync('./public/airports.json', JSON.stringify(updatedAirports), (err) => {
        if (err) {
            console.log(err)
            return res.render('index', { error: "Please try again later" })
        }
    })

    res.render('index', { message: "Saved Changes" })

})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {
    let airports = JSON.parse(fs.readFileSync('./public/airports.json'))
    let newAirport = {}
    newAirport.name = req.body.name.trim()
    newAirport.code = req.body.code.trim()
    newAirport.city = req.body.city.trim()
    newAirport.country_code = req.body.country_code.trim()

    for(let i = 0; i < airports.length; i++) {
        if(airports[i].name === newAirport.name) {
            return res.render('add', {error: "This Airport name exists."})
        }

        if(airports[i].code === newAirport.code) {
            return res.render('add', {error: "This Airport code exists."})
        }

    }

    airports.push(newAirport)

    fs.writeFileSync('./public/airports.json', JSON.stringify(airports), (err) => {
        if (err) {
            console.log(err)
            return res.render('index', { error: "Please try again later" })
        }
    })

    res.render('index' ,{message: "New Airport Added"})
})
app.listen(3838, () => {
    console.log('Server started')
})