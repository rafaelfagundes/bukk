const _ = require("lodash");

exports.getElementYPosition = elementId => {
  return (
    document.getElementById(elementId).getBoundingClientRect().top +
    window.scrollY
  );
};

exports.getSpecialist = (id, specialists) => {
  const index = _.findIndex(specialists, function(o) {
    return o.employee._id === id;
  });
  if (index >= 0) {
    return specialists[index];
  } else {
    return null;
  }
};
exports.getService = (id, services) => {
  const index = _.findIndex(services, function(o) {
    return o._id === id;
  });
  if (index >= 0) {
    return services[index];
  } else {
    return null;
  }
};

exports.generateUUID = () => {
  var d = new Date().getTime();
  if (Date.now) {
    d = Date.now(); //high-precision timer
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

exports.formatBrazilianPhoneNumber = phone => {
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
};
