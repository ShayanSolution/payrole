import Constants from '../Constants.js'
// const Attendance = require("../data/attendence data.json");

const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate()
}

const perDayLeaveDeduction = (salary) => {
    return (salary / Constants.MONTH_DAYS).toFixed(2)
}

const getNumberOfDays = (start, end) => {
    const date1 = new Date(start)
    const date2 = new Date(end)
    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24
    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime()
    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay)
    return diffInDays
}

const late_arrivals_deducion = (late_arrivals, exemptions) => {
    if (parseInt(late_arrivals) > parseInt(exemptions)) {
        return late_arrivals * Constants.PER_LATE_ARRIVAL
    } else {
        return 0
    }
}

const getTotalLeaves = (leaves) => {
    const totalLeaves = leaves
        .filter((leave) => leave.type !== 'monthly quota')
        .reduce(function (pre, curr) {
            return pre + curr.no_of_days
        }, 0)
    return totalLeaves
}

const getAttendance = (Attendance) => {
    const filteredAttendace = Attendance.filter(
        (item) => item.Name !== 'Guest'
    ).map((item) => {
        return {
            ...item,
            Date: new Date(item.Date),
            SumOverTime: item.SumOverTime && item.SumOverTime.replace('.', ':'),
        }
    })
    return filteredAttendace
}

function getCurrentQuarter() {
    let today = new Date(),
        quarter = Math.floor(today.getMonth() / 3),
        startDate,
        endDate

    startDate = new Date(today.getFullYear(), quarter * 3, 1)
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0)

    return {
        StartDate: new Date(startDate),
        EndDate: new Date(endDate),
    }
}

const calculateTax = (monthly_salary) => {
  let tax = 0;
  let annual_salary = monthly_salary * 12;
  if (annual_salary >= 600000 && annual_salary < 1200000) {
    tax = ((annual_salary - 600000) * 0.025) / 12;
  } else if (annual_salary >= 1200000 && annual_salary < 2400000) {
    tax = ((annual_salary - 1200000) * 0.125 + 15000) / 12;
  } else if (annual_salary >= 2400000 && annual_salary < 3600000) {
    tax = ((annual_salary - 2400000) * 0.2 + 165000) / 12;
  } else if (annual_salary >= 3600000 && annual_salary < 6000000) {
    tax = ((annual_salary - 3600000) * 0.25 + 405000) / 12;
  } else if (annual_salary >= 6000000 && annual_salary < 12000000) {
    tax = ((annual_salary - 6000000) * 0.325 + 1005000) / 12;
  } else if (annual_salary >= 12000000 && annual_salary < 20000000) {
    tax = ((annual_salary - 12000000) * 0.35 + 2955000) / 12;
  }
  return tax;
};

const getFirstAndLastDayofMonth = (month) => {
    let first_day = new Date(
        new Date(month ? month : new Date()).getFullYear(),
        new Date(month ? month : new Date()).getMonth(),
        1
    )
    let last_day = new Date(
        new Date(month ? month : new Date()).getFullYear(),
        new Date(month ? month : new Date()).getMonth() + 1,
        0
    )

    return {
        first: first_day,
        last: last_day,
    }
}

const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const monthFullNames = [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'Octuber',
    'November',
    'December',
]
const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

const monthsLong = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
}
export default {
    daysInMonth,
    perDayLeaveDeduction,
    getNumberOfDays,
    late_arrivals_deducion,
    getTotalLeaves,
    getCurrentQuarter,
    getAttendance,
    getFirstAndLastDayofMonth,
    monthNames,
    monthFullNames,
    dayNames,
    monthsLong,
    calculateTax,
}
