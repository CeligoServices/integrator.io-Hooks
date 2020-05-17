    // PSEUDOCODE:
    // only caring about the array in line_items for each object, add a quantity : 0 to each, saving the SKUs in a temp array,
    // then check array if a SKU matches, incrementing original's quantity while also adding taxes
    // and refunds from the duplicate item to the orginal, and deleting the duplicate item from that line_item array

function preSavePageFunction(options) {
    // will save only single skus in final array to return
    let singleSkuSet = []
    // need an array of just skus for indexOf to work
    let tempSkus = []
    
    // loop through all the orders
    for (let i = 0; i < options.data.length; i++) {
        // loop through all the line_items in each order
        for (let j = 0; j < options.data[i].line_items.length; j++){
            // add quantity of 1 to every order as we loop through
            options.data[i].line_items[j].quantity = 1
            options.data[i].line_items[j].tax = parseFloat(options.data[i].line_items[j].tax)
            options.data[i].line_items[j].refund = parseFloat(options.data[i].line_items[j].refund)
            // if we find a the sku in current loop in the singleSkuSet (pushed to farther down in loop), we can increment quantity,
            // add tax and refund. had to parseInt tax and refund first though to add, will convert back to string at end

            // find the index of where the sku is in tempskus array, will be at same index in singleSkuSet array
            let index = (tempSkus.indexOf(options.data[i].line_items[j].sku))
            // if index isn't -1, it was found. Add values to singleSkuSet array in proper places
            if (index >= 0) {
                singleSkuSet[index].quantity++
                singleSkuSet[index].tax += options.data[i].line_items[j].tax
                singleSkuSet[index].refund += options.data[i].line_items[j].refund

                // continue to next iteration here so we don't push duplicates into final singleSkuSet array to return
                continue;
            }

            // only if we found no duplicates do we push the new sku item into singleSkuSet array, along with tempSku into that array
            tempSkus.push(options.data[i].line_items[j].sku)
            singleSkuSet.push(options.data[i].line_items[j])
        }
        // turn the tax and refund integers back to strings from this order before putting back into original array
        //loop through singleSkuSet to change tax and refund integers back to strings
        for(let k = 0; k < singleSkuSet.length; k++){
            singleSkuSet[k].tax = singleSkuSet[k].tax.toFixed(2).toString()
            singleSkuSet[k].refund = singleSkuSet[k].refund.toFixed(2).toString()
        }

        // delete line item of order object, then put single skus back into line item of order object
        options.data[i].line_items = []
        // console.log(singleSkuSet)
        options.data[i].line_items.push(singleSkuSet)

        //empty temp sets again for next order
        singleSkuSet = []
        tempSkus = []
    }
    console.log(options.data[0].line_items)
    return {
        data: options.data,
        errors: options.errors
    }
}

