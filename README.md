# Success Web

<h1>Project Description</h1>
<p>Our team, BBY-40 is developing a study support app to promote
equity by empowering students at a higher risk of dropping out due to
socioeconomic status, race, and academic performance.</p>

<h1>Technologies</h1>
<p>In the development of SuccessWeb, we used a range of technologies to ensure a seamless and efficient user experience. For the front-end design, we utilized <b style="color:cyan">JavaScript</b>,  <b style="color:red">EJS</b>, <b style="color:cyan">HTML</b>, and <b style="color:cyan">CSS</b>, and <b style="color:cyan">DALL-E</b> for images creating an intuitive and user-friendly interface.</p>

On the back-end, we leveraged Python web scraping frameworks, including <b>Scrap.py</b>, and additional <b>JavaScript</b> scripting to manage data processing and server-side operations. Our choice of database management was <b>MongoDB</b>, a robust and flexible platform which caters to our data storage needs. Other node libraries we used were <b>axios</b>, <b>nodemailer</b>, <b>cors</b>, and <b>EJS</b>. We used the OpenAI package which provided access to <b>OpenAI</b> language models and services.

To ensure reliable and efficient hosting for our application, we chose <b>Qoddi</b>, a web application hosting provider known for its performance and scalability. These technologies afford us the ability to deliver a high-quality educational support application to our users.
</p>

<h1>Listing of File Contents of folder </h1>
<p>Stored in Directory.txt<p>

<h1>How to install and run the project </h1>
<p>
1. 	What does the developer need to install:

      a.language(s)
        python, html, css, javascript

      b.IDEs
      Visual studio code

      c.Database(s)
      MongoDB
     
      d.Other software
      Scrap.py

2.	Which 3rd party APIs and frameworks does the developer need to download?

      Open AI API and Bootstrap.

3.	Do they need any API keys?
      
      Yes, from open ai. After creating an account you will be given a 5 dollar credit after that you need to put in your credit card details to use their services.

4.	In which order should they install things? Does installation location matter?
       
       The order is not important but the installation location of the packages is important. There are two different backend servers 1 for the AI and 1 for the web application. The  backend for the ai is a file named server.js.

5.	Include detailed configuration instructions.

       They should in general install things in the repository. In the server directory(separate backend for AI) they should install CORS and the same packages used for the main server running from index.js except the axios package. 

        The Server directory should be hosted on a qoddi with a ssl use the xs app option.
        Also when qoddi asks what respository folder type in /Server.

        We hosted the front end of our AI seperately as well. The Client directoy is the front end of our AI. It was hosted on Vercel. We have our client directory being hosted from a different repo but copied the contents of that folder into this repo. It is not neccessary to have it on a seperate repo. 

6.	Include a link to the testing plan you have completed so the new developer can see your testing history and maybe contribute to a minor bugfix!
        https://docs.google.com/spreadsheets/d/1RvvJisP5UUtd_VN5RaxJ2k9IijzUu53fUqnGk9s0D4I/edit?usp=sharing
</p>

<h1>How to use product features</h1>
  The AI chatbot can be used for a diversity of things such as creating a learning plan for you.The study schedule/study habits feature aims to reduce procrastination and increase productivity when it comes to completing school tasks, with the ultimate hope of improving the student’s grade. The app first asks the user the school tasks they have due in the current day and their estimated length of completion for each school task, then the app asks for other peripheral tasks such as wake up, lunch, sleep, etc., but this time the time of day is also asked as that is something that should be decided by users and not something that the app can accurately predict. Lastly, the app takes these two set of tasks the user provided and creates a easy to follow schedule for the current day. More specifically, the schedule breaks up any school tasks longer than an hour into one-hour chunks, and creates breaks for each chunk whose duration depends on the duration of the school task. All tasks are color coded based on their type to enable easier navigation of the schedule: school tasks are white, breaks are yellow, and peripheral tasks are purple. Any school task that exceeds midnight will be clearly highlighted in red to alert the user that they should consider scheduling those tasks for another day so their sleep would not be negatively impacted. Finally, the user has the option to save their schedule at the bottom of the final page where their schedule is created, and they can easily find it on the start page at any time they wish.


<h1>Credits,References,Licenses</h1>

 * Bootstrap v4.0.0 (https://getbootstrap.com)
 * Copyright (c) 2011-2023 The Bootstrap Authors
 * Licensed under the MIT License (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 
 * https://www.youtube.com/watch?v=2FeymQoKvrk&t=3271s by javascript mastery
 * https://github.com/adrianhajdin/project_openai_codex 
  
<h1>Our AI experience</h1>
<p>A.)Yes we used AI to help create our app. We leveraged tools like ChatGPT to analyze our other team members code for example so we could better understand it to work on it. We also used ChatGPT to assist us in creating functions which were simple but tedious and verbose to create. We also used tools like DALL-E which is an AI image generator to generate all of the images for the app.</p>

<p>B.)We did not use AI to create or clean data sets.</p>

<p>C.)Our app actually utilizes AI aswell! We implemented the OpenAI API to use the GPT model for our online tutoring bot. This GPT bot is able to generate customized learning plans for students based on their inputs and learning style. It also saves chat history and will remember the user similar to ChatGPT! </p>

<p>D.)A limitation we encountered was DALL-E not having enough tokens for all of the pictures we had to generate and the only other option was to pay. We overcame this by using apps that utilize DALL-E to create images for free such as NightCafe. Another limitation we encoutered was ChatGPT's use during hours of peak use, the way we overcame this was by often taking a break during these peak hours and resuming work after so we could work more efficiently and not be stucking waiting for servers to be availible again or speeds to get back to normal.</p>

<h1>Contact Info</h1>
<li>
<ul>kdail@my.bcit.ca</ul>
<ul>ekaila1@my.bcit.ca</ul>
<ul></ul>
</li>