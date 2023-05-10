document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const optionA = urlParams.get("optionA");
    const optionB = urlParams.get("optionB");
    const optionC = urlParams.get("optionC");
    const optionD = urlParams.get("optionD");
  
    document.getElementById("optionA-total").innerText = optionA;
    document.getElementById("optionB-total").innerText = optionB;
    document.getElementById("optionC-total").innerText = optionC;
    document.getElementById("optionD-total").innerText = optionD;
  });
  