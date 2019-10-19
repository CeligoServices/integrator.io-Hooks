// this does a lot of stuff to prepare for advanced subrecord option in shipwire, putting all in one tracking array for each combination
// of SKUs and tracking numbers
function preSavePageFunction(options) {
    let shipmentTrackingArray

    // skip empty orders in shipwire
    if (options.data.length === 0) {
        shipmentTrackingArray = [{
            sku: 'VG42252-0000',
            tracking: '1234',
            warehouseName: 'Hermosa, CA',
            quantity: 2,
            cartonWeight: '1',
            carrierCode: null,
            serialShippingContainerCode: '00006629190663991447',
            broken: true
        }]
        options.data[0] = { "resource": { "shipmentTrackingArray": [] } }
        options.data[0].resource.shipmentTrackingArray = shipmentTrackingArray

        return {
            data: options.data,
            errors: options.errors
        }
    }
    for (let i = 0; i < options.data.length; i++) {

        shipmentTrackingArray = []
        let itemData = options.data[i].resource.pieces.resource.items
        let itemTrackingNumber
        let serialShippingContainerCode
        let carrierCode
        for (let a = 0; a < itemData.length; a++) {
            let itemSkusArray = itemData[a].resource.contents.resource.items
            if (itemData[a].resource.trackings.resource.items.length !== 0) {
                itemTrackingNumber = itemData[a].resource.trackings.resource.items[0].resource.tracking
                carrierCode = itemData[a].resource.trackings.resource.items[0].resource.carrierCode
                serialShippingContainerCode = itemData[a].resource.serialShippingContainerCode
            }
            else {
                itemTrackingNumber = options.data[i].resource.trackings.resource.items[0].resource.tracking
                carrierCode = options.data[i].resource.trackings.resource.items[0].resource.scacCode
                serialShippingContainerCode = null
            }
            for (let b = 0; b < itemSkusArray.length; b++) {
                let singleItem = {}
                singleItem.sku = itemSkusArray[b].resource.sku
                singleItem.matrixSku = makeMatrixSku(singleItem.sku) || 'none'
                singleItem.tracking = itemTrackingNumber
                singleItem.warehouseName = options.data[i].resource.routing.resource.warehouseName
                singleItem.quantity = itemSkusArray[b].resource.quantity
                singleItem.cartonWeight = itemData[a].resource.dimensions.resource.weight
                singleItem.carrierCode = carrierCode
                singleItem.serialShippingContainerCode = serialShippingContainerCode
                singleItem.broken = false
                shipmentTrackingArray.push(singleItem)
            }

        }
        options.data[i].resource.shipmentTrackingArray = shipmentTrackingArray
    }
    function makeMatrixSku(sku) {
        let matrixSku
        for (let i = sku.length; i > 0; i--) {
            if (sku[i] === '-') {
                matrixSku = sku.substr(0, i) + ' : ' + sku
                return matrixSku
            }
        }

    }
    console.log(options.data[0].resource.shipmentTrackingArray)
    return {
        data: options.data,
        errors: options.errors
    }
}

