// adds 0's back to beginning of Employee ID, as their CSV export was removing them
let options = {
  "errors": [],
  "data": [
    {
      "Employee Name (Last Suffix, First MI)": "Employee1, Jean G.",
      "Job Title": "Associate Full Stack Dev",
      "Supervisor Name (Unsecured)": "Supervisor, Billy B.",
      "Employee Number": "31",
      "Local Currency": "US Dollar",
      "Email Address": "ecoutant@etq.com",
      "Company": "ETQ, LLC",
      "Location": "Boston",
      "EepUDField03": null,
      "Last Hire Date": "7/15/2019",
      "Shift": "None",
      "Class": "000 None",
      "Org Level 2": "7010 Product Development",
      "Original Hire Date": "7/15/2019",
      "Termination Date": null
    },
    {
      "Employee Name (Last Suffix, First MI)": "Billy, Bob F.",
      "Job Title": "Associate Full Stack Dev",
      "Supervisor Name (Unsecured)": "Supervisor, Billy B.",
      "Employee Number": "3234556",
      "Local Currency": "US Dollar",
      "Email Address": "ecoutant@etq.com",
      "Company": "ETQ, LLC",
      "Location": "Boston",
      "EepUDField03": null,
      "Last Hire Date": "7/15/2019",
      "Shift": "None",
      "Class": "000 None",
      "Org Level 2": "7010 Product Development",
      "Original Hire Date": "7/15/2019",
      "Termination Date": null
    }
  ]
}


function addLeadingZeroes(options) {
  for (let i = 0; i < options.data.length; i++) {
    if (options.data[i]['Employee Number'].length === 6) {
    }
    else if (options.data[i]['Employee Number'].length === 5) {
      options.data[i]['Employee Number'] = '0' + options.data[i]['Employee Number']
    }
    else if (options.data[i]['Employee Number'].length === 4) {
      options.data[i]['Employee Number'] = '00' + options.data[i]['Employee Number']
    }
    else if (options.data[i]['Employee Number'].length === 3) {
      options.data[i]['Employee Number'] = '000' + options.data[i]['Employee Number']
    }
    else if (options.data[i]['Employee Number'].length === 2) {
      options.data[i]['Employee Number'] = '0000' + options.data[i]['Employee Number']
    }
    else if (options.data[i]['Employee Number'].length === 1) {
      options.data[i]['Employee Number'] = '00000' + options.data[i]['Employee Number']
    }
    console.log(options.data)

  }
  return {
    data: options.data,
    errors: options.errors
  }
}

addLeadingZeroes(options)