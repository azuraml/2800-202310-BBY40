const questions = [
    {
        question: "When studying for an exam, which of the following methods do you find most effective?",
        optionA: "Using flashcards with images and diagrams ",//Visual
        optionB: "Recording lectures and listening to them",//Auditory
        optionC: "Taking breaks and engaging in physical activity ",//Kinesthetic
        optionD: "Writing and rewriting notes",//Reading/Writing
        correctOption: "optionC"
   

    },

    {
        question: "When trying to remember something important, what works best for you?",
        optionA: "Creating a visual representation, such as a chart or graph ", //Visual
        optionB: "Repeating it out loud or recording it as a voice memo ", //Auditory
        optionC: "Acting it out or physically demonstrating it ", //Kinesthetic
        optionD: "Writing it down in a notebook or on a sticky note ", //Reading/Writing
        correctOption: "optionB"
    },

    {
        question: "Which of the following learning activities do you find most engaging?",
        optionA: "Watching educational videos or documentaries", //Visual
        optionB: "Participating in class discussions or debates", //Auditory
        optionC: "Engaging in hands-on activities or experiments ", //Kinesthetic
        optionD: "Reading and analyzing written texts ", //Reading/Writing
        correctOption: "optionD"
    },

    {
        question: "Which of the following environments do you find most conducive to learning?",
        optionA: " A visually stimulating environment, such as a well-lit room with colorful posters", //Visual
        optionB: "An environment with minimal distractions, such as a quiet library or study area ", //Auditory
        optionC: "An environment that allows for movement, such as a standing desk or open space", //Kinesthetic
        optionD: "An environment with ample access to written materials, such as a well-stocked library or bookstore", //Reading/Writing
        correctOption: "optionC" 
    },

    {
        question: "When learning a new skill, what approach works best for you?",
        optionA: "Watching someone else perform the skill and taking detailed notes", //Visual
        optionB: "Listening to someone explain the skill and asking questions for clarification", //Auditory
        optionC: "Jumping in and trying the skill yourself, with minimal instruction", //Kinesthetic
        optionD: "Reading a detailed explanation of the skill and following step-by-step instructions",  //Reading/Writing
        correctOption: "optionD"
    },

    {
        question: "Which of the following study strategies do you find most effective?",
        optionA: "Creating mind maps or diagrams to visualize relationships between concepts",
        optionB: "Recording lectures and listening to them multiple times ",
        optionC: "Taking breaks and engaging in physical activity to help with retention",
        optionD: " Writing and rewriting notes, or creating outlines of key concepts",
        correctOption: "optionA"
    },

    {
        question: "When working on a project, which of the following approaches works best for you?",
        optionA: "Using visual aids, such as graphs or charts, to help convey information ",
        optionB: "Using verbal communication, such as presentations or speeches, to convey information",
        optionC: "Using hands-on materials, such as models or prototypes, to convey information",
        optionD: "Using written materials, such as reports or memos, to convey information",
        correctOption: "optionC"
    },

    {
        question: "Which of the following methods do you prefer for learning a new language?",
        optionA: "Using visual aids, such as flashcards or pictograms, to learn vocabulary",
        optionB: "Listening to native speakers or recorded audio to learn pronunciation",
        optionC: "Engaging in hands-on activities, such as role-playing or interactive games, to practice speaking",
        optionD: "Reading and writing exercises, such as grammar drills or translation exercises",
        correctOption: "optionA"
    },

    {
        question: "When trying to memorize information, which of the following methods works best for you?",
        optionA: "Using visual imagery, such as creating mental pictures or visual associations",
        optionB: "Repeating information out loud or creating a mnemonic device",
        optionC: " Engaging in physical activity, such as pacing or tapping a rhythm",
        optionD: "Writing and rewriting the information to help commit it to memory",
        correctOption: "optionD"
    },

    {
        question: "When trying to understand a complex concept, which of the following methods works best for you?",
        optionA: "Creating visual aids, such as diagrams or mind maps, to help organize and visualize the information",
        optionB: "Engaging in group discussions or debates to help clarify and reinforce understanding",
        optionC: "Engaging in hands-on activities or experiments to help solidify understanding ",
        optionD: "Reading and analyzing written texts, such as textbooks or scholarly articles, to help understand the concept ",
        correctOption: "optionD"
    }

]

let optionA = 0;//Visual
let optionB = 0;//Auditory
let optionC = 0;
let optionD = 0;

