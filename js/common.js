var session, userId, firstName, lastName, question, userProfileId;
axios.post('https://api.appercode.com/v1/volkswagen/login', {
        "username": "admin",
        "password": "7anzyzr5pu"
    })
    .then(function (response) {
        session = response.data.sessionId;
        userId = response.data.userId;
        console.log(response.data);
        checkStatus()
    })
    .catch(function (error) {
        console.log(error);
    });

function checkStatus() {
    axios({
            method: 'get',
            url: "https://api.appercode.com/v1/volkswagen/objects/Queue?include=['userId']",
            headers: {
                'X-Appercode-Session-Token': session
            }
        })
        .then(function (response) {
            var ArrayLength, ArrayIds, Sended;
            ArrayLength = response.data.length;
            ArrayIds = response.data;  
        
            Array.prototype.forEach.call(ArrayIds, function (item, i) {
               if (item.userId == userId) {
                    document.querySelector(".thank-message").style.display = "block"
                }
            })


            if (ArrayLength <= 12) {
                getUserProfileId()
            } else {
                document.querySelector(".alarm-message").style.display = "block"
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

function getUserProfileId() {
    axios({
            method: 'get',
            url: 'https://api.appercode.com/v1/volkswagen/users/' + userId + '/profiles',
            headers: {
                'X-Appercode-Session-Token': session
            }
        })
        .then(function (response) {
            userProfileId = response.data[0].itemId;
            console.log(userProfileId);
            getUserProfile();
            document.querySelector(".main-block").style.display = "block"
        })
        .catch(function (error) {
            console.log(error);
        })
}

function getUserProfile() {
    axios({
            method: 'get',
            url: "https://api.appercode.com/v1/volkswagen/objects/UserProfiles/" + userProfileId + "?include=['firstName','lastName']",
            headers: {
                'X-Appercode-Session-Token': session
            }
        })
        .then(function (response) {
            firstName = response.data.firstName;
            lastName = response.data.lastName;
        })
        .catch(function (error) {
            console.log(error);
        })
}

var button = document.querySelector("#submitButton")

function sendQuestion() {
    var message = document.querySelector(".vw-form__text").value;
    axios({
            method: 'post',
            url: 'https://api.appercode.com/v1/volkswagen/objects/Queue',
            headers: {
                'X-Appercode-Session-Token': session
            },
            data: {
                "userId": userId,
                "firstName": firstName,
                "lastName": lastName,
                "Questions": message
            }
        })
        .then(function (response) {
            console.log("ушло");
            location.reload()

        })
        .catch(function (error) {
            console.log(error);
        })
}


button.addEventListener("click", sendQuestion);
