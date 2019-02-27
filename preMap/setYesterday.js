/*
* preMapFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one ‘options’ argument that has the following structure: { data: [], settings: {}, configuration: {} }
*   ‘data’ - an array of records representing the page of data before it has been mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*   ‘settings’ - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*   ‘configuration’ - an optional configuration object that can be set directly on the import resource (to further customize the hooks behavior).
*
* The function needs to return an array that has the following structure: [ { }, { }, ... ]
* The returned array length MUST match the options.data array length.
* Each element in the array represents the actions that should be taken on the record at that index.
* Each element in the array should have the following structure: { data: {}/[], errors: [{code: ‘’, message: ‘’, source: ‘’}] }
*   'data' - The modified (or unmodified) record that should be passed along for processing.  An individual record can be an object {} or an array [] depending on the data source.
*   'errors' -  Used to report one or more errors for the specific record.  Each error must have the following structure: {code: '', message: '', source: ‘’ }
* Returning an empty object {} for a specific record will indicate to integrator.io that the record should be ignored.
* Returning both 'data' and 'errors' for a specific record will indicate to integrator.io that the record should be processed but errors should also be logged on the job.
* Examples: {}, {data: {}}, {data: []}, {errors: [{code: '', message: '', source: ‘’}]}, {data: {}, errors: [{code: '', message: '', source: ‘’}]}
* Throwing an exception will fail the entire page of records.
*/

function preMapFunction(options) {
  var yd = new Date();
  yd.setDate(yd.getDate() - 1);
  for(var i=0; i<options.data.length; i++){
    if(Array.isArray(options.data[i])){
       options.data[i][0].yesterday = yd;
    }
    else{
	   options.data[i].yesterday = yd;
    }
  }
  return options.data.map((d) => {
    return {
      data: d
    }
  })
}
