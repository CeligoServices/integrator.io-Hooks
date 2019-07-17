
function removeQuotes (obj) {
  for(var f in obj){
    obj[f] = obj[f].replace(/\"/g, "");
  }
  return obj;
}

function preSavePageFunction (options) {
// sample code that simply passes on what has been exported
  for(var i=0; i<options.data.length; i++){
    for(var j=0; j<options.data[i].length; j++){
      options.data[i][j] = removeQuotes(options.data[i][j]);
    }
  }
  return {
    data: options.data,
    errors: options.errors
  }
}