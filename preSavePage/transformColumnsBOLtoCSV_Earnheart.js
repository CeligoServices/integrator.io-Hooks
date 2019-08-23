// converting a BOL file format to CSV
function organizeBOL(options) {
    let dataWithArray = []
    let transformedData = {}
    transformedData.LineItem = []
    for (let i = 0; i < options.data.length; i++) {
        let tempHeaderObj = options.data[i]
        if (tempHeaderObj.Column0 === 'H') {
            if (i > 0){
                dataWithArray.push(transformedData)
            }
            transformedData = {}
            transformedData.Supplier = tempHeaderObj.Column1
            transformedData['Rack Location'] = tempHeaderObj.Column2
            transformedData.BOL = tempHeaderObj.Column3
            transformedData.Date = tempHeaderObj.Column5
            transformedData.LineItem = []
        }
        else if (tempHeaderObj.Column0 === 'D') {
            let tempLineObj = {}
            tempLineObj['BOL (Line item)'] = tempHeaderObj.Column3
            tempLineObj.SKU = tempHeaderObj.Column5
            tempLineObj.GrossGallons = tempHeaderObj.Column8
            tempLineObj.NetGallons = tempHeaderObj.Column9
            transformedData.LineItem.push(tempLineObj)
        }
    }
    dataWithArray.push(transformedData)
    console.log(dataWithArray[0])
    return {
        data: dataWithArray,
        errors: options.errors
    }
}

let options = {
    "errors": [],
    "data": [
        {
            "Column0": "H",
            "Column1": "CENEX HARVEST S",
            "Column2": "Enid Magellan",
            "Column3": "488227",
            "Column4": "EARO",
            "Column5": "08/01/2019 06:20",
            "Column15": "CR",
            "Column16": "T73OK2606",
            "Column17": "EARO",
            "Column18": "Y",
            "Column19": "113638"
        },
        {
            "Column0": "D",
            "Column1": "0",
            "Column5": "87 E10 Gasoline",
            "Column8": "1999.00",
            "Column9": "1974.00",
            "Column14": "113638",
            "Column17": "D1J"
        },
        {
            "Column0": "D",
            "Column1": "0",
            "Column3": "137066",
            "Column5": "87 E10 Gasoline",
            "Column8": "450.00",
            "Column9": "442.00",
            "Column14": "222787",
            "Column17": "D09"
        },
        {
            "Column0": "D",
            "Column1": "0",
            "Column3": "137066",
            "Column5": "87 E10 Gasoline",
            "Column8": "450.00",
            "Column9": "442.00",
            "Column14": "222787",
            "Column17": "D09"
        },
        {
            "Column0": "H",
            "Column1": "Valero",
            "Column2": "OKC Magellan",
            "Column3": "2315587",
            "Column4": "EARO",
            "Column5": "08/01/2019 05:37",
            "Column15": "PE1",
            "Column16": "R560",
            "Column17": "EARO",
            "Column18": "Y",
            "Column19": "222787"
        },
        {
            "Column0": "D",
            "Column1": "0",
            "Column3": "124292",
            "Column5": "On Road Diesel",
            "Column8": "2498.00",
            "Column9": "2473.00",
            "Column14": "562241",
            "Column17": "V95"
        }
    ]
}


organizeBOL(options)