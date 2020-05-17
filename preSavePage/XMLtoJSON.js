let options = {}



function preSavePageFunction(options) {
    //below list is for the convertOptions function, input anything in the XML data that should be an Array instead of object when there is only 1
    const listOfArrayFields = ['FuelSales/Product', 'FuelInventory/Product', 'Lottery/InstantByTicketValue', 'StorePurchases/Invoice', 'StorePurchases/Invoice/InvoiceDetail/InvoiceDetail', 'DepartmentSales/Department', 'PLUSales/PLU', 'UPCSales/UPC']

    let prettyJSON = convertOptions(options, listOfArrayFields)
    let finalData = groupData(prettyJSON)
    return {
        data: finalData,
        errors: options.errors
    }
}


function groupData(options) {
    //NEW UPDATE -- actually grouping by invoice number on top level, not vendor number
    // create set array for invoice numbers
    let invoiceNumSet = new Set()
    for (let i = 0; i < options.data.length; i++) {
        //add empty Lines array for JEs later
        options.data[i].Lines = []
        for (let j = 0; j < options.data[i].StorePurchases.Invoice.length; j++) {
            // if GLnumber is empty (type object not string), delete that invoice
            if (typeof options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[0].GLnumber !== 'string') {

                if (options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[0].VendorName === 'COMPANY TRANSPORTATION') {
                    // don't delete the company transportation invoices, instead put in its own array for import as a JE
                    for (let k = 0; k < options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail.length; k++) {
                        invoiceNumSet.add(options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].InvoiceNumber)
                    }
                }
                else {
                    //NEW logic: hardcode GLnumber if LineType = tax or LineType = charge, so if tax or charge line 1 of invoice don't delete
                    if (options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[0].LineType === 'tax' ||
                        options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[0].LineType === 'charge') {
                    }
                    else {
                        options.data[i].StorePurchases.Invoice.splice(j, 1)
                        j--
                        continue;
                    }
                }
            }
            else {
                for (let k = 0; k < options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail.length; k++) {
                    invoiceNumSet.add(options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].InvoiceNumber)
                }
            }
        }
    }
    invoiceNumSet = Array.from(invoiceNumSet)
    let storePurchaseArray = []
    // for each vendor in the set, push an empty array into the store purchase array
    for (let i = 0; i < invoiceNumSet.length; i++) {
        storePurchaseArray.push({ "Lines": [] })
    }
    // just group the invoices by vendor number
    for (let i = 0; i < options.data.length; i++) {
        for (let j = 0; j < options.data[i].StorePurchases.Invoice.length; j++) {
            let vendorNum = options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[0].InvoiceNumber
            let invoiceType = options.data[i].StorePurchases.Invoice[j].InvoiceMOP
            let index = invoiceNumSet.indexOf(vendorNum)
            for (let k = 0; k < options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail.length; k++) {
                options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].invoiceType = invoiceType
                let invoiceTotalRounded = options.data[i].StorePurchases.Invoice[j].InvoiceTotal
                invoiceTotalRounded = Math.round(invoiceTotalRounded * 100) / 100
                invoiceTotalRounded = invoiceTotalRounded.toFixed(2)
                options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].invoiceTotal = invoiceTotalRounded
                storePurchaseArray[index].Lines.push(options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k])
                //new logic, make sure to hardcode anything with store type or cash to new GL
                if (options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].LineType === 'tax') {
                    options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].GLnumber = '6003.4.11'
                }
                if (options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].LineType === 'charge') {
                    if (options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].VendorNumber === '1294') {
                        options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].GLnumber = '4075'
                        options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].class = '137'
                    }
                    else {
                        options.data[i].StorePurchases.Invoice[j].InvoiceDetail.InvoiceDetail[k].GLnumber = '4075'
                    }
                }

            }
        }
        options.data[i].StorePurchases.Invoice = storePurchaseArray
    }

    // now summarize fuel sales by product id
    for (let i = 0; i < options.data.length; i++) {
        let newFuelSalesArray = []
        let productIds = []
        for (let j = 0; j < options.data[i].FuelSales.Product.length; j++) {
            options.data[i].FuelSales.Product[j].memo = "Fuel Sales/" + options.data[i].FuelSales.Product[j].Name
            options.data[i].FuelSales.Product[j].class = options.data[i].FuelSales.Product[j].Name
            options.data[i].FuelSales.Product[j].Amount = parseFloat(options.data[i].FuelSales.Product[j].Amount)
            let index = productIds.indexOf(options.data[i].FuelSales.Product[j].ProductId)
            // if index isn't -1, it was found. Add values to array in proper places
            if (index >= 0) {
                newFuelSalesArray[index].Amount += options.data[i].FuelSales.Product[j].Amount
                // continue to next iteration here so we don't push duplicates into final set array to return
                continue;
            }
            // only if we found no duplicates do we push the fuel sales into array, along with productIds into that array
            productIds.push(options.data[i].FuelSales.Product[j].ProductId)
            newFuelSalesArray.push(options.data[i].FuelSales.Product[j])
        }
        options.data[i].FuelSales.Product = newFuelSalesArray

        //add GLs to Fuel Sales
        for (let j = 0; j < options.data[i].FuelSales.Product.length; j++) {
            options.data[i].FuelSales.Product[j].creditGL = "fuel"// int id 221 //fuel GL 4001
            options.data[i].FuelSales.Product[j].debitGL = "c-store clearing"// int id 810 //c-store clearing GL 10001
        }

        for (let j = 0; j < options.data[i].FuelSales.Product.length; j++) {
            options.data[i].FuelSales.Product[j].GL = "Fuel"// int id 221 //fuel GL 4001 // needs to go to 10001 for debit fuels
        }
        //push all fuel sales into Lines for JE
        Array.prototype.push.apply(options.data[i].Lines, newFuelSalesArray)
    }

    // now summarize department sales
    for (let i = 0; i < options.data.length; i++) {
        let newDeptArray = []
        let deptIds = []
        for (let j = 0; j < options.data[i].DepartmentSales.Department.length; j++) {
            options.data[i].DepartmentSales.Department[j].memo = "Store Sales/" + options.data[i].DepartmentSales.Department[j].DepartmentName
            options.data[i].DepartmentSales.Department[j].class = options.data[i].DepartmentSales.Department[j].DepartmentId
            options.data[i].DepartmentSales.Department[j].Amount = parseFloat(options.data[i].DepartmentSales.Department[j].Amount)
            let index = deptIds.indexOf(options.data[i].DepartmentSales.Department[j].DepartmentId)
            // if index isn't -1, it was found. Add values to array in proper places
            if (index >= 0) {
                newDeptArray[index].Amount += options.data[i].DepartmentSales.Department[j].Amount
                // continue to next iteration here so we don't push duplicates into final set array to return
                continue;
            }
            // only if we found no duplicates do we push the new items into arrays
            deptIds.push(options.data[i].DepartmentSales.Department[j].DepartmentId)
            newDeptArray.push(options.data[i].DepartmentSales.Department[j])
        }
        options.data[i].DepartmentSales.Department = newDeptArray
        //add GLs to Department Sales
        for (let j = 0; j < options.data[i].DepartmentSales.Department.length; j++) {
            options.data[i].DepartmentSales.Department[j].GL = "Inside Store Sales"// int id 221 //fuel GL 4001
        }
        //push all depts into Lines for JE
        Array.prototype.push.apply(options.data[i].Lines, newDeptArray)

    }

    // now summarize MOP
    for (let i = 0; i < options.data.length; i++) {
        let newMopArray = []
        let mopIds = []
        for (let j = 0; j < options.data[i].MethodOfPayment.MethodOfPayment.length; j++) {
            options.data[i].MethodOfPayment.MethodOfPayment[j].memo = "Cash Register/" + options.data[i].MethodOfPayment.MethodOfPayment[j].MOPName
            options.data[i].MethodOfPayment.MethodOfPayment[j].GL = options.data[i].MethodOfPayment.MethodOfPayment[j].MOPName
            options.data[i].MethodOfPayment.MethodOfPayment[j].Amount = parseFloat(options.data[i].MethodOfPayment.MethodOfPayment[j].Amount)
            let index = mopIds.indexOf(options.data[i].MethodOfPayment.MethodOfPayment[j].MOPId)
            // if index isn't -1, it was found. Add values to array in proper places
            if (index >= 0) {
                newMopArray[index].Amount += options.data[i].MethodOfPayment.MethodOfPayment[j].Amount
                // continue to next iteration here so we don't push duplicates into final set array to return
                continue;
            }
            // only if we found no duplicates do we push the new items into arrays
            mopIds.push(options.data[i].MethodOfPayment.MethodOfPayment[j].MOPId)
            newMopArray.push(options.data[i].MethodOfPayment.MethodOfPayment[j])
        }
        // find Cash/Check MOPs and add them for bank line later
        let cashCheckTotal = 0
        for (let j = 0; j < newMopArray.length; j++) {
            if (newMopArray[j].MOPName === 'Cash') {
                cashCheckTotal += newMopArray[j].Amount
            }
            if (newMopArray[j].MOPName === 'Check') {
                cashCheckTotal += newMopArray[j].Amount
            }
        }
        options.data[i].cashCheckTotal = cashCheckTotal
        options.data[i].MethodOfPayment.MethodOfPayment = newMopArray

        //push all MOPs into Lines for JE
        Array.prototype.push.apply(options.data[i].Lines, newMopArray)

    }

    //push salestax object into lines array
    for (let i = 0; i < options.data.length; i++) {
        options.data[i].Lines.push(
            {
                "GL": "Sales Tax Total",
                "memo": "sales tax total",
                "Amount": options.data[i].salesTax.tax.netSalesTax
            }
        )
    }

    //push lottery amounts into Lines array
    for (let i = 0; i < options.data.length; i++) {
        options.data[i].Lines.push(
            {
                "GL": "Inside Store Sales",
                "class": "Lottery Scratch Tickets",
                "memo": "Instant Lottery Sales",
                "Amount": options.data[i].Lottery.Instant
            },
            {
                "GL": "Inside Store Sales",
                "class": "Lottery Online Sales",
                "memo": "Online Lottery Sales",
                "Amount": options.data[i].Lottery.Online
            },
            {
                "GL": "10001",
                "memo": "Lottery Paidouts",
                "Amount": options.data[i].Lottery.Paidout
            }
        )
    }

    // remove 0 amounts from Lines, and also add negative lines for JE
    for (let i = 0; i < options.data.length; i++) {
        let negativesArray = []
        for (let j = 0; j < options.data[i].Lines.length; j++) {
            if (options.data[i].Lines[j].Amount == 0) {
                options.data[i].Lines.splice(j, 1)
                j--
                continue;
            }
            //remove cash and check from debits array
            if (options.data[i].Lines[j].MOPName === 'Cash' || options.data[i].Lines[j].MOPName === 'Check') {
                options.data[i].Lines.splice(j, 1)
                j--
                continue;
            }
            negativesArray.push(JSON.parse(JSON.stringify(options.data[i].Lines[j])))
            //just put on another amount line but credit line (amount earlier) must be 0 for those lines
            negativesArray[j].Debit = negativesArray[j].Amount
            delete negativesArray[j].Amount
            // delete any class for debit lines
            delete negativesArray[j].class
            //change lottery paidout to different GL, if exists
            if (negativesArray[j].memo === 'Lottery Paidouts') {
                negativesArray[j].GL = '10001.5'
            }
            //change lottery scratch to different GL, if exists
            if (negativesArray[j].memo === 'Instant Lottery Sales') {
                negativesArray[j].GL = 'Instant Lottery Sales'
            }
            //change lottery online to different GL, if exists
            if (negativesArray[j].memo === 'Online Lottery Sales') {
                negativesArray[j].GL = 'Online Lottery Sales'
            }
            // if department line or fuel line, make the GL 10001
            if (negativesArray[j].DepartmentId || negativesArray[j].Gallons) {
                negativesArray[j].GL = '10001'
            }

            //if cash over/short in memo, add a class field to map in class static mappings
            if (negativesArray[j].memo === 'Cash Register/Short / Over') {
                negativesArray[j].class = 'Short / Over'
            }

            // if Paid In, make debit line location's bank account
            if (negativesArray[j].memo === 'Cash Register/Paid In') {
                negativesArray[j].GL = options.data[i].Header.StationName
            }

        }

        // change all MOP Credit GLs to 10001, remove cash and check MOPs from array because pushing bank lines later
        for (let i = 0; i < options.data.length; i++) {
            for (let j = 0; j < options.data[i].Lines.length; j++) {
                if (options.data[i].Lines[j].MOPName) {
                    if (options.data[i].Lines[j].MOPName === 'Paid In') {
                        options.data[i].Lines[j].GL = 'Paid In'
                    }
                    else {
                        options.data[i].Lines[j].GL = '10001'
                    }
                }
            }

        }
        //push lottery amounts into Lines array, credit and debit
        let newArray = []
        for (let j = 0; j < options.data[i].Lines.length; j++) {
            // if not short/over, push normally
            if (options.data[i].Lines[j].MOPName !== 'Short / Over') {
                newArray.push(options.data[i].Lines[j])
                newArray.push(negativesArray[j])
            }
            // otherwise, send short/over (negative or positive) to credit, NS will change to Debit automatically if negative
            else {
                options.data[i].Lines[j].GL = 'Short / Over'
                newArray.push(options.data[i].Lines[j])
            }

        }
        options.data[i].Lines = newArray
        // add line for location to use a certain bank GL, as well as combination of Cash/Check MOPs
        let paidOutLine = {
            GL: '10001',
            memo: 'Cash Register/Cash',
            Amount: options.data[i].cashCheckTotal
        }
        let bankLine = {
            GL: options.data[i].Header.StationName,
            memo: 'Cash Register/Cash',
            Debit: options.data[i].cashCheckTotal
        }
        options.data[i].Lines.push(paidOutLine)
        options.data[i].Lines.push(bankLine)
    }

    //round all credit/debit amounts to 2 places
    for (let i = 0; i < options.data.length; i++) {
        for (let j = 0; j < options.data[i].Lines.length; j++) {
            if (options.data[i].Lines[j].Amount) {
                let rounded = Math.round(options.data[i].Lines[j].Amount * 100) / 100
                options.data[i].Lines[j].Amount = rounded.toFixed(2)
            }
            if (options.data[i].Lines[j].Debit) {
                let rounded = options.data[i].Lines[j].Debit = Math.round(options.data[i].Lines[j].Debit * 100) / 100
                options.data[i].Lines[j].Debit = rounded.toFixed(2)
            }
        }
    }

    //group each storePurchaseArray by GL
    for (let i = 0; i < options.data.length; i++) {
        options.data[i].companyTran = []
        for (let j = 0; j < options.data[i].StorePurchases.Invoice.length; j++) {
            let newStorePurchasesArray = []
            let tempStorePurchasesDebitArray = []
            options.data[i].StorePurchases.Invoice[j] = summarizeStorePurchases(options.data[i].StorePurchases.Invoice[j])
            tempStorePurchasesDebitArray.push(JSON.parse(JSON.stringify(options.data[i].StorePurchases.Invoice[j])))
            // doesn't seem to be a possibility for "class" for these charges because summing all of them
            for (let k = 0; k < options.data[i].StorePurchases.Invoice[j].Lines.length; k++) {
                // if any lines are 'company TRANSPORTATION' (vendor 1303), put in new array
                if (options.data[i].StorePurchases.Invoice[j].Lines[k].VendorNumber === '1303') {
                    options.data[i].companyTran.push(options.data[i].StorePurchases.Invoice[j].Lines[k])
                    continue;
                }
                tempStorePurchasesDebitArray[0].Lines[k].Debit = options.data[i].StorePurchases.Invoice[j].Lines[k].total
                delete tempStorePurchasesDebitArray[0].Lines[k].total
                if (options.data[i].StorePurchases.Invoice[j].Lines[k].invoiceType === 'Credit') {
                    options.data[i].StorePurchases.Invoice[j].Lines[k].GLnumber = '2001'
                }
                else {
                    options.data[i].StorePurchases.Invoice[j].Lines[k].GLnumber = '10001'
                }
                if (tempStorePurchasesDebitArray[0].Lines[k].VendorNumber === '1303') {
                    tempStorePurchasesDebitArray[0].Lines[k].GLnumber = '4001'
                }
                newStorePurchasesArray.push(tempStorePurchasesDebitArray[0].Lines[k])
            }
            // delete out invoices that had no invoice number so at least script still works
            if (options.data[i].StorePurchases.Invoice[j].Lines.length === 0) {
                options.data[i].StorePurchases.Invoice.splice(j, 1)
                j--
            }
            options.data[i].StorePurchases.Invoice[j].Lines[0].billedVendorNumber = options.data[i].StorePurchases.Invoice[j].Lines[0].VendorNumber
            options.data[i].StorePurchases.Invoice[j].Lines[0].total = options.data[i].StorePurchases.Invoice[j].Lines[0].invoiceTotal
            newStorePurchasesArray.push(options.data[i].StorePurchases.Invoice[j].Lines[0])
            options.data[i].StorePurchases.Invoice[j].Lines = newStorePurchasesArray
        }
    }

    //delete company transportation arrays from vendor arrays
    for (let i = 0; i < options.data.length; i++) {
        for (let j = 0; j < options.data[i].StorePurchases.Invoice.length; j++) {
            if (options.data[i].StorePurchases.Invoice[j].Lines[0].VendorNumber === '1303') {
                options.data[i].StorePurchases.Invoice.splice(j, 1)
                j--
            }
        }
    }

    // NEW LOGIC: delete all credit MOPs and debit store purchases, sum them and add extra balance line
    // less efficient to do it here but was change customer wanted so less time
    // do not delete cash over short GL line
    let totalCredit = 0
    let totalDebit = 0
    for (let i = 0; i < options.data.length; i++) {
        for (let j = 0; j < options.data[i].Lines.length; j++) {
            if (options.data[i].Lines[j].Debit) {
                if (options.data[i].Lines[j].GL === 'Fuel' || options.data[i].Lines[j].GL === '10001' ||
                    options.data[i].Lines[j].GL === 'Inside Store Sales' || options.data[i].Lines[j].GL === 'Sales Tax Total'
                    || options.data[i].Lines[j].GL === 'Instant Lottery Sales' || options.data[i].Lines[j].GL === 'Online Lottery Sales') {
                    options.data[i].Lines.splice(j, 1)
                    j--
                    continue;
                }
            }
            if (options.data[i].Lines[j].Amount) {
                if (options.data[i].Lines[j].MOPId && options.data[i].Lines[j].GL !== 'Short / Over' || options.data[i].Lines[j].GL === '10001') {
                    options.data[i].Lines.splice(j, 1)
                    j--
                    continue;
                }

            }
            // if nothing taken out, increment totals
            if (options.data[i].Lines[j].Amount) {
                totalCredit += parseFloat(options.data[i].Lines[j].Amount)
            }
            if (options.data[i].Lines[j].Debit) {
                totalDebit += parseFloat(options.data[i].Lines[j].Debit)
            }
        }
        let roundedtotalDebit = Math.round(totalDebit * 100) / 100
        let roundedtotalCredit = Math.round(totalCredit * 100) / 100
        let debitDiff = roundedtotalCredit - roundedtotalDebit
        let creditDiff = roundedtotalDebit - roundedtotalCredit
        creditDiff = creditDiff.toFixed(2)
        debitDiff = debitDiff.toFixed(2)
        // finally, push a 10001 line with debit if the debit amount was less than credit, or a credit amaount if credit more than debit
        if (totalDebit < totalCredit) {
            options.data[i].Lines.push({
                "GL": "10001",
                "memo": "GL Balance Line",
                "Debit": debitDiff
            })
        }
        else if (totalCredit < totalDebit) {
            options.data[i].Lines.push({
                "GL": "10001",
                "memo": "GL Balance Line",
                "Amount": creditDiff
            })
        }
    }
    return options.data

}


