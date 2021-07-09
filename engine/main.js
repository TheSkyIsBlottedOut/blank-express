const responseFor = (hash) => {
  var exthash = hash
  if (!exthash.template) exthash.template = 'index'
  if (!exthash.content) exthash.content = {}
  return () => { return exthash }
}


module.exports = {  
    main: { index: responseFor({}) }

  
  

}