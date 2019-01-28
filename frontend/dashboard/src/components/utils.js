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

exports.formatCEP = cep => {
  const _cep = String(cep.replace(/[^\d]+/g, ""));

  if (_cep.length === 8) {
    const c = String(cep);
    return c[0] + c[1] + c[2] + c[3] + c[4] + "-" + c[5] + c[6] + c[7];
  } else {
    return String(cep.replace(/[^\d]+/g, ""));
  }
};

exports.formatCnpj = c => {
  c = String(c.replace(/[^0-9]/g, ""));
  if (c.length === 14) {
    return `${c[0]}${c[1]}.${c[2]}${c[3]}${c[4]}.${c[5]}${c[6]}${c[7]}/${c[8]}${
      c[9]
    }${c[10]}${c[11]}-${c[12]}${c[13]}`;
  }
  return c;
};

exports.formatCpf = c => {
  c = String(c.replace(/[^0-9]/g, ""));
  if (c.length === 11) {
    return `${c[0]}${c[1]}${c[2]}.${c[3]}${c[4]}${c[5]}.${c[6]}${c[7]}${c[8]}-${
      c[9]
    }${c[10]}`;
  }
  return c;
};

exports.formatHour = h => {
  h = String(h.replace(/[^0-9]/g, ""));
  if (h.length === 3) {
    let hour = h.substring(0, h.length - 2);
    let minute = h.substring(h.length - 2);
    return `${hour}:${minute}`;
  } else if (h.length === 4) {
    let hour = h.substring(0, h.length - 2);
    let minute = h.substring(h.length - 2);
    return `${hour}:${minute}`;
  } else {
    return h;
  }
};

exports.formatCurrency = c => {
  return parseFloat(String(c))
    .toFixed(2)
    .replace(".", ",");
};
