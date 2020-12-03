function setItem(object) {
  let item = {};
  item.itemName = object.Item;
  item.description = object.Description;
  item.upcCode = object["UPC Code"];
  item.quantity = object.Quantity;
  item.rate = object.Rate;

  return item;
}

function preSavePage(options) {
  let retArr = [];
  let currRec = { id: 0, items: [] };

  if (options.data.length) {
    for (let j = 0; j < options.data.length; j++) {
      if (currRec.id !== options.data[j].id) {
        if (currRec.id !== 0) retArr.push(currRec);
        currRec = options.data[j];
        currRec.items = [];
      }
      if (options.data[j]["*"] !== "*") currRec.items.push(setItem(options.data[j]));
    }
  }
  if (currRec.id != 0) retArr.push(currRec);

  return {
    data: retArr,
    errors: options.errors,
    abort: false
  }
}
