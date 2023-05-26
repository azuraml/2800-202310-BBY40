import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent ='';
  const Loader = document.createElement('div');
 
  loadInterval = setInterval(() =>{
    element.textContent += '.';
    if (element.textContent === '....'){
      element.textContent = '';
    }
  }, 300)
 


}

function typeText(element, text){
  let index = 0;
  let interval = setInterval(()=>{
    if(index<text.length){
element.innerHTML += text.charAt(index);
index++;
    }else{
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId){
return (
  `
  
  <div class ="wrapper ${isAi && 'ai'}">
   <div class="chat">
     <div class="profile">
 <img src= "${isAi? bot: user}" alt="${isAi ? 'bot': 'user'}" />

      </div>
   <div class="message" id=${uniqueId}>${value} </div>
      </div>
  </div>
  `
)
}

const handleSubmit = async (e) => {
e.preventDefault();
const data = new FormData(form);
// user's chatstripe
chatContainer.innerHTML +=chatStripe(false, data.get('prompt'));
form.reset();
//bot's chatstripe
const uniqueID = generateUniqueId();
chatContainer.innerHTML += chatStripe(true, " ", uniqueID);
chatContainer.scrollTop = chatContainer.scrollHeight;
const messageDiv = document.getElementById(uniqueID);
loader(messageDiv);
// fetch data from server -> bot's response
const response = await fetch('https://lihcxopqef.eu08.qoddiapp.com', {
method: 'POST',
headers:{
  'Content-Type': 'application/json'
},
body:JSON.stringify({prompt:data.get('prompt')})
})
clearInterval(loadInterval);
messageDiv.innerHTML = '';
if(response.ok){
const data = await response.json();
const parseData = data.bot.response;
typeText(messageDiv, parseData);
}else{
  const err = await response.text();
  messageDiv.innerHTML = "something went wrong";
  alert(err);
}
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode===13){
    handleSubmit(e);
  }
})

// Make an initial request to the server upon page load
window.addEventListener('load', () => {
  const botResponse = "Hi there! I'm Jacob, your personal tutor. Please type in a topic you would like a learning plan for.";

  // Display the introductory prompt to the user
  const uniqueID = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, botResponse, uniqueID);
  const messageDiv = document.getElementById(uniqueID);
  messageDiv.classList.add('prompt');
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

