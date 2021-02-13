// Blank member object
var newMember = {
  period: "",
  amount: "",
  first_name: "",
  last_name: "",
  dob: "",
  email: "",
  address: "",
  phone_no: "",
  contact_consent_check: null,
  our_vision_check: null,
  safer_spaces_check: null,
  membership_benefits_check: null,
  privacy_notice_check: null,
  card_type: "",
  card_number: "",
  cardholder_name: "",
  expiry_month: "",
  expiry_year: "",
  cvv: ""
};

// Globally store important IDs for error handling.
var memberId;
var murakamiTransactionId;
var sumupTransactionId;

function createMemberAndCheckout(callback) {
  // 1. Create member - mark as unpaid
  // 2. Log internal Murakami transaction
  // 3. Create SumUp checkout
  $.ajax({
    url: "https://localhost:4000/api/post/members/remote-add?key=" + membershipSignUpKey,
    type: "POST",
    data: newMember,
    success: function(murakamiResponse) {
      console.log("Murakami Response:", murakamiResponse);
      // Store Murakami ID, SumUp ID etc.
      if (murakamiResponse.status == "ok") {
        callback(murakamiResponse)
      }
    },
    error: function(murakamiResponse) {
      console.log("Murakami Response:", murakamiResponse);
      signUpSubmissionError("Something went wrong! You have not been charged");
      // Flesh out error handling.
    }
  });
}

function makePayment(cardDetails, callback) {
  // Make payment to SumUp.
  $.ajax({
    url:
      "https://api.sumup.com/v0.1/checkouts/" +
      murakamiResponse.checkoutId,
    type: "PUT",
    headers: { "Content-Type": "application/json" },
    data: {
      payment_type: "card",
      card: {
        name: cardDetails.cardholder_name,
        number: cardDetails.card_number,
        expiry_month: cardDetails.expiry_month,
        expiry_year: cardDetails.expiry_year,
        cvv: cardDetails.cvv
      }
    },
    success: function(checkoutRes) {
      // Mark member as paid on Murakami.
      console.log("Checkout Response:", checkoutRes);
      if (checkoutRes.status == "PAID") {
        callback(checkoutRes);
      }
    }, 
    error: function(checkoutRes) {
      console.log("Checkout Response:", checkoutRes);
      signUpSubmissionError("Something went wrong! You may have been charged");
      // Flesh out error handling.
    }
  });
}

function verifyPayment(callback) {
  // 1. Verify that payment was successful
  // 2. Mark member as paid
  // 3. Update internal Murakami transaction as successful
  // 4. Send member welcome email
  $.ajax({
    url: "https://murakami.shrubcoop.org/api/post/members/remote-add/verify-payment?key=" + membershipSignUpKey,
    type: "POST",
    data: {
      murakamiTransactionId: murakamiTransactionId,
      sumupTransactionId: sumUpTransactionId
    },
    success: function(verificationResponse) {
      console.log("Verification Response:", verificationResponse);
      if (verificationResponse.status == "ok") {
        callback(verificationResponse);
      }
    }, 
    error: function(verificationResponse) { 
      console.log("Verification Response:", verificationResponse);
      signUpSubmissionError("Something went wrong! You may have been charged");
      // Flesh out error handling.
    }
  });
}

