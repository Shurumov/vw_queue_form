var session, userId, firstName, lastName, company, question, project, baseUrl, refreshT, userProfileId;


startLoadingAnimation();

function sessionFromNative(e) {
  var userData = JSON.parse(e);
  session = userData.sessionId;
  userId = userData.userId;
  project = userData.projectName;
  baseUrl = userData.baseUrl;
  refreshT = userData.refreshToken;
  checkStatus(session, project, baseUrl);
}

function loginByToken() {
  var xhr = new XMLHttpRequest();
  var url = baseUrl + project + "/login/byToken";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");


  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4)
      return;
    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      var response = JSON.parse(xhr.responseText)
      session = response.sessionId;
      checkStatus(session, project, baseUrl)
    }
  };
  xhr.send('"' + refreshT + '"');
}

function checkStatus(session, project, base) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', base + project + "/objects/Queue?include=['userId']");
  xhr.setRequestHeader('X-Appercode-Session-Token', session);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4)
      return;
    if (xhr.status == 401) {
      loginByToken();
    } else
    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      var ArrayLength, ArrayIds, Sended;
      var response = JSON.parse(xhr.responseText);
      ArrayLength = response.length;
      ArrayIds = response;
      Array.prototype.forEach.call(ArrayIds, function (item, i) {
        if (item.userId == userId) {
          stopLoadingAnimation()
          document.querySelector(".thank-message").style.display = "block"
        }
      })


      if (ArrayLength < 1000) {
        getUserProfileId()
      } else {
        stopLoadingAnimation()
        document.querySelector(".alarm-message").style.display = "block"
      }
    }
  }
};




function getUserProfileId() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', baseUrl + project + "/users/" + userId + "/profiles");
  xhr.setRequestHeader('X-Appercode-Session-Token', session);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4)
      return;
    if (xhr.status == 401) {
      loginByToken();
    } else
    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      var response = JSON.parse(xhr.responseText);
      userProfileId = response[0].itemId;
      getUserProfile();
      stopLoadingAnimation()
      document.querySelector(".main-block").style.display = "block"
    }
  }

}

function getUserProfile() {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', baseUrl + project + "/objects/UserProfiles/" + userProfileId + "?include=['firstName','lastName','company']");
  xhr.setRequestHeader('X-Appercode-Session-Token', session);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4)
      return;
    if (xhr.status == 401) {
      loginByToken();
    } else
    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      var response = JSON.parse(xhr.responseText);
      company = response.company;
      firstName = response.firstName;
      lastName = response.lastName;

    }
  }
}

var button = document.querySelector("#submitButton")

function sendQuestion() {
  var message = document.querySelector(".vw-form__text").value;


  var body = '{"userId":"'+ userId+
      '","firstName":"'+ firstName+
      '","company":"'+ company+
      '","lastName":"'+ lastName+
      '","Questions":"'+ message+'"}';
  
  
  var xhr = new XMLHttpRequest();
  var url = baseUrl + project + "/objects/Queue";
  console.log(url);
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('X-Appercode-Session-Token', session);
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4)
      return;
    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      location.reload()
    }
  };
  xhr.send(body);
  
}

function startLoadingAnimation() {
  var imgObj = document.getElementById('floatingCirclesG');
  imgObj.style.display = "block";
};


function stopLoadingAnimation() {
  var imgObj = document.getElementById('floatingCirclesG');
  imgObj.style.display = "none";
}


button.addEventListener("click", sendQuestion);
