const path          = require('path')
const express       = require('express')
const stylus        = require('express-stylus')
const nib           = require('nib')

global.paths = { 
  root: path.dirname(path.resolve(__filename)),
  for: (p) => global.paths.root + '/' + p
}


// Set up express
const app = express()
app.set('view engine', 'pug')
app.set('views', global.paths.for('views'))
app.use(stylus({
  src: global.paths.for('public/styles'),
  use: [nib()],
  import: ['nib'],
  paths: [ global.paths.for('public/styles') ]
}))

const modules = require(global.paths.for('engine/main.js'))

// Set up app
const loadModule = (req, res, next) => {
  let cfg = {request: req}
  cfg.module_name     = req.module || 'main'
  cfg.action_name     = req.action || 'index'
  cfg.contenttype     = req.format || 'html'
  content = modules[cfg.module_name][cfg.action_name](cfg)
  if (!content.template) content.template = 'index'
  if (!content.body_class) content.body_class = `page-${cfg.module_name}-${cfg.action_name}`
  res.render(`${content.template}.${cfg.contenttype}.pug`, content)
}


app.get('/:module/:action.:format', loadModule)
app.get('/:module/:action', loadModule)
app.get('/:module', loadModule)
app.get('/', loadModule)
app.use(express.static(global.paths.for('public')))
app.listen(3000, () => {
  console.log('listening on 3000')
})