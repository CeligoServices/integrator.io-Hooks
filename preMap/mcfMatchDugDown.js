// script to match SKUs on MCF, also shows what data looks like with advanced subrecord option checked (_PARENT)
let options = {
    "errors": [],
    "data": [
        {
            "ShipToAddress": {
                "AddressLine1": "944 West Sandy Lake Road",
                "City": "COPPELL",
                "CountryCode": "US",
                "Name": "FTW9",
                "PostalCode": "75019-3989",
                "StateOrProvinceCode": "TX"
            },
            "DestinationFulfillmentCenterId": "FTW9",
            "LabelPrepType": "SELLER_LABEL",
            "ShipmentId": "FBA15J7NWV27",
            "Items": [
                {
                    "FulfillmentNetworkSKU": [
                        {
                            "_": "X00294GWG7"
                        }
                    ],
                    "Quantity": [
                        {
                            "_": "4"
                        }
                    ],
                    "SellerSKU": [
                        {
                            "_": "BRNCPN12"
                        }
                    ]
                },
                {
                    "FulfillmentNetworkSKU": [
                        {
                            "_": "X00293QAQ5"
                        }
                    ],
                    "Quantity": [
                        {
                            "_": "4"
                        }
                    ],
                    "SellerSKU": [
                        {
                            "_": "BRNCPN10"
                        }
                    ]
                },
                {
                    "FulfillmentNetworkSKU": [
                        {
                            "_": "X00294J9LR"
                        }
                    ],
                    "Quantity": [
                        {
                            "_": "4"
                        }
                    ],
                    "SellerSKU": [
                        {
                            "_": "BRNCPN11"
                        }
                    ]
                }
            ],
            "_PARENT": [{
                "id": "516",
                "recordType": "purchaseorder",
                "ShipAddressLine1": "1421 North Falls Blvd",
                "ShipAddressLine2": "",
                "ShipAddressCity": "Oneida",
                "ShipCountryCode": "US",
                "ShipAddressee": "Neil M Footwear",
                "ShipState": "AR",
                "ShipZip": "72369",
                "memo": "Amazon Test 3",
                "shipmethod": "",
                "carrier": "FedEx/USPS/More",
                "shipdate": "10/8/2019",
                "status": "Pending Receipt",
                "NetSuiteSKU": "BRNCPN10",
                "transferprice": "150.00",
                "Quantity": "4",
                "FromLocation": "105",
                "ToLocation": "12",
                "purchaseOrderLineId": "1",
                "subsidiary": "1",
                "itemid": "323",
                "vendorid": "513"
            },
            {
                "id": "516",
                "recordType": "purchaseorder",
                "ShipAddressLine1": "1421 North Falls Blvd",
                "ShipAddressLine2": "",
                "ShipAddressCity": "Oneida",
                "ShipCountryCode": "US",
                "ShipAddressee": "Neil M Footwear",
                "ShipState": "AR",
                "ShipZip": "72369",
                "memo": "Amazon Test 3",
                "shipmethod": "",
                "carrier": "FedEx/USPS/More",
                "shipdate": "10/8/2019",
                "status": "Pending Receipt",
                "NetSuiteSKU": "BRNCPN11",
                "transferprice": "150.00",
                "Quantity": "4",
                "FromLocation": "105",
                "ToLocation": "12",
                "purchaseOrderLineId": "1",
                "subsidiary": "1",
                "itemid": "325",
                "vendorid": "513"
            }]
        }
    ]
}

function preMapFunction(options) {
    for (let i = 0; i < options.data.length; i++) {
        for (let j = 0; j < options.data[i].Items.length; j++) {
            for (let k = 0; k < options.data[i]._PARENT.length; k++) {
                if (options.data[i]._PARENT[k].NetSuiteSKU === options.data[i].Items[j].SellerSKU[0]._) {
                    options.data[i].Items[j].NetSuiteSkuId = options.data[i]._PARENT[k].itemid
                }
            }
        }
    }
    console.log(options.data[0].Items)
    return options.data.map((d) => {
        return {
            data: d
        }
    })
}
preMapFunction(options)