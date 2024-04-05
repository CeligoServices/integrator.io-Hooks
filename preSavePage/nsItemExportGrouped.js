// Script is used to combine exported NetSuite Items into a single record
// Page records will reflect batch size set on NetSuite export [Default is set to 20. If 50 items are exported you will expect 3 pages. One page with 10 records and two with 20 records]

// example from transformation
// {
//   "data": [
//     {
//       "item": {
//         "sku": "BLU-SM-3",
//         "upc": "810114651032",
//         "availableQuantity": {
//           "amount": "1000",
//           "unitOfMeasure": "Each"
//         }
//       }
//     }
//   ]
// }

function preSavePage(options) {
  let tempItem = {}
  let items = []
  let newArr = [];
  let deepCopy = JSON.parse(JSON.stringify(options.data));

  newArr = [
    {
      // Header level key/value pairs can be placed here
      "item": [
      ]
    }
  ]

  for (let i = 0; i < deepCopy.length; i++) {
    tempItem = deepCopy[i].item;
    items.push(tempItem)
  }
  newArr[0].item = items;
  options.data = newArr

  return {
    data: options.data,
    errors: options.errors,
    abort: false,
    newErrorsAndRetryData: []
  }
}