let shuffledQuestions = [] //empty array to hold shuffled selected questions out of all available questions

function handleQuestions() { 
    // push all questions in the order they come into shuffledQuestions array
    shuffledQuestions = questions.slice();
}



let questionNumber = 1 //holds the current question number
let playerScore = 0  //holds the player score
let wrongAttempt = 0 //amount of wrong answers picked by player
let indexNumber = 0 //will be used in displaying next question

// function for displaying next question in the array to dom
//also handles displaying players and quiz information to dom
// function for displaying next question in the array to dom
//also handles displaying players and quiz information to dom
function NextQuestion(index) {
    handleQuestions();
    const currentQuestion = shuffledQuestions[index];
    document.getElementById("question-number").innerHTML = questionNumber;
    document.getElementById("player-score").innerHTML = playerScore;
    document.getElementById("display-question").innerHTML = currentQuestion.question;
    document.getElementById("option-one-label").innerHTML = currentQuestion.optionA;
    document.getElementById("option-two-label").innerHTML = currentQuestion.optionB;
    document.getElementById("option-three-label").innerHTML = currentQuestion.optionC;
    document.getElementById("option-four-label").innerHTML = currentQuestion.optionD;
    
    // reset the radio buttons to unchecked
    document.querySelectorAll('input[type="radio"]').forEach((el) => (el.checked = false));
  }



function checkForAnswer() {
    const currentQuestion = shuffledQuestions[indexNumber] //gets current Question 
    const currentQuestionAnswer = currentQuestion.correctOption //gets current Question's answer
    const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)

    options.forEach((option) => {
        if (option.value === currentQuestionAnswer) {
            //get's correct's radio input with correct answer
            correctOption = option.labels[0].id
        }
        if (option.value === "optionA" && option.checked) {
            optionA++
            console.log(optionA);
        } else if (option.value === "optionB" && option.checked) {
            optionB++
            console.log(optionB);
        } else if (option.value === "optionC" && option.checked) {
            optionC++
            console.log(optionC);
        } else if (option.value === "optionD" && option.checked) {
            optionD++
            console.log(optionD);
        }
    })

    //checking to make sure a radio input has been checked or an option being chosen
    if (options[0].checked === false && options[1].checked === false && options[2].checked === false && options[3].checked == false) {
        document.getElementById('option-modal').style.display = "flex"
    }



    options.forEach((option) => {
        if (option.checked) {
            const labelId = option.labels[0].id
            document.getElementById(labelId).style.backgroundColor = "white"
            playerScore++ //adding to player's score
            indexNumber++ //adding 1 to index so has to display next question..
            //set to delay question number till when next question loads
            setTimeout(() => {
                questionNumber++
            }, 1000)
        }
    })

}




//called when the next button is called
function handleNextQuestion() {


    checkForAnswer() //check if player picked right or wrong option
    unCheckRadioButtons()
    //delays next question displaying for a second just for some effects so questions don't rush in on player
    setTimeout(() => {
        if (indexNumber <= 9) {
//displays next question as long as index number isn't greater than 9, remember index number starts from 0, so index 9 is question 10
            NextQuestion(indexNumber)
        }
        else {
            handleEndGame()//ends game if index number greater than 9 meaning we're already at the 10th question
        }
        resetOptionBackground()
    }, 1000);

    
}

//sets options background back to null after display the right/wrong colors
function resetOptionBackground() {
    const options = document.getElementsByName("option");
    options.forEach((option) => {
        document.getElementById(option.labels[0].id).style.backgroundColor = ""
    })
}

// unchecking all radio buttons for next question(can be done with map or foreach loop also)
function unCheckRadioButtons() {
    const options = document.getElementsByName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].checked = false;
    }
}

function handleEndGame() {
    window.location.href = `/quiz-end?optionA=${optionA}&optionB=${optionB}&optionC=${optionC}&optionD=${optionD}`;
  }
  



//closes score modal, resets game and reshuffles questions
function closeScoreModal() {
    questionNumber = 1
    playerScore = 0
    wrongAttempt = 0
    indexNumber = 0
    shuffledQuestions = []
    NextQuestion(indexNumber)
    document.getElementById('score-modal').style.display = "none"
}

//function to close warning modal
function closeOptionModal() {
    document.getElementById('option-modal').style.display = "none"
}

































var animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');
  
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}




const button = document.querySelector('.bubbly-button');
button.addEventListener('click', () => {
  button.classList.add('animate');
});





































