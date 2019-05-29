
/*
* postSubmitFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one ‘options’ argument that has the following structure: { preMapData: [], postMapData: [], responseData: [], settings: {}, configuration: {} }
*  ‘preMapData’ - an array of records representing the page of data before it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*  ‘postMapData’ - an array of records representing the page of data after it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*  ‘responseData’ - an array of responses for the page of data that was submitted to the import application.  An individual response will have the following structure: { statusCode: 200/422/403, errors: [], ignored: true/false, id: ‘’, _json: {}, dataURI: ‘’ }
*    ‘statusCode’ - 200 is a success.  422 is a data error.  403 means the connection went offline (typically due to an authentication or incorrect password issue).
*    ‘errors’ - [{code: '', message: '', source: ‘’}]
*    ‘ignored’ - true if the record was filtered/skipped, false otherwise.
*    ‘id’ - the id from the import application response.
*    ‘_json’ - the complete response data from the import application.
*    ‘dataURI’ - if possible, a URI for the data in the import application (populated only for errored records).
*  ‘settings’ - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*  ‘configuration’ - an optional configuration object that can be set directly on the import resource (to further customize the hooks behavior).
*
* The function needs to return the responseData array provided by options.responseData. The length of the responseData array MUST remain unchanged.  Elements within the responseData array can be modified to enhance error messages, modify the complete _json response data, etc...
* Throwing an exception will fail the entire page of records.
*/
function postSubmitFunction(options) {
  for(var rec = 0; rec < options.responseData.length; rec++){
    if(!options.responseData[rec].errors)
      continue;

    for( var i = 0; i < options.responseData[rec].errors.length; i++){
      if(options.responseData[rec].errors[i].source != 'netsuite'){
        continue;
      }
      if(options.responseData[rec].errors[i].message.endsWith('the order is already closed.')){
        /* Use this option to ignore the error
        options.responseData[rec].errors.splice(i,1);
        i--;
        */
  
        //Use this option to extend the error message
        options.responseData[rec].errors[i].message = "Original Error: " + options.responseData[rec].errors[i].message + " This error usually means that the sales order has already been fufilled or cancelled in NetSuite.";
      }
    }
      
  }
  return options.responseData;
}