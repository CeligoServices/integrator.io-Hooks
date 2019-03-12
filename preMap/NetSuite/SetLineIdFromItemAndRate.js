/*
* This script assumes that you did a query for transaction lines in a previous step and set the results into a property called NS_Lines.
* This will then match the values based off of a Rate and Item property and copy the POLineID and SOLineID values over the the InvoiceLines array
*/

function preMapFunction(options) {
  for(var i=0; i< options.data.length; i++){
   for(var j=0; j<options.data[i].InvoiceLines.length; j++){
     var item = options.data[i].InvoiceLines[j].ProductMfrPart;
     var rate = options.data[i].InvoiceLines[j].Price / options.data[i].InvoiceLines[j].Shipped;
   
     for(var line =0; line < options.data[i].NS_Lines.length; line++){
      // console.log("Item: " + item + " NS Line: " + );
       if(item == options.data[i].NS_Lines[line].Item && rate == options.data[i].NS_Lines[line].Rate){
         options.data[i].InvoiceLines[j].POLineID = options.data[i].NS_Lines[line].POLineID;
         options.data[i].InvoiceLines[j].SOLineID = options.data[i].NS_Lines[line].SOLineID;
         break;
       }
   	}
   }
  }
  return options.data.map((d) => {
    return {
      data: d
    }
  })
}