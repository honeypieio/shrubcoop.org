var workingGroups = {};

// Retrieves roles from murakami.
function getAllVolunteerRoles() {
  // Make request to murakami.
  $.ajax({
    url:
      "https://murakami.shrubcoop.org/api/get/volunteers/roles/get-public?key=" +
      murakamiRolesKey,
    type: "GET",
    success: function(res) {
      try {
        if (res.status == "ok" && res.roles.length > 0) {
          workingGroups = res.workingGroups;
          writeVolunteerRolesList(res.roles);
        } else {
          writeErrorMessage("volunteerRoles");
        }
      } catch (err) {
        writeErrorMessage("volunteerRoles");
      }
    }
  });
}

// Generates "list" markup.
function writeVolunteerRolesList(roles) {
  document.getElementById("volunteerRoles").innerHTML = "";
  document.getElementById("volunteerRoles").classList.remove("text-center");
  rolesLimit = rolesLimit || roles.length;
  if (roles.length < rolesLimit) {
    rolesLimit = roles.length;
  }
  for (i = 0; i < rolesLimit; i++) {
    var roleDiv = document.createElement("div");
    roleDiv.className = "mb-3 pb-3";
    roleDiv.style.borderBottom = "1px #EFEFEF solid";

    var roleTitle = document.createElement("h4");
    roleTitle.innerText = roles[i].details.title;
    roleTitle.className += "text-shrub mb-0";

    var roleCreated = document.createElement("p");
    roleCreated.className += "text-muted mb-0";
    roleCreated.innerText = moment(roles[i].dateCreated).format("Do MMMM YYYY");

    var roleTagline = document.createElement("p");
    roleTagline.className += "mb-1";

    roleTagline.innerText += roles[i].details.commitment_length;
    roleTagline.innerText +=
      " / " + roles[i].details.hours_per_week + " Hours Per Week";

    var roleDescription = document.createElement("p");
    if (
      roles[i].details.short_description.length <= 50 ||
      !truncateRoleDescriptions
    ) {
      roleDescription.innerText = roles[i].details.short_description;
    } else {
      roleDescription.innerText =
        roles[i].details.short_description.substring(0, 50).trim() + "...";
    }

    var roleLink = document.createElement("a");
    roleLink.href = BaseURL + "volunteer/view?roleId=" + roles[i].role_id;
    roleLink.innerText = "Full details";
    roleLink.className += "link-blue";

    roleDiv.appendChild(roleTitle);
    roleDiv.appendChild(roleCreated);
    roleDiv.appendChild(roleTagline);
    roleDiv.appendChild(roleDescription);
    roleDiv.appendChild(roleLink);

    document.getElementById("volunteerRoles").appendChild(roleDiv);
  }
}

function getVolunteerRole(roleId) {
  $.ajax({
    url:
      "https://murakami.shrubcoop.org/api/get/volunteers/roles/get-public/" +
      roleId +
      "?key=" +
      murakamiRolesKey,
    type: "GET",
    success: function(res) {
      if (res.status == "ok" && res.role) {
        workingGroups = res.workingGroups;
        writeFullVolunteerRole(res.role);
      } else {
        writeErrorMessage("volunteerRole");
      }
    }
  });
}

function writeFullVolunteerRole(role) {
  var roleDiv = document.createElement("div");
  roleDiv.className = "mb-3 pb-3";

  if (workingGroups[role.group_id]) {
    role.details.working_group = workingGroups[role.group_id].name;
  } else {
    role.details.working_group = "SHRUB-wide";
  }

  Object.keys(role.details).forEach(function(key) {
    if (key == "title") {
      window.document.title = role.details.title + " " + window.document.title;
      document.getElementById("roleTitle").innerText = role.details.title;
    } else {
      var row = document.createElement("div");
      row.className = "row mt-3";
      row.style.borderBottom = "1px #EFEFEF solid";

      var nameColumn = document.createElement("div");
      nameColumn.className = "col-md-4";

      var name = document.createElement("p");
      name.className = "font-weight-bold";
      name.innerText = key.toProperCase();

      nameColumn.appendChild(name);

      var detailColumn = document.createElement("div");
      detailColumn.className = "col-md-8";

      var detail = document.createElement("p");

      if (!Array.isArray(role.details[key])) {
        detail.innerHTML = role.details[key];
      } else {
        detail.innerHTML = role.details[key].join(", ");
      }

      detailColumn.appendChild(detail);

      row.appendChild(nameColumn);
      row.appendChild(detailColumn);
      roleDiv.appendChild(row);
    }
  });

  document.getElementById("volunteerRole").appendChild(roleDiv);
}

function writeErrorMessage(id) {
  document.getElementById(id).innerHTML =
    "<p class='text-muted text-center mx-auto'>No roles to show right now. Check back soon!</p>";
}
