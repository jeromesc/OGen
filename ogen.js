var http = require('http')
var map = require('through2-map')
var url = require('url')

var objectDefinition = {
  'objectName': 'simpleObject',
  'attributes': [
    {
      'name':'simpleInteger',
      'type':'integer',
      'options': {'min': 1, 'max': 10}
    },
    {
      'name':'simpleDate',
      'type':'date',
      'options': {'min': '12-12-2012', 'max': '12-12-2014'}
    },
    {
      'name':'simpleString',
      'type':'string',
      'options': {'min': 6, 'max': 24}
    },
    {
      'name':'simpleDecimal',
      'type':'decimal',
      'options': {'min': 0.1, 'max': 0.9}
    }
  ]
}

function generateInteger(options) {
  return Math.floor( ( Math.random() * options.max ) + options.min );
}

function generateString(options) {
  var len = options.max - options.min;
  var str = '';
  var i = 0;

  for(i=0; i < len; i++) {
    str += String.fromCharCode(Math.floor(Math.random()*26) + 97); //'a'.charCodeAt(0));
  }
  return str;
}

function generateDecimal(options) {
  return ( Math.random() * options.max ) + options.min
}

function generateDate(options) {
  return new Date(new Date(options.min).getTime() + Math.random() * (new Date(options.max).getTime() - new Date(options.min).getTime()));
}

function generateObject(objectDefinition) {
  var object = {};
  objectDefinition.attributes.forEach( function(attribute) {
    switch (attribute.type) {
      case "integer":
        object[attribute.name] = generateInteger(attribute.options);
        break;
      case "string":
        object[attribute.name] = generateString(attribute.options);
        break;
      case "decimal":
        object[attribute.name] = generateDecimal(attribute.options);
        break;
      case "date":
        object[attribute.name] = generateDate(attribute.options);
        break;
    }
  });
  return object;
}

var server = http.createServer(function(request, response) {

  var parsedUrl = url.parse(request.url, true);

  response.writeHead(200, {'Content-Type' : 'application/json'})
  
  if (parsedUrl.pathname == '/ogen') {
  
    response.write(JSON.stringify(generateObject(objectDefinition)));
  
  }
  
  response.end();
  
});

server.listen(8000);