function summarizeStorePurchases(vendArray) {
    // summarize store purchases after they are grouped by vendor (as vendArray). Need to separate data into GL groupings first,
    // second, need to total each grouping by cash or credit, and can delete all objects except for one object per GL for credit and one for debit
    // finally, need to add GL logic if amounts are positive or negative.
    let singleAccountNums = []
    let glArray = []
    for (let i = 0; i < vendArray.Lines.length; i++) {
        let accountNum = vendArray.Lines[i].GLnumber
        let index = singleAccountNums.indexOf(accountNum);
        // if index isn't -1, it was found. Add values to array in proper places
        // group by GL. just group the data by GL
        if (index >= 0) {
            // continue to next iteration here so we don't push duplicates into final array to return
            continue;
        }
        singleAccountNums.push(accountNum);
    }
    // for each gl in the set, push an empty array into the store purchase array
    for (let i = 0; i < singleAccountNums.length; i++) {
        glArray.push({ "Lines": [] })
    }
    // now add all GL data to each element of glArray
    for (let i = 0; i < vendArray.Lines.length; i++) {
        let accountNum = vendArray.Lines[i].GLnumber
        let index = singleAccountNums.indexOf(accountNum)
        glArray[index].Lines.push(vendArray.Lines[i])
    }

    // const util = require('util')
    // console.log(util.inspect(glArray[0], {showHidden: false, depth: null}))
    for (let i = 0; i < glArray.length; i++) {
        glArray[i] = summarizeGLArray(glArray[i])
    }

    // now that glArray is completely organized by GL and summed by cash/credit, we just want to send that data back on top Lines level
    let newGlArray = []
    for (let i = 0; i < glArray.length; i++) {
        Array.prototype.push.apply(newGlArray, glArray[i].Lines)
    }
    return { "Lines": newGlArray }
}