let options = {
    "errors": [],
    "data": [
        {
            "id": "1541084",
            "state": "closed",
            "created_at": "2019-07-08T02:55:28+00:00",
            "total": "88.40",
            "order_id": "17279178",
            "order_name": "#1413886",
            "provider_order_id": "968393654321",
            "order_number": "1412886",
            "customer": "bchilver@gmail.com",
            "currency": "USD",
            "return_product_total": "104.00",
            "return_discount_total": "15.60",
            "return_tax_total": "0.00",
            "return_total": "88.40",
            "return_credit_total": "0.00",
            "exchange_product_total": "0.00",
            "exchange_discount_total": "0.00",
            "exchange_tax_total": "0.00",
            "exchange_total": "0.00",
            "exchange_credit_total": "0.00",
            "gift_card": "0.00",
            "handling_fee": "0.00",
            "refund": "88.40",
            "upsell": "0.00",
            "line_items": [
                {
                    "line_item_id": "38172886",
                    "provider_line_item_id": "2071328096305",
                    "product_id": "1984763199537",
                    "variant_id": "15426881945649",
                    "sku": "M19SW2002BLK:M",
                    "title": "men's Black Parana - Super-Slim Scrub Pants - M / Black",
                    "price": "56.00",
                    "discount": "8.40",
                    "tax": "0.00",
                    "refund": "47.60",
                    "returned_at": "2019-07-08 02:55:28",
                    "exchange_variant": "",
                    "return_reason": "too small",
                    "parent_return_reason": "wrong fit"
                },
                {
                    "line_item_id": "38172886",
                    "provider_line_item_id": "2071328096305",
                    "product_id": "1984763199537",
                    "variant_id": "15426881945649",
                    "sku": "M19SW2002BLK:M",
                    "title": "men's Black Parana - Super-Slim Scrub Pants - M / Black",
                    "price": "56.00",
                    "discount": "8.40",
                    "tax": "0.00",
                    "refund": "47.60",
                    "returned_at": "2019-07-08 02:55:28",
                    "exchange_variant": "",
                    "return_reason": "too small",
                    "parent_return_reason": "wrong fit"
                }
            ],
            "exchanges": [],
            "carrier": "FedEx",
            "tracking_number": "788323029966",
            "label_status": "delivered",
            "label_updated_at": "2019-07-16T17:59:11+00:00"
        },
        {
            "id": "1527992",
            "state": "closed",
            "created_at": "2019-07-04T18:05:29+00:00",
            "total": "229.20",
            "order_id": "16993869",
            "order_name": "#1417863",
            "provider_order_id": "970330112049",
            "order_number": "1416863",
            "customer": "andresgiraldosanchez@gmail.com",
            "currency": "USD",
            "return_product_total": "252.00",
            "return_discount_total": "37.80",
            "return_tax_total": "15.00",
            "return_total": "229.20",
            "return_credit_total": "0.00",
            "exchange_product_total": "0.00",
            "exchange_discount_total": "0.00",
            "exchange_tax_total": "0.00",
            "exchange_total": "0.00",
            "exchange_credit_total": "0.00",
            "gift_card": "0.00",
            "handling_fee": "0.00",
            "refund": "229.20",
            "upsell": "0.00",
            "line_items": [
                {
                    "line_item_id": "37548751",
                    "provider_line_item_id": "2074944372785",
                    "product_id": "1967718498353",
                    "variant_id": "15359620382769",
                    "sku": "FM4500HYG:S",
                    "title": "men's Hydrogreen Pisco - Basic Scrub Pants - S / Hydrogreen",
                    "price": "46.00",
                    "discount": "6.90",
                    "tax": "2.84",
                    "refund": "41.34",
                    "returned_at": "2019-07-04 18:05:29",
                    "exchange_variant": "",
                    "return_reason": "didn't meet expectations",
                    "parent_return_reason": null
                },
                {
                    "line_item_id": "37548752",
                    "provider_line_item_id": "2074944372785",
                    "product_id": "1967718498353",
                    "variant_id": "15359620382769",
                    "sku": "FM4500HYG:S",
                    "title": "men's Hydrogreen Pisco - Basic Scrub Pants - S / Hydrogreen",
                    "price": "46.00",
                    "discount": "6.90",
                    "tax": "2.74",
                    "refund": "41.84",
                    "returned_at": "2019-07-04 18:05:29",
                    "exchange_variant": "",
                    "return_reason": "didn't meet expectations",
                    "parent_return_reason": null
                },
                {
                    "line_item_id": "37548753",
                    "provider_line_item_id": "2074944372785",
                    "product_id": "1967718498353",
                    "variant_id": "15359620382769",
                    "sku": "FM4500HYG:S",
                    "title": "men's Hydrogreen Pisco - Basic Scrub Pants - S / Hydrogreen",
                    "price": "46.00",
                    "discount": "6.90",
                    "tax": "2.74",
                    "refund": "41.84",
                    "returned_at": "2019-07-04 18:05:29",
                    "exchange_variant": "",
                    "return_reason": "didn't meet expectations",
                    "parent_return_reason": null
                },
                {
                    "line_item_id": "37548754",
                    "provider_line_item_id": "2074944405553",
                    "product_id": "1988537057329",
                    "variant_id": "15453930684465",
                    "sku": "FM1500HYG:S",
                    "title": "men's Hydrogreen Leon - Two-Pocket Scrub Top - S / Hydrogreen",
                    "price": "38.00",
                    "discount": "5.70",
                    "tax": "2.26",
                    "refund": "34.56",
                    "returned_at": "2019-07-04 18:05:29",
                    "exchange_variant": "",
                    "return_reason": "didn't meet expectations",
                    "parent_return_reason": null
                },
                {
                    "line_item_id": "37548755",
                    "provider_line_item_id": "2074944405553",
                    "product_id": "1988537057329",
                    "variant_id": "15453930684465",
                    "sku": "FM1500HYG:S",
                    "title": "men's Hydrogreen Leon - Two-Pocket Scrub Top - S / Hydrogreen",
                    "price": "38.00",
                    "discount": "5.70",
                    "tax": "2.26",
                    "refund": "34.56",
                    "returned_at": "2019-07-04 18:05:29",
                    "exchange_variant": "",
                    "return_reason": "didn't meet expectations",
                    "parent_return_reason": null
                },
                {
                    "line_item_id": "37548756",
                    "provider_line_item_id": "2074944405553",
                    "product_id": "1988537057329",
                    "variant_id": "15453930684465",
                    "sku": "FM1500HYG:S",
                    "title": "men's Hydrogreen Leon - Two-Pocket Scrub Top - S / Hydrogreen",
                    "price": "38.00",
                    "discount": "5.70",
                    "tax": "2.26",
                    "refund": "34.56",
                    "returned_at": "2019-07-04 18:05:29",
                    "exchange_variant": "",
                    "return_reason": "didn't meet expectations",
                    "parent_return_reason": null
                }
            ],
            "exchanges": [],
            "carrier": "FedEx",
            "tracking_number": "788286434247",
            "label_status": "out_for_delivery",
            "label_updated_at": "2019-07-18T14:34:46+00:00"
        }
    ]
}

preSavePageFunction(options)
