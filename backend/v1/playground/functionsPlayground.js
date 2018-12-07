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

// formatBrazilianPhoneNumber("32991267913");
// formatBrazilianPhoneNumber("3233771649");