function summarizeGLArray(glArray) {

    // summarize store purchases after they are grouped by vendor (as glArray). Need to separate data into GL groupings first
    // second, need to total each grouping, and can delete all objects except for one object per GL for credit and one for debit
    // finally, need to add GL logic if amounts are positive or negative.
    let cashObject = JSON.parse(JSON.stringify(glArray.Lines[0]))
    let creditObject = JSON.parse(JSON.stringify(glArray.Lines[0]))
    cashObject.invoiceType = 'Cash'
    creditObject.invoiceType = 'Credit'
    let newStorePurchArray = []
    //group lines by GL number first. after, we will summarize each grouped array.
    // 1 - make set of catNos to know how many arrays to build.
    let catNoSet = new Set()
    // 2 - loop through and add to set, then turn set into array 
    for (let i = 0; i < glArray.Lines.length; i++) {
        catNoSet.add(glArray.Lines[i].CatNO)
    }
    catNoSet = Array.from(catNoSet)
    // 3 - create empty arrays for each element in the set, to push the GL objects into
    for (let i = 0; i < catNoSet.length; i++) {
        newStorePurchArray.push({ "Lines": [] })
    }
    // 4 - put the corresponding GL objects in each one of the above array 
    for (let i = 0; i < glArray.Lines.length; i++) {
        // if catNo not 0 (probably a 'charge' linetype, copy over catNO to class (the 0 CatNOs will map to nothing)
        if (glArray.Lines[i].CatNO !== '0') {
            glArray.Lines[i].class = glArray.Lines[i].CatNO
        }
        glArray.Lines[i].Cost = parseFloat(glArray.Lines[i].Cost)
        let index = catNoSet.indexOf(glArray.Lines[i].CatNO)
        newStorePurchArray[index].Lines.push(glArray.Lines[i])

        //push all depts into Lines for JE
        // Array.prototype.push.apply(options.data[i].Lines, newStorePurchArray)
    }
    // 5 - summarize each array into one object, into one Lines array
    let finalLinesArray = []
    for (let i = 0; i < newStorePurchArray.length; i++) {
        let arrayTotal = 0
        let singleObject = JSON.parse(JSON.stringify(newStorePurchArray[i].Lines[0]))
        for (let j = 0; j < newStorePurchArray[i].Lines.length; j++) {
            arrayTotal += newStorePurchArray[i].Lines[j].Cost
        }
        //round to nearest cent
        arrayTotal = Math.round(arrayTotal * 100) / 100
        arrayTotal = arrayTotal.toFixed(2)
        singleObject.total = arrayTotal
        finalLinesArray.push(singleObject)
    }
    // 6 - return lines array with all of the above objects
    return { "Lines": finalLinesArray }

}

