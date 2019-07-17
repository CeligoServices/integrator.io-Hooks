function convertObjToArray(options) {
  var elementName = 'item';
  for(var i=0; i<options.data.length; i++){
    if(Array.isArray(options.data[i][elementName]))
      continue;
    
    var arr = [];
    arr[0] = options.data[i][elementName];
    options.data[i][elementName] = arr;
  }
  return options.data.map((d) => {
    return {
      data: d
    }
  })
}
