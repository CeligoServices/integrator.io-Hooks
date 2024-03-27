function preSavePage(options){
  for(let d of options.data){
    //This will be your master array to hold all the groups, each group will have a field for group id and array of items
    let groups = [];
    
    for(let i of d.LineItems){
      //Set Variable to track if matching group was found
      let groupExist = false;
      
      //Loop though groups...
      for(let g of groups){
        //Check to see if this (g) is a match group
        if(g.groupNumber == i.groupNumber){
          //They are a match so this item can just be pushed into this groups item array
          g.LineItems.push(i);
          //Set the groupExist var to true
          groupExist = true;
        }
      }
      
      //Once you are done looping though all the groups you can check if your groupExist var is false
      if(!groupExist){
        //There was no match found so we assume the group doesnt exist
        //Start by creating a new group as an empty OBJ
        let newGroup = {}
        //Set the group number
        newGroup.groupNumber = i.groupNumber
        //Set up the empty item array
        newGroup.LineItems = [];
        //push this item(i) to the new array
        newGroup.LineItems.push(i);
        //and push the new group to groups
        groups.push(newGroup);
        
      }//If the group existed we can assume the item was pushed into it so there is no need for an else
    }
    
    //Add groups to data
    d.groups = groups
  }
  
    return {
    data: options.data,
    errors: options.errors,
    abort: false,
    newErrorsAndRetryData: []
  }
}