function convertOptions(options, listOfArrayFields) {
    if (options && options.data && options.data.length) {
        for (let i = 0; i < options.data.length; i++) {
            options.data[i] = simplifyJson(options.data[i], listOfArrayFields)
        }
    }
    return options
}


function simplifyJson(rawJSON, listOfArrayFields) {
    // Start of helper functions
    const _ = {
        isBoolean: function (value) { return value === true || value === false },
        isString: function (value) { return typeof value === 'string' }
    }
    function simplifyRawJSONGeneratedFromXML(rawJSON, currPathStack, options) {
        const rawJsonAttrField = options.rawJsonAttrField
        const rawJsonTextField = options.rawJsonTextField
        const attributePrefix = options.attributePrefix
        const textNodeName = options.textNodeName
        const listNodesST = options.listNodesST
        const mixedNodesST = options.mixedNodesST

        // remove array structure for child tags if not a listnode and only single child is present
        for (const key in rawJSON) {
            if (key === rawJsonAttrField || key === rawJsonTextField) continue
            let childNodeName = key
            let val = rawJSON[childNodeName]
            if (!Array.isArray(val)) {
                // Should occur only if default xml parser generates different structure.
                // Thus braking the json output struture contract.
                // logger.error(childNodeName, val)
                throw Error('Invalid xml converted js tree structure. childNode should be always array.')
            }

            // makes currPathStack to represent child path
            currPathStack.push(childNodeName)
            val = val.map((childNodeValue) => {
                return simplifyRawJSONGeneratedFromXML(childNodeValue, currPathStack, options)
            })
            if (val.length === 1) {
                // check if LIST NODES search tree contains child node path
                const isListNode = listNodesST && hasExactMatch(listNodesST, currPathStack)
                // logger.info('isListNode', childNodePath, isListNode)
                rawJSON[childNodeName] = isListNode ? val : val[0]
            } else {
                rawJSON[childNodeName] = val
            }
            // resets currPathStack to current path
            currPathStack.pop()
        }

        // add attributes to node itself
        if (rawJSON[rawJsonAttrField]) {
            let attrs = rawJSON[rawJsonAttrField]
            delete rawJSON[rawJsonAttrField]
            for (const attrName in attrs) {
                let jsonKeyName = attributePrefix + attrName
                if (rawJSON.hasOwnProperty(jsonKeyName)) {
                    // logger.error(jsonKeyName, rawJSON)
                    throw Error('PARSERS_XML_NAME_COLLISION')
                }
                rawJSON[jsonKeyName] = attrs[attrName]
            }
        }
        // rename text node
        if (rawJSON[rawJsonTextField]) {
            let text = rawJSON[rawJsonTextField]
            delete rawJSON[rawJsonTextField]
            if (Object.keys(rawJSON).length === 0) {
                // check if MIXED NODES search tree contains current node path
                const isMixedNode = mixedNodesST && hasExactMatch(mixedNodesST, currPathStack)
                if (!isMixedNode) return text
            }
            if (rawJSON.hasOwnProperty(textNodeName)) {
                // logger.error(textNodeName, rawJSON)
                throw Error('PARSERS_XML_NAME_COLLISION')
            }
            rawJSON[textNodeName] = text
        }
        return rawJSON
    }

    function hasExactMatch(ST, pathAsArray) {
        let curr = ST.rootNode
        let nodes = pathAsArray
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            if (curr === undefined || curr === null || !curr.hasOwnProperty(node)) {
                return false
            }
            curr = curr[node]
        }
        return ST.endNodes.has(curr)
    }

    function buildSearchTree(arrayOfPaths, isIncludeOrExcludePaths, opts) {
        let rootNode = {}
        let endNodes = new Set()

        arrayOfPaths.forEach(path => {
            if (!_.isString(path)) throw Error(`Unexpected Error. Expected a string but recieved ${typeof path}.`)
            let nodes = getPathAsArray(path, opts)
            // add nodes to ST
            let curr = rootNode
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i]
                if (isIncludeOrExcludePaths && endNodes.has(curr)) {
                    // This is a optimisation step for include or exlcude paths.
                    // e.g if include paths = ['/a/b', 'a/b/c'], search tree can be simply: root->''->'a'->'b'
                    return
                }
                if (!curr.hasOwnProperty(node)) {
                    curr[node] = {}
                }
                curr = curr[node]
            }
            endNodes.add(curr)
        })
        if (isIncludeOrExcludePaths) endNodes = null
        return { rootNode, endNodes }
    }

    function getPathAsArray(path, opts) {
        const PS = opts.PS || '/'
        const ignorePSAtStart = _.isBoolean(opts.ignorePSAtStart) ? opts.ignorePSAtStart : true
        const prefixPath = opts.prefixPath

        if (_.isString(prefixPath) && prefixPath !== opts.PS) {
            if (ignorePSAtStart) {
                if (!path.startsWith(PS)) path = PS + path
                path = prefixPath + path
            } else {
                if (path.startsWith(PS)) path = prefixPath + path
            }
        } else {
            if (ignorePSAtStart && !path.startsWith(PS)) {
                path = PS + path
            }
        }

        // remove path separator/delimiter from end if exists i.e /a/b/ should become /a/b
        if (path.endsWith(PS)) path = path.substring(0, path.length - PS.length)
        return path.split(PS)
    }
    // End of helper functions
    let options = {
        PS: '/', // path separator or delimiter
        includeNodesST: null,
        excludeNodesST: null,
        mixedNodesST: null,
        listNodesST: null,
        attributePrefix: '',
        textNodeName: '&txt',
        rawJsonAttrField: '$',
        rawJsonTextField: '_'
    }
    if (listOfArrayFields && Array.isArray(listOfArrayFields) && listOfArrayFields.length) {
        options.listNodesST = buildSearchTree(listOfArrayFields, false, options)
    }
    return simplifyRawJSONGeneratedFromXML(rawJSON, [''], options)
}