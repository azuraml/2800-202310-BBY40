document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const optionA = parseInt(urlParams.get("optionA"));
    const optionB = parseInt(urlParams.get("optionB"));
    const optionC = parseInt(urlParams.get("optionC"));
    const optionD = parseInt(urlParams.get("optionD"));
  
    let learningStyle = "";
    let highestOption = Math.max(optionA, optionB, optionC, optionD);
  
    if (highestOption === optionA) {
        learningStyle = "Visual Learner";
    } else if (highestOption === optionB) {
        learningStyle = "Auditory Learner";
    } else if (highestOption === optionC) {
        learningStyle = "Kinesthetic Learner";
    } else if (highestOption === optionD) {
        learningStyle = "Read/Write Learner";
    }
  
    document.getElementById("learning-style").innerText = learningStyle; // Set the learning style to the new element

// Send learning style data to the server
var xhr = new XMLHttpRequest();
var method = 'POST';
var url = 'http://tivujfmelq.eu11.qoddiapp.com/save-learning-style'; // Replace with your server URL

xhr.onload = function() {
  if (xhr.status === 200) {
    // Request succeeded
    var response = JSON.parse(xhr.responseText);
    // Process the response if needed
  } else {
    // Request failed
    // Handle the error case
  }
};

xhr.onerror = function() {
  // Request error occurred
  // Handle the error case
};

xhr.open(method, url, true);
xhr.setRequestHeader('Content-Type', 'application/json');

var data = JSON.stringify({ learningStyle: learningStyle });
xhr.send(data);
});
