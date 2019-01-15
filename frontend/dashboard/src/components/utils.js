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
  const _cep = String(cep).replace("-", "");

  if (_cep.length === 8) {
    const c = String(cep);
    return c[0] + c[1] + c[2] + c[3] + c[4] + "-" + c[5] + c[6] + c[7];
  } else {
    return String(cep).replace("-", "");
  }
};
