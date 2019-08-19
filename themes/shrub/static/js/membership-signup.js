var newMember = {
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

function completeSignUp() {
  var errors = validateMembershipForm();
  if (errors.length == 0) {
    document.getElementById("completeSignUpButton").innerHTML =
      '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';

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

    // Create member, log transaction on Murakami
    $.ajax({
      url:
        "https://murakami.org.uk/api/post/members/remote-add?key=" +
        membershipSignUpKey,
      type: "POST",
      data: newMember,
      success: function(murakamiResponse) {
        console.log("Murakami Response:", murakamiResponse);

        if (murakamiResponse.status == "ok") {
          // Make payment.
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
                $.ajax({
                  url:
                    "https://murakami.org.uk/api/post/members/remote-add/verify-payment?key=" +
                    membershipSignUpKey,
                  type: "POST",
                  data: {
                    murakami_transaction_id: murakamiResponse.transaction_id,
                    sumup_transaction_id: checkoutResponse.transaction_id
                  },
                  success: function(verificationResponse) {
                    console.log("Verification Response:", verificationResponse);
                    if (status == "ok") {
                      var successMessage = document.createElement("p");
                      successMessage.textContent =
                        "Membership signup complete - a welcome email is on its way!";

                      document.getElementById(
                        "memberSignUpSuccessContent"
                      ).innerHTML = "";
                      document
                        .getElementById("memberSignUpSuccessContent")
                        .appendChild(success);
                      $("#memberSignUpSuccessAlert").removeClass("d-none");

                      document.getElementById(
                        "completeSignUpButton"
                      ).innerHTML = "Sign Up Complete :-)";
                      document.getElementById(
                        "completeSignUpButton"
                      ).disabled = true;
                    } else {
                      var error = document.createElement("p");
                      error.textContent =
                        "Something went wrong! You have not been charged.";
                      document.getElementById(
                        "memberSignUpErrorContent"
                      ).innerHTML = "";
                      document
                        .getElementById("memberSignUpErrorContent")
                        .appendChild(error);
                      $("#memberSignUpErrorAlert").removeClass("d-none");

                      document.getElementById(
                        "completeSignUpButton"
                      ).innerHTML = "Complete Sign Up";
                    }
                  }
                });
              } else {
                var error = document.createElement("p");
                error.textContent =
                  "Something went wrong! You have not been charged.";
                document.getElementById("memberSignUpErrorContent").innerHTML =
                  "";
                document
                  .getElementById("memberSignUpErrorContent")
                  .appendChild(error);
                $("#memberSignUpErrorAlert").removeClass("d-none");

                document.getElementById("completeSignUpButton").innerHTML =
                  "Complete Sign Up";
              }
            },
            error: function(checkoutRes) {
              console.log("Checkout Response:", checkoutRes);
              var error = document.createElement("p");
              error.textContent =
                "Something went wrong! You have not been charged.";
              document.getElementById("memberSignUpErrorContent").innerHTML =
                "";
              document
                .getElementById("memberSignUpErrorContent")
                .appendChild(error);
              $("#memberSignUpErrorAlert").removeClass("d-none");

              document.getElementById("completeSignUpButton").innerHTML =
                "Complete Sign Up";
            }
          });
        } else {
          var error = document.createElement("p");
          error.textContent = murakamiResponse.msg;
          document.getElementById("memberSignUpErrorContent").innerHTML = "";
          document
            .getElementById("memberSignUpErrorContent")
            .appendChild(error);
          $("#memberSignUpErrorAlert").removeClass("d-none");

          document.getElementById("completeSignUpButton").innerHTML =
            "Complete Sign Up";
        }
      },
      error: function() {}
    });
  }
}

function validateMembershipForm() {
  $("#memberSignUpErrorAlert").addClass("d-none");
  $("#memberSignUpSuccessAlert").addClass("d-none");
  var errors = [];
  Object.keys(newMember).forEach(function(key) {
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

  if (errors.length > 0) {
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
  }

  return errors;
}
