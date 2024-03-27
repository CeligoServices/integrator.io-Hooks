/*
* postSubmitFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one ‘options’ argument that has the following fields:
*  ‘preMapData’ - an array of records representing the page of data before it was mapped.  A record can be an object {} or array [] depending on the data source.
*  ‘postMapData’ - an array of records representing the page of data after it was mapped.  A record can be an object {} or array [] depending on the data source.
*  ‘responseData’ - an array of responses for the page of data that was submitted to the import application.  An individual response will have the following fields:
*    ‘statusCode’ - 200 is a success.  422 is a data error.  403 means the connection went offline.
*    ‘errors’ - [{code: '', message: '', source: ‘’}]
*    ‘ignored’ - true if the record was filtered/skipped, false otherwise.
*    ‘id’ - the id from the import application response.
*    ‘_json’ - the complete response data from the import application.
*    ‘dataURI’ - if possible, a URI for the data in the import application (populated only for errored records).
*  '_importId' - the _importId currently running.
*  '_connectionId' - the _connectionId currently running.
*  '_flowId' - the _flowId currently running.
*  '_integrationId' - the _integrationId currently running.
*  'settings' - all custom settings in scope for the import currently running.
*
* The function needs to return the responseData array provided by options.responseData. The length of the responseData array MUST remain unchanged.  Elements within the responseData array can be modified to enhance error messages, modify the complete _json response data, etc...
* Throwing an exception will fail the entire page of records.
*/
import { exports } from 'integrator-api';

function postSubmit (options) {
  
  let delayExport = {
    "_connectionId": "<IO Connection ID>",
    "http": {
      "relativeURI": "/netsuite/v1/sleep/100",
      "method": "GET"
    }
  }
  
  try {
    //console.log('Start: ' + Math.floor((new Date()).getTime() / 1000));
    let response = exports.runVirtual( { export: delayExport } );
    response = exports.runVirtual( { export: delayExport } );
    //console.log('End: ' + Math.floor((new Date()).getTime() / 1000));
  }
  catch (e) {
    console.log('Error: ' + JSON.stringify(e));
  }
  
  return options.responseData;
}