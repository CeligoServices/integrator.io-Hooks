/**
This PreMap integrator.io hook will check a certain property in the data coming into the import and convert it to an array if it isn't already an array.
*/
function convertObjToArray(options) {
  var elementName = 'item';  //Change item to be the name of the property that holds the items
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
