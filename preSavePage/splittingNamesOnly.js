// splits last, first, and middle name for Employee, and reorganizes for supervisor so NS can read matches
let options = {
  "errors": [],
  "data": [
    {
      "Employee Name (Last Suffix, First MI)": "Employee1, Jean G.",
      "Job Title": "Associate Full Stack Dev",
      "Supervisor Name (Unsecured)": "Supervisor, Billy B.",
      "Employee Number": "99999",
      "Local Currency": "US Dollar",
      "Email Address": "ecoutant@company.com",
      "Company": "Company, LLC",
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
      "Employee Number": "99999",
      "Local Currency": "US Dollar",
      "Email Address": "ecoutant@company.com",
      "Company": "Company, LLC",
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


function splitNames(options) {
  for (let i = 0; i < options.data.length; i++){
// we need to fix the format of the names to go into NetSuite correctly. First, remove the periods from any middle names, then rearrange the first, middle, and last names. 
options.data[i]['Employee Name (Last Suffix, First MI)'] = options.data[i]['Employee Name (Last Suffix, First MI)'].replace(/\./g, '')
let employeeNameFix = options.data[i]['Employee Name (Last Suffix, First MI)'].trim().split(', ')
if (employeeNameFix.length > 1) {
  employeeNameFix = [].concat(employeeNameFix[0], employeeNameFix[1].split(' '))
}
// we need to create a first, middle, and last name seperate field in the exported object to add to NetSuite easily
if (employeeNameFix.length > 2) {
  options.data[i].lastName = employeeNameFix[0]
  options.data[i].middle = employeeNameFix[2]
  options.data[i].firstName = employeeNameFix[1]
}
else if (employeeNameFix.length === 2) {
  options.data[i].lastName = employeeNameFix[0]
  options.data[i].middle = ''
  options.data[i].firstName = employeeNameFix[1]
}
else if (employeeNameFix.length === 1) {
  options.data[i].lastName = employeeNameFix[0]
  options.data[i].middle = ''
  options.data[i].firstName = ''
}
else {
  options.data[i].firstName = ''
  options.data[i].middle = ''
  options.data[i].lastName = ''
}

// Since supervisor name is one field in NetSuite, we just have to put them in the right format so NetSuite recognizes them
options.data[i]['Supervisor Name (Unsecured)'] = options.data[i]['Supervisor Name (Unsecured)'].replace(/\./g, '')
let supervisorNameFix = options.data[i]['Supervisor Name (Unsecured)'].trim().split(', ')
if (supervisorNameFix.length > 1) {
  supervisorNameFix = [].concat(supervisorNameFix[0], supervisorNameFix[1].split(' '))
}
if (supervisorNameFix.length > 2) {
  options.data[i]['Supervisor Name (Unsecured)'] = supervisorNameFix[1] + ' ' + supervisorNameFix[2] + ' ' + supervisorNameFix[0]
}
else if (supervisorNameFix.length === 2) {
  options.data[i]['Supervisor Name (Unsecured)'] = supervisorNameFix[1] + ' ' + supervisorNameFix[0]
}
else if (supervisorNameFix.length === 1) {
  options.data[i]['Supervisor Name (Unsecured)'] = supervisorNameFix[0]
}
else {
  options.data[i]['Supervisor Name (Unsecured)'] = ''
}
supervisorNameFix = supervisorNameFix[1] + ' ' + supervisorNameFix[0]
console.log(options.data)


  }
  return {
    data: options.data,
    errors: options.errors
  }
}

splitNames(options)