function completeSignUp() {
  // Remove any error messages (payment detail)
  $("#payment-details-errors").html("");

  // Validate payment details - formParameters defines what IDs to look for in the DOM
  var formParameters = {
    card_type: "",
    card_number: "",
    cardholder_name: "",
    expiry_month: "",
    expiry_year: "",
    cvv: ""
  };

  var errors = validateMembershipForm(formParameters);

  // If there are no errors, proceed with membership sign up
  if (errors.length == 0) {
    // Show loading animation
    document.getElementById("completeSignUpButton").innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';

    // Put card details in their own object, then delete from member object - card details should only ever be sent to SumUp.
    var cardDetails = {
      card_type: newMember.card_type,
      card_number: newMember.card_number,
      cardholder_name: newMember.cardholder_name,
      expiry_month: newMember.expiry_month,
      expiry_year: newMember.expiry_year,
      cvv: newMember.cvv
    };

    delete newMember.card_type;
    delete newMember.card_number;
    delete newMember.cardholder_name;
    delete newMember.expiry_month;
    delete newMember.expiry_year;
    delete newMember.cvv;

    createMemberAndCheckout(function(murakamiResponse) {
      memberId = murakamiResponse.memberId;
      murakamiTransactionId = murakamiResponse.transactionId;
      sumupCheckoutId = murakamiResponse.checkoutId;
      makePayment(cardDetails, function(checkoutResponse) {
        sumupTransactionId = checkoutResponse.transactionId;
        verifyPayment(function(verificationResponse) { 
          // Show sucess message
          var successMessage = document.createElement("p");
          successMessage.textContent = "Membership signup complete - a welcome email is on its way!";

          document.getElementById("memberSignUpSuccessContent").innerHTML = "";
          document.getElementById("memberSignUpSuccessContent").appendChild(successMessage);
          $("#memberSignUpSuccessAlert").removeClass("d-none");

          document.getElementById("completeSignUpButton").innerHTML = "Sign Up Complete :-)";
          document.getElementById("completeSignUpButton").disabled = true;
        })
      });
    })
  } else {
    // Client side validation errors.
    $("#payment-details-errors").html(createErrorMarkup(errors));
  }
}

function signUpSubmissionError(message) {
  var error = document.createElement("p");
  error.textContent = message;
  document.getElementById("memberSignUpErrorContent").innerHTML = "";
  document.getElementById("memberSignUpErrorContent").appendChild(error);
  $("#memberSignUpErrorAlert").removeClass("d-none");
  document.getElementById("completeSignUpButton").innerHTML = "Complete Sign Up";
}

function validateMembershipForm(parameters) {
  $("#memberSignUpErrorAlert").addClass("d-none");
  $("#memberSignUpSuccessAlert").addClass("d-none");
  var errors = [];
  Object.keys(parameters).forEach(function(key) {
    var DOMKey = "#" + key;

    if ($(DOMKey).prop("type") == "checkbox") {
      if ($(DOMKey).prop("required") == true) {
        if ($(DOMKey).prop("checked") == true) {
          newMember[key] = true;
        } else {
          errors.push(key.toProperCase() + " is required.");
        }
      }
    } else {
      if ($("#" + key).prop("required") == true) {
        if ($(DOMKey).val()) {
          var value = $(DOMKey).val();
          if (key == "email" && !validateEmail(value)) {
            errors.push("Please enter a valid email address.");
          } else if (
            key == "card_number" &&
            !validateCardNumber(value, $("#card_type").val())
          ) {
            errors.push("Please enter a valid card number.");
          } else if (
            (key == "expiry_month" || key == "expiry_year") &&
            !validateExpirationDate(
              $("#expiry_month").val(),
              $("#expiry_year").val()
            )
          ) {
            errors.push("Please enter a valid card expiration date.");
          } else if (key == "cvv" && !validateCVVNumber(value)) {
            errors.push("Please enter a valid CVV number.");
          } else {
            newMember[key] = value;
          }
        } else {
          errors.push(key.toProperCase() + " is required.");
        }
      }
    }
  });

  /*if (errors.length > 0) {
    document.getElementById("memberSignUpErrorContent").innerHTML = "";
    $("#memberSignUpErrorAlert").removeClass("d-none");
    var errorUlPrefix = document.createElement("p");
    errorUlPrefix.className = "mb-1";
    errorUlPrefix.textContent = "Please fix the following errors to continue:";
    var errorUl = document.createElement("ul");
    for (i = 0; i < errors.length; i++) {
      var error = document.createElement("li");
      error.innerText = errors[i];
      errorUl.appendChild(error);
    }
    document
      .getElementById("memberSignUpErrorContent")
      .appendChild(errorUlPrefix);
    document.getElementById("memberSignUpErrorContent").appendChild(errorUl);
  }*/

  return errors;
}


// Fetches static content needed for signup - privacy policy, safer spaces policy etc.
function getSignUpInfo(callback){
  $.ajax({
    url:
      "https://murakami.shrubcoop.org/api/get/members/sign-up-info?key=" +
      membershipSignUpKey,
    type: "GET",
    success: function(murakamiResponse) {
      callback(murakamiResponse.signUpInfo);
    }
  });
}
