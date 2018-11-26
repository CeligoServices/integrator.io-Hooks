/*
* preSavePageFunction stub:
*
* This funtion takes the email address of a contact and puts it in an easy to map location called email.
*
* The function will be passed one ‘options’ argument that has the following structure: { data: [], errors: [], settings: {}, configuration: {} }
*   ‘data’ - an array of records representing one page of data.  An individual record can be an object {}, or an array [] depending on the data source.
*   ‘errors’ - an array of errors where each error has the structure {code: '', message: '', source: ‘’}.
*   ‘settings’ - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*   ‘configuration’ - an optional configuration object that can be set directly on the export resource (to further customize the hooks behavior).
*
* The function needs to return an object that has the following structure: { data: [], errors: [{code: ‘’, message: ‘’, source: ‘’}] }
*   'data' -  your modified data.
*   'errors' - your modified errors.
* Throwing an exception will signal a fatal error and stop the flow.
*/

function preSavePageFunction (options) {
// sample code that simply passes on what has been exported
  for(var i=0; i < options.data.length; i++){
    if(!options.data[i]['identity-profiles'] || options.data[i]['identity-profiles'].length < 1){
      break;
    }
    
    var emailFound = false;
    for(var j=0; j < options.data[i]['identity-profiles'].length; j++){
      if(options.data[i]['identity-profiles'][j].identities){
        for(var k=0; k < options.data[i]['identity-profiles'][j].identities.length; k++){
          if(!options.data[i]['identity-profiles'][j].identities[k].type == "EMAIL")
            continue;
          
          options.data[i].email = options.data[i]['identity-profiles'][j].identities[k].value;
          emailFound = true;
          break;
        }
      }
      if(emailFound)
        break;
    }
  }
  return {
    data: options.data,
    errors: options.errors
  }
}
