/*
 * jQuery creditcard2 extension for the jQuery Validation plugin (http://plugins.jquery.com/project/validate).
 * Ported from http://www.braemoor.co.uk/software/creditcard.shtml by John Gardner, with some enhancements.
 *
 * Author: Jack Killpatrick
 * Copyright (c) 2010 iHwy, Inc.
 *
 * Version 1.0.1 (1/12/2010)
 * Tested with jquery 1.2.6, but will probably work with earlier versions.
 *
 * History:
 * 1.0.0 - released 2008-11-17
 * 1.0.1 - released 2010-01-12 -> updated card prefixes based on data at: http://en.wikipedia.org/wiki/Credit_card_number and added support for LaserCard
 *
 * Visit http://www.ihwy.com/labs/jquery-validate-credit-card-extension.aspx for usage information
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

var cardTypes = [];
cardTypes[0] = {
  cardName: "Visa",
  lengths: "13,16",
  prefixes: "4",
  checkdigit: true
};
cardTypes[1] = {
  cardName: "MasterCard",
  lengths: "16",
  prefixes: "51,52,53,54,55",
  checkdigit: true
};

cardTypes[2] = {
  cardName: "AmEx",
  lengths: "15",
  prefixes: "34,37",
  checkdigit: true
};
cardTypes[3] = {
  cardName: "Discover",
  lengths: "16",
  prefixes: "6011,622,64,65",
  checkdigit: true
};
cardTypes[4] = {
  cardName: "Maestro",
  lengths: "12,13,14,15,16,18,19",
  prefixes: "5018,5020,5038,6304,6759,6761",
  checkdigit: true
};
cardTypes[5] = {
  cardName: "VisaElectron",
  lengths: "16",
  prefixes: "417500,4917,4913,4508,4844",
  checkdigit: true
};

// Credit card expiration dates.

var validMonths = [];
var validYears = [];

var currentYear = parseInt(
  new Date()
    .getFullYear()
    .toString()
    .substr(2, 2)
);

var currentMonth = parseInt(new Date().getMonth()) + 1;

if (currentMonth < 10) {
  currentMonth = "0" + currentMonth;
}

for (i = 0; i < 13; i++) {
  if (i != 0) {
    validYears.push((currentYear + +i).toString());

    if (i < 10) {
      validMonths.push(("0" + i).toString());
    } else {
      validMonths.push(i.toString());
    }
  } else {
    validYears.push(currentYear.toString());
  }
}

function validateCardNumber(cardNumber, cardName) {
  try {
    var cardType = -1;
    for (var i = 0; i < cardTypes.length; i++) {
      if (cardName.toLowerCase() == cardTypes[i].cardName.toLowerCase()) {
        cardType = i;
        break;
      }
    }
    if (cardType == -1) {
      return false;
    } // card type not found

    cardNumber = cardNumber.replace(/[\s-]/g, ""); // remove spaces and dashes
    if (cardNumber.length == 0) {
      return false;
    } // no length

    var cardexp = /^[0-9]{13,19}$/;
    if (!cardexp.exec(cardNumber)) {
      return false;
    } // has chars or wrong length

    cardNumber = cardNumber.replace(/\D/g, ""); // strip down to digits

    if (cardTypes[cardType].checkdigit) {
      var checksum = 0;
      var mychar = "";
      var j = 1;

      var calc;
      for (i = cardNumber.length - 1; i >= 0; i--) {
        calc = Number(cardNumber.charAt(i)) * j;
        if (calc > 9) {
          checksum = checksum + 1;
          calc = calc - 10;
        }
        checksum = checksum + calc;
        if (j == 1) {
          j = 2;
        } else {
          j = 1;
        }
      }

      if (checksum % 10 != 0) {
        return false;
      } // not mod10
    }

    var lengthValid = false;
    var prefixValid = false;
    var prefix = [];
    var lengths = [];

    prefix = cardTypes[cardType].prefixes.split(",");
    for (i = 0; i < prefix.length; i++) {
      var exp = new RegExp("^" + prefix[i]);
      if (exp.test(cardNumber)) prefixValid = true;
    }
    if (!prefixValid) {
      return false;
    } // invalid prefix

    lengths = cardTypes[cardType].lengths.split(",");
    for (j = 0; j < lengths.length; j++) {
      if (cardNumber.length == lengths[j]) lengthValid = true;
    }
    if (!lengthValid) {
      return false;
    } // wrong length

    return true;
  } catch (err) {
    return false;
  }
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateExpirationDate(month, year) {
  try {
    if (validMonths.includes(month) && validYears.includes(year)) {
      if (year == currentYear) {
        if (month >= currentMonth) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

function validateCVVNumber(cvv) {
  if (cvv.length == 3) {
    if (!isNaN(cvv)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function validateMembershipSelect() {
  var errors = {};

  if (!["full-year", "half-year"].includes(newMember.period)) {
    errors["period"] = { message: "Select a valid membership period" };
  }

  if (newMember.amount < prices[0]) {
    errors["amount"] = { message: "Enter a valid membership price" };
  }

  return errors;
}
