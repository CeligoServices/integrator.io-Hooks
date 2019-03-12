/*
* preSavePageFunction stub:
*
* The name of the function can be changed to anything you like.
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
  var latestDate = null;
  for(var i=0; i< options.data[0].SalesOrderLines.length; i++){
   	for(var j=0; j < options.data[0].SalesOrderLines[i].ScheduleLines.length; j++){
      if(!options.data[0].SalesOrderLines[i].ScheduleLines[j].EstimatedShipDate)
        continue;
    
      var tDate = new Date(options.data[0].SalesOrderLines[i].ScheduleLines[j].EstimatedShipDate);
      if(!latestDate){
          latestDate = tDate;
          continue;
      }
      if(tDate > latestDate)
        latestDate = tDate;
    }
  }
  options.data[0].estDate = latestDate;
  return {
    data: options.data,
    errors: options.errors
  }
}