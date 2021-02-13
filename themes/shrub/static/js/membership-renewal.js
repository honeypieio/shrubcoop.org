function sendRenewalLink() {
  var email = $("#email").val();
  if(email) {
    $("#member-unknown").addClass("d-none");
    $("#loading").removeClass("d-none");

    $.ajax({
      url: "https://murakami.shrubcoop.org/api/post/members/remote-renew/request-link?key=" + murakamiMembershipKey,
      type: "POST",
      data: {
        email: email
      },
      statusCode: { 
        200: function(res) {
          writeSuccessMessage("If your email is associated with a membership, a link to renew your has been sent to your inbox!");
        },
        400: function(res) {
          if(typeof res.responseJSON.error != "string") {
            res.responseJSON.error = "Something went wrong! Please try again";
          }
          writeErrorMessage(res.responseJSON.error);
        }
      }
    });

  } else {
    alert("Please enter your email address");
  }
}

function getMember() {
  $.ajax({
    url: "https://murakami.shrubcoop.org/api/get/members/basic-details/" + memberId  + "?key=" + murakamiMembershipKey,
    type: "GET",
    statusCode: { 
      200: function(res) {
        try {
          if (!res.member) {
            throw "Your membership could not be found!";
          }
          var member = res.member;

          $("#member-first-name").text(member.first_name);

          var membershipDetailsContainer = document.createElement("div");
          membershipDetailsContainer.classList = "alert alert-info px-3 py-3 w-75 mx-auto mt-3";

          var memberSince = document.createElement("p");
          var currentMembershipBegan = document.createElement("p");
          var currentMembershipEnds = document.createElement("p");
          var carbonSaved = document.createElement("p");
         
          memberSince.classList = "mb-0";
          currentMembershipBegan.classList = "mb-0";
          currentMembershipEnds.classList = "mb-0";
          carbonSaved.classList = "mb-0";

          memberSince.innerHTML = "Member since: <b>" + member.earliest_membership_date + "</b>";
          currentMembershipBegan.innerHTML = "Current membership began: <b>" + member.current_init_membership + "</b>";
          currentMembershipEnds.innerHTML = "Current membership ends: <span style='color: red;'><b>" + member.current_exp_membership + "</b></span>";
          carbonSaved.innerHTML = "Carbon saved: <b>" + member.carbon_saved + "kg</b>!";

          membershipDetailsContainer.appendChild(memberSince);
          membershipDetailsContainer.appendChild(currentMembershipBegan);
          membershipDetailsContainer.appendChild(currentMembershipEnds);
          
          if(member.carbon_saved > 0) {
            membershipDetailsContainer.appendChild(carbonSaved);
          }

          $("#membership-dates").append(membershipDetailsContainer);

          $("#loading").addClass("d-none");
          $("#member-known").removeClass("d-none");

        } catch (error) {
          writeErrorMessage(error);
        }
      },
      400: function(res) {
        if(typeof res.responseJSON.error != "string") {
          res.responseJSON.error = "Something went wrong! Please try again";
        }
        writeErrorMessage(res.responseJSON.error);
      }
    }
  });
}

function renewMembership() {
  $("#completeRenewalButton").prop("disabled", true);
  $("#errorBoxContainer").addClass("d-none");// Hide any errors from previous attempts.
  try {
    $.ajax({
      url: "https://murakami.shrubcoop.org/api/post/members/remote-renew/create-checkout?key=" + murakamiMembershipKey,
      data: { member_id: memberId, membershipLength: newMember.period, membershipCost: newMember.amount },
      type: "POST",
      statusCode: { 
        200: function(res) {
          if(!res.SumUp || !res.murakami) {
            throw "";
          }
          setupPaymentDialog(res.SumUp.id, res.murakami.transaction_id);
        },
        400: function(res) {
          $("#completeRenewalButton").prop("disabled", false);
          writeErrorMessage(res.responseJSON.error || "Something went wrong! Please try again.");
        }
      }
    });
  } catch (error) {
    $("#completeRenewalButton").prop("disabled", false);
    writeErrorMessage(error);
  }
}

function setupPaymentDialog(checkoutId, murakamiTransactionId) {
  SumUpCard.mount({
      checkoutId: checkoutId,
      onResponse: function(type, body) {
        if(type === "success" && body.transaction_code) {
          // Hide payment dialog, verify payment with Murakami - membership renewed.
          verifyPayment(body.transaction_code, murakamiTransactionId);
        } else if(type === "error") {
          // Handle error.
          console.log("Error processing payment:", type, body);
          $("#payment-details-wrapper").addClass("d-none");
          writeErrorMessage("Something went wrong processing your payment! Please check that you have entered your details correctly");
        } else {
          console.log("Payment state:", type, body);
        }
      },
    onLoad: function() {
      // Show payment dialog
      $("#membership-select-wrapper").addClass("d-none");
      $("#payment-details-wrapper").removeClass("d-none");
      window.location.href = "#"; // Take user to top of the page.
    }
  });
}

function verifyPayment(SumUpTransactionId, murakamiTransactionId) {
  
  $("#payment-details-wrapper").addClass("d-none");
  $("#loading").removeClass("d-none");
  $.ajax({
    url: "https://murakami.shrubcoop.org/api/post/members/remote-renew/verify-renewal?key=" + murakamiMembershipKey,
    data: { SumUpTransactionId: SumUpTransactionId, murakamiTransactionId: murakamiTransactionId },
    type: "POST",
    statusCode: { 
      200: function(res) {
        writeSuccessMessage("Your membership has been renewed successfully! A confirmation email will be with you shortly");
      },
      400: function(res) {
        if(res.error) {
          writeErrorMessage("Error: " + res.error);
        } else {
          writeErrorMessage("Something went wrong! Please try again");
        }
      }
    }
  });
}

function writeErrorMessage(errorMessage) {
  $("#loading").addClass("d-none");
  $("#errorBoxContainer").removeClass("d-none");
  $("#errorBoxMessage").text(errorMessage);
}

function writeSuccessMessage(successMessage) {
  $("#loading").addClass("d-none");
  $("#successBoxContainer").removeClass("d-none");
  $("#successBoxMessage").text(successMessage);
}

