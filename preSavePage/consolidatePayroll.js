//Creates a single object from a CSV of multiples rows, containing all of the data needed to create a single journal entry in NetSuite

const employeeLookup = {
  ' ': 2713,
  'Abidia,Layla': 2637,
  'Aguayo,Catarino Javier': 3083,
  'Aguayo,Maria': 3502,
  'Altamirano,Melissa': 2615,
  'Anastasi,Alyssa': 11020,
  'Alvarado-Pope,Aide Veronica': 3191,
  'Amar,Stefanie': 5,
  'Ballas,Gavin': 2626,
  'Billiot,Paige': 2633,
  'Brown,Gary': 2625,
  'Budati,Goutham Chakravarthy': 2622,
  'Burk,Sierra': 3528,
  'Camarena,Daniel': 2714,
  'Campanis,James': 2627,
  'Chen,Roujing': 2623,
  'Coronado,Antonio': 2642,
  'Dawson,Julie': 3880,
  'Delgado,Jesus Hernandez': 2628,
  'Duenas,Danica Clarice': 2621,
  'Duenas,Kristen': 2644,
  'Edwards,Juliette': 3300,
  'Ellner,Stewart': -5,
  'Hernandez,Elva': 3746,
  'Estes,Claire': 3294,
  'Estrada,Shane': 2715,
  'Gonzalez,Sergio': 2617,
  'Gorodinsky,Bianca': 2618,
  'Granger,Daniel': 2636,
  'Gravagno,Michael': 2632,
  'Heatherly,Margaret': 2716,
  'Hernandez,Jennifer': 2717,
  'Hiroto,Kyle': 2614,
  'Holder,Ryan': 10596,
  'Ingrassia,James': 11531,
  'Jelinek,Kyle': 2629,
  'Kim,Minkyung': 2645,
  'Lewis,Madeline Justice': 2619,
  'Lopez,Miguel': 2638,
  'Mahorney,Erica': 2631,
  'Martin,Giles': 2635,
  'Martinez,Ricardo': 2616,
  'Melchor,Cindy': 2620,
  'Mesadieu,Felicia': 2718,
  'Mueller,Grant': 3881,
  'Nayak,Vineet': 2624,
  'Oviedo,Dolores Iana': 3295,
  'Redwine,Stewart': 2634,
  'Ritchie,Ginger Mae': 2719,
  'Roan,Lauren': 2630,
  'Romano,Miranda': 2646,
  'Sakuei,Jasmine': 2643,
  'Seymour,Kalyn': 3296,
  'Semonson,Spencer': 3893,
  'Sokol,Natasha': 11532,
  'Soto,Adam': 2640,
  'Sunshine,Anna': 2641,
  'Szathmary Hagey,Sabina': 4247,
  'Tawde,Shivani': 11533,
  'Truong,Linh': 3297,
  'Ulves,Mason': 3298,
  'Volpe,Joseph': 2613,
  'Welch,Brendan': 2720,
  'Werner,Kristen': 2644,
  'Westrup,Enrique': 3299,
  'Murillo,Bethany': 10484,
  'Melchiorre,Garrick': 10485,
}

