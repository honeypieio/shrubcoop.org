var roles = [
  {
    role_id: "4N1ksSi8Wk",
    group_id: "WG-108",
    details: {
      title: "Newsletter Volunteer",
      locations: ["At home", "22 Bread Street"],
      activities: ["Community", "Marketing/PR/Media"],
      hours_per_week: "4",
      commitment_length: "Ongoing",
      experience_gained:
        "Copyediting,\r\nEmail marketing and analysing engagement data,\r\nContributing to an environmental project",
      short_description:
        "We're building a team enthusiastic volunteers to help write and edit our fortnightly email newsletter to promote our events, volunteer opportunities",
      experience_required:
        "Good English writing skills.\r\nGraphic design skills desirable but not essential.\r\nWould suit PR & Marketing student or anyone looking for experience"
    },
    availability: { wed_e: "on" },
    dateCreated: "2019-02-13T15:10:25.000Z",
    public: 1,
    removed: 0
  },
  {
    role_id: "9Fc5BvX9AP",
    group_id: "WG-108",
    details: {
      title: "PR and Marketing",
      role_id: "9Fc5BvX9AP",
      locations: ["At home", "22 Bread Street"],
      activities: ["Charity shops/Retail", "Marketing/PR/Media"],
      hours_per_week: "4",
      commitment_length: "Ongoing",
      experience_gained:
        "Copyediting and drafting press releases.\r\nSeeking out novel opportunities to get Edinburgh talking about waste.\r\nDesigning marketing strategies",
      short_description:
        "We're building a team enthusiastic volunteers to help promote our events and shop spaces.",
      experience_required:
        "Good English writing skills.\r\nPlanning and organising.\r\nGraphic design skills desirable but not essential.\r\nWould suit PR & Marketing student"
    },
    availability: { wed_e: "on" },
    dateCreated: "2019-01-28T00:00:00.000Z",
    public: 1,
    removed: 0
  },
  {
    role_id: "GFtWQvY4Gb",
    group_id: "WG-108",
    details: {
      title: "Graphic Designer",
      role_id: "GFtWQvY4Gb",
      locations: ["At home", "22 Bread Street"],
      activities: [
        "Charity shops/Retail",
        "Community",
        "Marketing/PR/Media",
        "Practical/DIY"
      ],
      hours_per_week: "4",
      commitment_length: "Ongoing",
      experience_gained:
        "Developing brand guidelines.\r\nDesign work for posters, flyers, infographics, social media pages, events programmes, & shop displays.",
      short_description:
        "We're building a team enthusiastic volunteers to help promote a series of exciting events and our shop spaces.",
      experience_required:
        "Good graphic design skills\r\nPhotoshop, Illustrator and InDesign skills desirable. We also use Canva for day to day design work."
    },
    availability: { wed_e: "on" },
    dateCreated: "2019-01-28T00:00:00.000Z",
    public: 1,
    removed: 0
  },
  {
    role_id: "hfn2e3HH8W",
    group_id: "WG-108",
    details: {
      title: "Brand Guardian",
      role_id: "hfn2e3HH8W",
      locations: ["At home", "22 Bread Street"],
      activities: "Marketing/PR/Media",
      hours_per_week: "4",
      commitment_length: "Ongoing",
      experience_gained:
        "Design work for a wide variety of projects across all sorts of different media, both print and digital.",
      short_description:
        "The purpose of this role is to keep our promotional materials in line with our organisation's branding guidelines.",
      experience_required:
        "Good graphic design skills and knowledge of Adobe Photoshop/Illustrator and Indesign."
    },
    availability: { wed_e: "on" },
    dateCreated: "2019-01-28T00:00:00.000Z",
    public: 1,
    removed: 0
  },
  {
    role_id: "kf3rRsmZ7t",
    group_id: "WG-108",
    details: {
      title: "Swapshop Marketing Volunteer",
      role_id: "kf3rRsmZ7t",
      locations: ["At home", "22 Bread Street"],
      activities: ["Charity shops/Retail", "Marketing/PR/Media"],
      hours_per_week: "4",
      commitment_length: "Ongoing",
      experience_gained:
        "Copyediting and drafting press releases.\r\nDesigning marketing strategies.\r\nSeeking out novel opportunities to get Edinburgh talking about waste.",
      short_description:
        "building a team enthusiastic volunteers to help promote our events and Swap Shop.",
      experience_required:
        "Good English writing skills.\r\nPlanning and organising.\r\nGraphic design skills desirable but not essential.\r\nWould suit PR & Marketing student."
    },
    availability: { wed_e: "on" },
    dateCreated: "2019-01-28T00:00:00.000Z",
    public: 1,
    removed: 0
  },
  {
    role_id: "rPLk7Q5-L2",
    group_id: "WG-108",
    details: {
      title: "Social Media Volunteer",
      locations: ["At home", "22 Bread Street"],
      activities: "Marketing/PR/Media",
      hours_per_week: "4",
      commitment_length: "Ongoing",
      experience_gained:
        "Contributing to a social media strategy.\r\nWorking with a team to manage content across Facebook, Twitter or Instagram.\r\nMonitoring engagement data.",
      short_description:
        "We’re looking for enthusiastic volunteers to run our social media pages to help us promote our events and sharing lots of zero waste content",
      experience_required:
        "Good English writing skills.\r\nPlanning and organising.\r\nGraphic design skills desirable but not essential.\r\nWould suit PR & Marketing student."
    },
    availability: { wed_e: "on" },
    dateCreated: "2019-02-13T16:57:43.000Z",
    public: 1,
    removed: 0
  },
  {
    role_id: "UwnR82SEtw",
    group_id: "WG-108",
    details: {
      title: "Instagram Guardian",
      role_id: "UwnR82SEtw",
      locations: ["At home", "22 Bread Street"],
      activities: ["Events", "Campaigning/Lobbying", "Marketing/PR/Media"],
      hours_per_week: "4",
      commitment_length: "Ongoing",
      experience_gained:
        "Contributing to a social media strategy.\r\nWorking with a team to manage content across Facebook, Twitter or Instagram\r\nMonitoring engagement data.",
      short_description:
        "We’re looking for enthusiastic volunteers to run our social media pages to help us promote our events and sharing lots of zero waste content.",
      experience_required:
        "Good English writing skills.\r\nPlanning and organising.\r\nGraphic design skills desirable but not essential.\r\nWould suit PR & Marketing student"
    },
    availability: { wed_e: "on" },
    dateCreated: "2019-01-28T00:00:00.000Z",
    public: 1,
    removed: 0
  }
];

