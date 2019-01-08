console.clear();
console.log("+++++++++++++++++++++++++");

const moment = require("moment");

function formatBrazilianPhoneNumber(phone) {
  if (phone.length === 11) {
    let _number = `(${phone[0]}${phone[1]}) ${phone[2]}${phone[3]}${phone[4]}${
      phone[5]
    }${phone[6]}-${phone[7]}${phone[8]}${phone[9]}${phone[10]}`;

    return _number;
  } else if (phone.length === 10) {
    let _number = `(${phone[0]}${phone[1]}) ${phone[2]}${phone[3]}${phone[4]}${
      phone[5]
    }-${phone[6]}${phone[7]}${phone[8]}${phone[9]}`;

    return _number;
  } else {
    return phone;
  }
}

function generateTimeTable(times, minTimeFrame = 30) {
  let _timeTable = [];

  times.forEach(time => {
    let _s = moment().set({
      hour: time.start.split(":")[0],
      minute: time.start.split(":")[1],
      second: "00"
    });
    let _e = moment().set({
      hour: time.end.split(":")[0],
      minute: time.end.split(":")[1],
      second: "00"
    });
    while (_s.isBefore(_e)) {
      if (_s.format("HH:mm") !== _e.format("HH:mm")) {
        _timeTable.push(moment(_s).format("HH:mm"));
      }
      _s.add(minTimeFrame, "minutes");
    }
  });

  _timeTable.forEach(time => {
    console.log(time);
  });

  return _timeTable;
}

// generateTimeTable(
//   [
//     { start: "8:00", end: "12:00" },
//     { start: "14:00", end: "18:00" },
//     { start: "19:00", end: "23:00" }
//   ],
//   30
// );

function generateMonthSchedule(date, workingDays, workingTime, timeFrame = 30) {
  let monthStart = moment(date);
  if (monthStart.isBefore(moment())) {
    monthStart = moment({ minute: "00", second: "00" });
  }
  const monthEnd = moment(date).add(1, "month");

  let dateSet = new Set();

  let times = [];

  while (monthStart.isBefore(monthEnd)) {
    // For each working time period
    workingTime.forEach(wTime => {
      // Start period
      let _s = moment(monthStart).set({
        hour: wTime.start.split(":")[0],
        minute: wTime.start.split(":")[1],
        second: "00"
      });

      //End period
      let _e = moment(monthStart).set({
        hour: wTime.end.split(":")[0],
        minute: wTime.end.split(":")[1],
        second: "00"
      });

      // Non working day filter
      if (workingDays.indexOf(moment(monthStart).weekday()) >= 0) {
        // Non working hour filter
        if (
          moment(monthStart).isSameOrAfter(_s) &&
          moment(monthStart).isBefore(_e)
        ) {
          times.push(moment(monthStart).toDate());
          dateSet.add(moment(monthStart).format("YYYY-MM-DD"));
        }
      }
    });
    monthStart.add(timeFrame, "minute");
  }

  const dates = Array.from(dateSet);

  return {
    dates,
    times
  };
}

const result = generateMonthSchedule(
  "2018-12",
  [1, 2, 3, 4, 5],
  [
    { start: "8:00", end: "12:00" },
    { start: "14:00", end: "18:00" },
    { start: "19:00", end: "23:00" }
  ],
  15
);

console.log(result);

// formatBrazilianPhoneNumber("32991267913");
// formatBrazilianPhoneNumber("3233771649");