let accountMappings = {
  'Gross Wages-Bereavement': { 'Account': 348, 'Debit': true },
  'Gross Wages-Commission Aggregate': { 'Account': 351, 'Debit': true },
  'Gross Wages-Discretionary Bonus': { 'Account': 350, 'Debit': true },
  'Gross Wages-Discretionary Referral Bonus Earnings': { 'Account': 350, 'Debit': true },
  'Gross Wages-Doubletime': { 'Account': 349, 'Debit': true },
  'Gross Wages-Electronics Nontaxable': { 'Account': 346, 'Debit': true },
  'Gross Wages-Holiday': { 'Account': 354, 'Debit': true },
  'Gross Wages-Jury Duty': { 'Account': 348, 'Debit': true },
  'Gross Wages-Leave With Pay Earnings': { 'Account': 348, 'Debit': true },
  'Gross Wages-Leave Without Pay Earnings': { 'Account': 348, 'Debit': true },
  'Gross Wages-Penalty Pay': { 'Account': 349, 'Debit': true },
  'Gross Wages-Recoverable Draw': { 'Account': 351, 'Debit': true },
  'Gros Wages-Retro Regular Pay': { 'Account': 348, 'Debit': true },
  'Gross Wages-Separation Pay One Time': { 'Account': 348, 'Debit': true },
  'Gross Wages-Separation Pay Recurring': { 'Account': 348, 'Debit': true },
  'Gross Wages-Travel Pay': { 'Account': 346, 'Debit': true },
  'Gross Wages-Sick': { 'Account': 354, 'Debit': true },
  'Gross Wages-Straight-time 1.0': { 'Account': 349, 'Debit': true },
  'Gross Wages-Wait Time Penalty': { 'Account': 349, 'Debit': true },
  'Deductions - EE-401(K) Loan Repayment': { 'Account': 279, 'Debit': false },
  'Deductions - EE-Parking': { 'Account': 401, 'Debit': true },
  'Taxes - ER-Totals': { 'Account': 352, 'Debit': true },
  'Returned Deductions-Retirement Credit': { 'Account': 279, 'Debit': false },
  'Returned Deductions-Return Deduction': { 'Account': 348, 'Debit': true },
  'Gross Wages-Regular Earnings': { 'Account': 348, 'Debit': true },
  'Gross Wages-Overtime Earnings': { 'Account': 349, 'Debit': true },
  'Gross Wages-PTO': { 'Account': 354, 'Debit': true },
  'Gross Wages-Bus. Expense Reimb Nontaxable': { 'Account': 346, 'Debit': true },
  'Employer Paid Benefits-Totals': { 'Account': 353, 'Debit': true },
  'Workers Comp Fee-Totals': { 'Account': 355, 'Debit': true },
  'Employer Paid Benefits-401k/Roth Combination': { 'Account': 731, 'Debit': true },
  'Fees-Totals': { 'Account': 367, 'Debit': true },
  'Invoice Level Charges-Totals': { 'Account': 367, 'Debit': true },
}

function linesArr(object, current) {
  let arr = [];
  const keys = Object.keys(object);
  if (!current.Memo) return [];

  for (let z = 0; z < keys.length; z++) {
    const debit = object[keys[z]] >= 0 ? object[keys[z]] : 0;
    const credit = object[keys[z]] < 0 ? -object[keys[z]] : 0;
    arr.push({
      'Employee Name': current["Employee Name"], 'Department': current.Department, 'Memo': current.Memo,
      'Name': current.Name, 'Account': keys[z], 'Debit': debit, 'Credit': credit
    });
  }

  return arr;
}

function setLines(record, current) {
  let lines = {};
  const keys = Object.keys(record)

  for (let i = 0; i < keys.length; i++) {
    if (accountMappings[keys[i]]) {
      if (record[keys[i]]) {
        let total = lines[accountMappings[keys[i]].Account] || 0;
        let amt = parseFloat(parseFloat(record[keys[i]].replace(/[,$()]/g, '')).toFixed(2));
        // if (!accountMappings[keys[i]].Debit && record[keys[i]] != "$0.00") debugger;
        if (amt === 0) continue;
        total = accountMappings[keys[i]].Debit ? total + amt : total - amt;
        if (parseFloat(total) !== total) debugger;
        lines[accountMappings[keys[i]].Account] = parseFloat(total.toFixed(2));
      }
    }
  }
  return linesArr(lines, current);
}

function transform(data) {
  let current = {};

  current["Employee Name"] = data["Employee Name"];
  current.Department = data["Department Long Descr"].length > 1 ? data["Department Long Descr"] : "Finance";
  current.Memo = `Payroll End Date - ${data["Pay End Date"]}`;
  current.Name = employeeLookup[data["Employee Name"]];

  return setLines(data, current);
}

function setGrandTotal(obj) {
  if (obj.lines.length === 0) return;
  let credit = 0;
  let grand = {
    "Employee Name": "Grand Total",
    "Department": "",
    "Memo": obj.lines[0].Memo,
    "Name": "",
    "Account": "211",
    "Debit": 0
  }
  for (let z = 0; z < obj.lines.length; z++) {
    credit += obj.lines[z].Debit;
    credit -= obj.lines[z].Credit;
  }

  grand.Credit = parseFloat(credit.toFixed(2));
  obj.lines.push(grand);
}

function setMain(object) {
  let main = { lines: [] };

  for (let i = 0; i < object.length; i++) {
    if (object[i]["Employee Name"] === "Grand Totals") { break }
    main.lines = main.lines.concat(transform(object[i]));
  }

  setGrandTotal(main);

  return main;
}

function preSavePage(options) {
  const consolidated = setMain(options.data);
  return {
    data: [consolidated],
    errors: options.errors,
    abort: false
  }
}