// Retrieves roles from murakami.
function getAllVolunteerRoles() {
  // Make request to murakami.
  $.ajax({
    url:
      "https://murakami.org.uk/api/get/volunteers/roles/get-public?key=" + murakamiRolesKey,
    type: "GET",
    success: function(res) {
      try {
        if(res.status == "ok" && res.roles.length > 0){
          writeVolunteerRolesList(res.roles);
        } else {
          writeErrorMessage();
        }
      } catch (err) {
        writeErrorMessage();
      }
    }
  });
}

// Generates "list" markup.
function writeVolunteerRolesList(roles) {
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

    var roleTagline = document.createElement("p");
    roleTagline.innerText = roles[i].group_id;

    var roleLink = document.createElement("a");
    roleLink.href = BaseURL + "volunteer-roles/view?roleId=" + roles[i].role_id;
    roleLink.innerText = "Full details";

    roleDiv.appendChild(roleTitle);
    roleDiv.appendChild(roleTagline);
    roleDiv.appendChild(roleLink);

    document.getElementById("volunteerRoles").appendChild(roleDiv);
  }
}

function getVolunteerRole(roleId) {
  $.ajax({
    url:
      "https://murakami.org.uk/api/get/volunteers/roles/get-public/" + roleId + "?key=" + murakamiRolesKey,
    type: "GET",
    success: function(res) {
      try {
        if(res.status == "ok" && res.role[0]){
          writeFullVolunteerRole(res.role[0]);
        } else {
          writeErrorMessage();
        }
      } catch (err) {
        writeErrorMessage();
      }
    }
  });
}

function writeFullVolunteerRole(role) {
  var table = document.createElement("table");
  table.className = "table";
  Object.keys(role.details).forEach(function(key) {
    if (key == "title") {
      window.document.title = role.details.title + window.document.title;
      document.getElementById("roleTitle").innerText = role.details.title;
    } else {
      var row = document.createElement("tr");
      var name = document.createElement("td");
      name.innerText = key.toProperCase();
      var detail = document.createElement("td");
      detail.innerHTML = role.details[key];

      row.appendChild(name);
      row.appendChild(detail);
      table.appendChild(row);
    }
  });
  document.getElementById("volunteerRole").appendChild(table);
}

function writeErrorMessage() {
  document.getElementById("volunteerRole").innerHTML =
    "<p class='text-muted text-center mx-auto'>No roles to show right now. Check back soon!</p>";
}

String.prototype.toProperCase = function () {
  return this.split("_").join(" ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
