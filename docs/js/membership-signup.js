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
//var memberId;
//var murakamiTransactionId;
//var sumupTransactionId;

function createMemberAndCheckout() {
  // 1. Create member - mark as unpaid
  // 2. Log internal Murakami transaction
  // 3. Create SumUp checkout

  var errors = changePage("#membership-terms", "#payment-details");
  
  if(errors.length === 0) { 
    window.location.href = "#"; // Take user to top of the page.
    $("#proceedToPaymentButton").prop("disabled", true);
    $("#loading").removeClass("d-none");
    $("#membership-signup-form").addClass("d-none");
    
    $.ajax({
      url: "https://murakami.shrubcoop.org/api/post/members/remote-add?key=" + murakamiMembershipKey,
      type: "POST",
      data: newMember,
      statusCode: {
        200: function(res) { 
          if(!res.SumUp || !res.murakami) {
            throw "";
          }

          setupPaymentDialog(res.SumUp.id, res.murakami.transaction_id, res.murakami.member_id);
        },
        400: function(res) {
          writeErrorMessage(res.responseJSON.error || "Something went wrong! Please try again.");
        }
      }
    });
  }
}

function setupPaymentDialog(checkoutId, murakamiTransactionId, member_id) {
  SumUpCard.mount({
      checkoutId: checkoutId,
      onResponse: function(type, body) {
        if(type === "success" && body.transaction_code) {
          // Hide payment dialog, verify payment with Murakami - membership renewed.
          verifyPayment(body.transaction_code, murakamiTransactionId, member_id);
        } else if(type === "error") {
          // Handle error.
          $("#payment-details-wrapper").addClass("d-none");
          writeErrorMessage("Something went wrong processing your payment! Please check that you have entered your details correctly");
        } else {
          console.log("Payment state:", type, body);
        }
      },
    onLoad: function() {
      // Show payment dialog
      $("#loading").addClass("d-none");
      $("#membership-signup-form").removeClass("d-none");
      $("#payment-details-wrapper").removeClass("d-none");
    }
  });
}

function verifyPayment(SumUpTransactionId, murakamiTransactionId, member_id) {
  // 1. Verify that payment was successful
  // 2. Mark member as paid
  // 3. Update internal Murakami transaction as successful
  // 4. Send member welcome email
  $.ajax({
    url: "https://murakami.shrubcoop.org/api/post/members/remote-add/verify-payment?key=" + murakamiMembershipKey,
    type: "POST",
    data: { SumUpTransactionId: SumUpTransactionId, murakamiTransactionId: murakamiTransactionId, member_id: member_id },
    statusCode: {
      200: function(verificationResponse) {
        writeSuccessMessage("Your membership application has been processed successfully! A confirmation email will be with you shortly");
      }, 
      400: function(verificationResponse) { 
        writeErrorMessage(verificationResponse.responseJSON.error | "Something went wrong! You may have been charged");
        // Flesh out error handling.
      }
    }
  });
}

function proceedToPayment() {
  createMemberAndCheckout();
}

function writeErrorMessage(errorMessage) {
  $("#loading").addClass("d-none");
  $("#membership-signup-form").addClass("d-none");
 
  $("#errorBoxContainer").removeClass("d-none");
  $("#errorBoxMessage").html(errorMessage);
}

function writeSuccessMessage(successMessage) {
  $("#loading").addClass("d-none");
  $("#membership-signup-form").addClass("d-none");
 
  $("#successBoxContainer").removeClass("d-none");
  $("#successBoxMessage").text(successMessage);
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
    url: "https://murakami.shrubcoop.org/api/get/members/sign-up-info?key=" + murakamiMembershipKey,
    type: "GET",
    success: function(murakamiResponse) {
      callback(murakamiResponse.signUpInfo);
    }
  });
}
