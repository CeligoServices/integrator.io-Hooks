/*
* postMapFunction stub:
*
*
* The function will be passed one argument ‘options’ that has the following structure: { preMapData: [], postMapData: [], settings: {}, configuration: {} }
*   ‘preMapData’ - an array of records representing the page of data before it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*   ‘postMapData’ - an array of records representing the page of data after it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*   ‘settings’ - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*   ‘configuration’ - an optional configuration object that can be set directly on the import resource (to further customize the hooks behavior).
*
* This checks if the LocationID value is set, and if not it will copy the value from the LocationName to it.  Your mappings should do a lookup for the LocationID to * prevent duplicates from being created
*/

function setLocationIdIfEmpty(options) {
  for(var i=0; i<options.postMapData.length; i++){
    if(!options.postMapData[i].LocationID){
      options.postMapData[i].LocationID = {
        	"value": options.postMapData[i].LocationName.value
    	};
    }
    if(!options.postMapData[i].LocationID.value){
      options.postMapData[i].LocationID.value = options.postMapData[i].LocationName.value;
    }
      
  }
  return options.postMapData.map((d) => {
    return {
      data: d
    }
  })
}
