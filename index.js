import 'babel-polyfill'
import express    from 'express'
import bodyParser from 'body-parser'
const app     = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const config  = require('./config')
const models = require('./schema')(config)

require('./routes')(app, models)

app.listen(config.express.port, function() {
  console.log('Express server listening on port ' + config.express.port + '.')
})