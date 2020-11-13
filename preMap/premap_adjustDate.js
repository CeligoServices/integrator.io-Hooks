function preMap (options) {
  for (let i=0; i<options.data.length; i++) {
    const curr = options.data[i];
    let date = new Date(curr.CloseDate);
    
    const adjObj = { "Hawk": 28, "Falcon": 7 };
    const templateAdj = adjObj[curr.NS_Project_Template__c];
    
    const adjustment = templateAdj ? templateAdj : 0;
    
    date.setDate(date.getDate() + adjustment);
    options.data[i].StartDate = date;
  }
  
  return options.data.map((d) => {
    return {
      data: d
    }
  })
}