let options = {
    "errors": [],
    "data": [
        {
            "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886",
            "resource": {
                "externalId": "90494487",
                "orderNo": "SO-99000000001084152",
                "commerceName": "Shipwire",
                "processAfterDate": "2019-10-03T16:30:00-07:00",
                "lastUpdatedDate": "2019-10-04T20:50:31-07:00",
                "status": "completed",
                "vendorId": null,
                "vendorExternalId": null,
                "purchaseOrderId": 68735906,
                "purchaseOrderExternalId": "90494487",
                "purchaseOrderNo": "SO-99000000001084152",
                "id": 545227886,
                "transactionId": "1570144399-644183-1",
                "needsReview": 0,
                "vendorName": null,
                "holds": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/holds?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20"
                },
                "items": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/items?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20"
                },
                "trackings": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/trackings?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20",
                    "resource": {
                        "offset": 0,
                        "total": 1,
                        "previous": null,
                        "next": null,
                        "items": [
                            {
                                "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/trackings/33963026",
                                "resource": {
                                    "id": 33963026,
                                    "orderId": 545227886,
                                    "orderExternalId": "90494487",
                                    "pieceId": 7265199436,
                                    "tracking": "9261290985469716200606",
                                    "carrier": "FEDEX SMART POST",
                                    "carrierCode": null,
                                    "scacCode": "FXSP",
                                    "url": "http://www.fedex.com/Tracking?tracknumbers=9261290985469716200606",
                                    "summary": null,
                                    "summaryDate": null,
                                    "labelCreatedDate": null,
                                    "trackedDate": null,
                                    "firstScanDate": "2019-10-04T00:00:00-07:00",
                                    "firstScanCity": null,
                                    "firstScanRegion": null,
                                    "firstScanPostalCode": null,
                                    "firstScanCountry": null,
                                    "deliveredDate": "2019-10-14T00:00:00-07:00",
                                    "deliveryCity": null,
                                    "deliveryRegion": null,
                                    "deliveryPostalCode": null,
                                    "deliveryCountry": null,
                                    "createdDate": "2019-10-04T20:50:31-07:00"
                                }
                            }
                        ]
                    }
                },
                "returns": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/returns?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20"
                },
                "options": {
                    "resourceLocation": null,
                    "resource": {
                        "warehouseId": null,
                        "physicalWarehouseId": null,
                        "warehouseExternalId": null,
                        "warehouseRegion": null,
                        "warehouseArea": null,
                        "serviceLevelCode": null,
                        "carrierCode": "TPC PL",
                        "thirdPartyCarrierCodeRequested": null,
                        "billingType": "PREPAID",
                        "carrierId": null,
                        "carrierAccountNumber": "775211423",
                        "sameDay": "NOT REQUESTED",
                        "forceDuplicate": 0,
                        "forceAddress": 0,
                        "testOrder": 0,
                        "channelName": "GrouponSOR",
                        "localizationCode": null,
                        "forceOverPack": null,
                        "referrer": "",
                        "clearPreferenceHolds": null,
                        "lastManualEditDate": null,
                        "carrierType": null
                    }
                },
                "shipFrom": {
                    "resourceLocation": null,
                    "resource": {
                        "company": "Online Store"
                    }
                },
                "shipTo": {
                    "resourceLocation": null,
                    "resource": {
                        "email": "",
                        "name": "Allyson Hollis",
                        "company": "Allyson Hollis",
                        "address1": "900 GEORGIA AVE",
                        "address2": "227542961 GG-16HJ-CP47-2V6S-FNYG",
                        "address3": "",
                        "city": "LAGRANGE",
                        "state": "GA",
                        "postalCode": "30241",
                        "country": "US",
                        "phone": "650-561-4800",
                        "isCommercial": 0,
                        "isPoBox": 0
                    }
                },
                "commercialInvoice": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/commercialInvoice"
                },
                "packingList": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/packingList"
                },
                "shippingLabel": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/shippingLabel"
                },
                "routing": {
                    "resourceLocation": null,
                    "resource": {
                        "warehouseId": 33,
                        "warehouseExternalId": null,
                        "warehouseName": "Hermosa, CA",
                        "physicalWarehouseId": null,
                        "originLongitude": 34.0894,
                        "originLatitude": -117.585,
                        "destinationLongitude": "-84.9577",
                        "destinationLatitude": "33.0249"
                    }
                },
                "events": {
                    "resourceLocation": null,
                    "resource": {
                        "createdDate": "2019-10-03T16:13:19-07:00",
                        "pickedUpDate": null,
                        "submittedDate": "2019-10-03T16:41:14-07:00",
                        "processedDate": "2019-10-03T16:34:33-07:00",
                        "completedDate": "2019-10-04T20:50:31-07:00",
                        "expectedSubmittedDate": "2019-10-03T16:41:14-07:00",
                        "expectedCompletedDate": "2019-10-04T20:50:31-07:00",
                        "expectedDate": "2019-10-15T00:00:00-07:00",
                        "cancelledDate": null,
                        "returnedDate": null,
                        "lastManualUpdateDate": null
                    }
                },
                "pricing": {
                    "resourceLocation": null,
                    "resource": {
                        "shipping": 0.01,
                        "packaging": 0.26,
                        "insurance": 0,
                        "handling": 2.1,
                        "total": 2.37
                    }
                },
                "shipwireAnywhere": {
                    "resourceLocation": null,
                    "resource": {
                        "status": null
                    }
                },
                "pricingEstimate": {
                    "resourceLocation": null,
                    "resource": {
                        "total": 0.27,
                        "insurance": 0,
                        "shipping": 0.27,
                        "packaging": 0.26,
                        "handling": 0
                    }
                },
                "freightSummary": {
                    "resourceLocation": null,
                    "resource": {
                        "totalWeight": "1.60",
                        "weightUnit": "LB",
                        "measurementType": "actual"
                    }
                },
                "splitOrders": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/splitOrders?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20"
                },
                "pieces": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/pieces?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20",
                    "resource": {
                        "offset": 0,
                        "total": 1,
                        "previous": null,
                        "next": null,
                        "items": [
                            {
                                "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/pieces/7265199436",
                                "resource": {
                                    "id": 7265199436,
                                    "dimensions": {
                                        "resourceLocation": null,
                                        "resource": {
                                            "length": "0.00",
                                            "lengthUnit": "IN",
                                            "width": "0.00",
                                            "widthUnit": "IN",
                                            "height": "0.00",
                                            "heightUnit": "IN",
                                            "weight": "1.60",
                                            "weightUnit": "LB",
                                            "weightType": "total"
                                        }
                                    },
                                    "subweights": {
                                        "resourceLocation": null,
                                        "resource": {
                                            "offset": 0,
                                            "total": 3,
                                            "previous": null,
                                            "next": null,
                                            "items": [
                                                {
                                                    "resourceLocation": null,
                                                    "resource": {
                                                        "amount": 0,
                                                        "units": "LB",
                                                        "type": "voidFill"
                                                    }
                                                },
                                                {
                                                    "resourceLocation": null,
                                                    "resource": {
                                                        "amount": 0,
                                                        "units": "LB",
                                                        "type": "packaging"
                                                    }
                                                },
                                                {
                                                    "resourceLocation": null,
                                                    "resource": {
                                                        "amount": 1.6,
                                                        "units": "LB",
                                                        "type": "products"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "contents": {
                                        "resourceLocation": null,
                                        "resource": {
                                            "offset": 0,
                                            "total": 2,
                                            "previous": null,
                                            "next": null,
                                            "items": [
                                                {
                                                    "resourceLocation": null,
                                                    "resource": {
                                                        "sku": "MM33135-0800-1234",
                                                        "retailerSku": null,
                                                        "quantity": 1,
                                                        "retailerLineNo": null,
                                                        "unitOfMeasure": "EA"
                                                    }
                                                },
                                                {
                                                    "resourceLocation": null,
                                                    "resource": {
                                                        "sku": "VP75234-0000",
                                                        "retailerSku": null,
                                                        "quantity": 1,
                                                        "retailerLineNo": null,
                                                        "unitOfMeasure": "EA"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "trackings": {
                                        "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/pieces/7265199436/trackings?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20",
                                        "resource": {
                                            "offset": 0,
                                            "total": 1,
                                            "previous": null,
                                            "next": null,
                                            "items": [
                                                {
                                                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/pieces/7265199436/trackings/33963026",
                                                    "resource": {
                                                        "id": 33963026,
                                                        "orderId": 545227886,
                                                        "orderExternalId": "90494487",
                                                        "pieceId": 7265199436,
                                                        "tracking": "9261290985469716200606",
                                                        "carrier": "FEDEX SMART POST",
                                                        "carrierCode": null,
                                                        "scacCode": "FXSP",
                                                        "url": "http://www.fedex.com/Tracking?tracknumbers=9261290985469716200606",
                                                        "summary": null,
                                                        "summaryDate": null,
                                                        "labelCreatedDate": null,
                                                        "trackedDate": null,
                                                        "firstScanDate": "2019-10-04T00:00:00-07:00",
                                                        "firstScanCity": null,
                                                        "firstScanRegion": null,
                                                        "firstScanPostalCode": null,
                                                        "firstScanCountry": null,
                                                        "deliveredDate": "2019-10-14T00:00:00-07:00",
                                                        "deliveryCity": null,
                                                        "deliveryRegion": null,
                                                        "deliveryPostalCode": null,
                                                        "deliveryCountry": null,
                                                        "createdDate": "2019-10-04T20:50:31-07:00"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "serialShippingContainerCode": "00006629190677089802",
                                    "serialNumbers": [],
                                    "packageLevel": "CARTON",
                                    "childPiecesIds": [],
                                    "rememberContainer": 0
                                }
                            }
                        ]
                    }
                },
                "extendedAttributes": {
                    "resourceLocation": "https://api.shipwire.com/api/v3/orders/545227886/extendedAttributes?purchaseOrderId=68735906&expand=pieces%2Ctrackings&offset=0&limit=20"
                },
                "shipmentTrackingArray": [
                    {
                        "sku": "MM33135-0800",
                        "tracking": "9261290985469716200606",
                        "warehouseName": "Hermosa, CA",
                        "quantity": 1,
                        "cartonWeight": "1.60",
                        "carrierCode": null,
                        "serialShippingContainerCode": "00006629190677089802",
                        "broken": false
                    }
                ]
            }
        }
    ]
}

preSavePageFunction(options)