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
});
