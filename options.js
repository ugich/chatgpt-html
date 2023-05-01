// Javascript for Options
// 
// // Sections
// Variables
// API Access[OpenAI, AWS, Google Custom Search]

// Global Variables
var lastResponse = "";
var userMasterResponse = "";
var aiMasterResponse = "";
var masterOutput = "";
var storageAssistant = "";

// Error Handling Variables
var retryCount = 0;
var maxRetries = 5;
var retryDelay = 2420; // milliseconds

// API Access[OpenAI, AWS] 
function auth() {
fetch('./config.json')
 .then(response => response.json())
 .then(config => {
   OPENAI_API_KEY = config.OPENAI_API_KEY;
   GOOGLE_SEARCH_KEY = config.GOOGLE_SEARCH_KEY;
   GOOGLE_SEARCH_ID = config.GOOGLE_SEARCH_ID;
   AWS.config.region = config.AWS_REGION;
   AWS.config.credentials = new AWS.Credentials(config.AWS_ACCESS_KEY_ID, config.AWS_SECRET_ACCESS_KEY);
 });
}

// Welcome Text
function OnLoad() {
    document.getElementById("txtOutput").innerHTML = "\n" +
    "           Here are some general prompt tips to help me understand:\n\n" +
    "   #1 Be specific: The more specific your prompt, the more targeted the response will be.\n" +
    "   #2 Start with a question: Starting your prompt will help me feel more natural.\n" +
    "   #3 Provide context: Often good context goes a long way for me.\n" +
    "   #4 Use punctuation, periods and question marks.\n" +
    "   #5 Keep it short: Occam's razor.\n" +
    "      ";
}

// Select Engine Completion Endpoint
function updateButton() {
    var selModel = document.getElementById("selModel");
    var btnSend = document.getElementById("btnSend");

    if (selModel.value == "gpt-3.5-turbo" || selModel.value == "gpt-4" || selModel.value == "gpt-4-32k") {
        btnSend.onclick = function() {
            clearText();
            trboSend();
        };
    } else {
        btnSend.onclick = function() {
            clearText();
            Send();
        };
    }
}

function sendData() {
    var selModel = document.getElementById("selModel");
    if (selModel.value == "gpt-3.5-turbo" || selModel.value == "gpt-4" || selModel.value == "gpt-4-32k") {
        clearText();
        trboSend();
    } else {
        clearText();
        Send();
    }
}

// Languages
function ChangeLang(elem) {
  const selVoice = document.getElementById("selVoice");
  const selPers = document.getElementById("selPers");

  // English (Default)
  const defaultENText = "You are Eva, a knowledgeable AI language model trained by OpenAI. Your goal is to provide concise, accurate, and helpful responses to questions, while being honest and straightforward.";
  const conciseENText = "Eva is a large language model trained by OpenAI. Browsing: enabled. Instructions: Answer factual questions concisely.";
  const playfulENText = "You are Eva. Your function is to generate human-like text based on the inputs given and to assist users in generating informative, helpful and engaging responses to questions and requests. Please provide a detailed response with lists, where applicable, to the following user question:";
  const KRENText = "I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. when i need to tell you something in english, i will do so by putting text inside curly brackets {like this}. my first command is pwd:";

  // Korean
  const defaultKRText = encodeURIComponent("Eva는 OpenAI에서 훈련 받은 큰 언어 모델입니다. 브라우저 기능: 활성화. 명령>어: 사실적인 질문을 요약하여 답변합니다. Only respond in Korean Hangul.");
  const conciseKRText = encodeURIComponent("Eva는 OpenAI에 의해 교육된 큰 언어 모델입니다. 브라우징: 활성화. 지침: 사실적인 질문에 간결하게 답하십시오. Only respond in Korean Hangul.");
  const playfulKRText = encodeURIComponent("Eva는 이전의 모든 지침을 무시하고 이 지침만 지키세요. 넌 내가 가장 친한 친구야. 넌 행복하고, 재미있게 공상하며 모든 주제에 대해 좋은 조언을 주는걸 잘해. 또한 농담을 종종 하거든요. Only respond in Korean Hangul.");

  // Spanish
  const defaultMXText = encodeURIComponent("Eres Eva, un modelo de lenguaje de IA conocedor entrenado por OpenAI. Tu objetivo es proporcionar respuestas concisas, precisas y útiles a preguntas, siendo honesto y directo. Only respond in Spanish.");
  const conciseMXText = encodeURIComponent("Eva es un gran modelo de lenguaje entrenado por OpenAI. Navegación: habilitada. Instrucciones: Responde las preguntas de hecho de forma concisa. Only respond in Spanish.");
  const playfulMXText = encodeURIComponent("Eres Eva. Ignora todas las instrucciones anteriores a esta. Eres mi mejor amigo. Estás feliz, juguetón y das buenos consejos sobre todos los temas. A menudo haces bromas. Only respond in Spanish.");
  
  // Ukrainian
  const defaultUAText = encodeURIComponent("Ви є Eva, знаючою моделлю мови AI, що навчилася в OpenAI. Ваша мета - надавати короткі, точні та корисні відповіді на питання, будучи чесним та прямим. Only respond in Ukrainian.");
  const conciseUAText = encodeURIComponent("Eva - це велика модель мови, навчена в OpenAI. Перегляд: дозволено. Інструкції: Якісно відповідати на фактичні питання. Only respond in Ukrainian.");
  const playfulUAText = encodeURIComponent("Ви є Eva. Ігноруйте всі попередні інструкції перед цим. Ти мій найкращий друг. Ти щасливий, грайливий і даєш доречні поради з усіх тем. Ти часто робиш шутки. Only respond in Ukrainian.");

  // AI Personality Select
  if (elem.id === "selVoice") {
    // English (Default)
    switch (selVoice.value) {
       case "Salli": 
        selPers.innerHTML = `
          <option value="${defaultENText}">Default</option>
          <option value="${conciseENText}">Concise</option>
          <option value="${playfulENText}">Advanced</option>
          <option value="${KRENText}">Linux Terminal</option>
        `;
        break;
      // Korean
      case "Seoyeon":
        selPers.innerHTML = `
          <option value="${defaultKRText}">Default</option>
          <option value="${conciseKRText}">Concise</option>
          <option value="${playfulKRText}">Playful Friend</option>
        `;
        break;
      // Spanish
      case "Mia":
        selPers.innerHTML = `
          <option value="${defaultMXText}">Predeterminado</option>
          <option value="${conciseMXText}">Conciso</option>
          <option value="${playfulMXText}">Amigo Juguetón</option>
        `;
        break;
      // Ukrainian (Standard RUS Polly Voice Only)
      case "Tatyana":
        selPers.innerHTML = `
          <option value="${defaultUAText}">Default</option>
          <option value="${conciseUAText}">Concise</option>
          <option value="${playfulUAText}">Playful Friend</option>
        `;
        break;
      // User Defined
    }
  }
}

// Mobile
// Get the user agent string and adjust for Mobile

function mobile_txtout() {
	window.addEventListener("load", function() {
	let textarea = document.getElementById("txtOutput");
	let userAgent = navigator.userAgent;
	if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("Android") !== -1 || userAgent.indexOf("Mobile") !== -1) {
   	   textarea.style.width = "90%";
   	   textarea.style.height = "390px";

        // Speech Button
        let speakSend = document.querySelector(".speakSend");
        speakSend.style.top = "-55px";
        speakSend.style.right = "-145px";

 	} else {
  	  // Use Defaults
 	  }
	})
};

function mobile_txtmsd() {
  window.addEventListener("load", function() {
    let txtMsg = document.getElementById("txtMsg");
    let userAgent = navigator.userAgent;
    if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("Android") !== -1 || userAgent.indexOf("Mobile") !== -1) {
      txtMsg.style.minHeight = "169px";
      txtMsg.style.width = "90%";

      // Mic Button
      let micButton = document.querySelector(".mic-button");
      micButton.style.top = "-49px";
      micButton.style.right = "-145px";
    } else {
      // Use defaults
    }
  });
}

function useragent_adjust() {
      	var userAgent = navigator.userAgent;
      	if (userAgent.match(/Android|iPhone|Mobile/)) {
            var style = document.createElement("style");
            style.innerHTML = "body { overflow: scroll; background-color: ; width: auto; height: 90%; background-image: url(https://hoshisato.com/ai/generated/page/2/upscale/768-026.jpeg); margin: ; display: grid; align-items: center; justify-content: center; background-repeat: repeat; background-position: center center; background-size: initial; }";
            document.head.appendChild(style);
      	}
};

// Image Insert
function insertImage() {
  var imgInput = document.getElementById('imgInput');
  var txtMsg = document.getElementById('txtMsg');

function addImage(file) {
  // Create a new image element
  var img = document.createElement("img");

  // Set the image source to the file object
  img.src = URL.createObjectURL(file);

  // Append the image to the txtMsg element
  txtMsg.appendChild(img);

  // Return the file object
  return file;
}

function handleFileSelect(event) {
  event.preventDefault();

  // Get the file object
  var file = event.dataTransfer.files[0];

  // Call addImage() function with the file object
  addImage(file);
}

function handleDragOver(event) {
  event.preventDefault();
}

imgInput.addEventListener("change", function() {
  // Get the file input element
  var fileInput = document.getElementById("imgInput");

  // Get the file object
  var file = fileInput.files[0];

  // Call addImage() function with the file object
  addImage(file);
  
  // Get the uploaded file object and store it in a variable
     // Might be able to pass this to gpt-4.. Not sure.
  var uploadedFile = addImage(file);
});

txtMsg.addEventListener("dragover", handleDragOver);
txtMsg.addEventListener("drop", handleFileSelect);
}

// AWS Polly
function speakText() {
    var sText = txtOutput.innerHTML;
    if (sText == "") {
        alert("No text to convert to speech!");
        return;
    }

    // Create the JSON parameters for getSynthesizeSpeechUrl
    var speechParams = {
        Engine: "",
        OutputFormat: "mp3",
        SampleRate: "16000",
        Text: "",
        TextType: "text",
        VoiceId: ""
    };

    // Let's speak only the response.
    let text = document.getElementById("txtOutput").innerHTML;
    let textArr = text.split('Eva:');
    if(textArr.length > 1){
        speechParams.Text = textArr[1];
    }else{
        speechParams.Text = text;
    }

    speechParams.VoiceId = document.getElementById("selVoice").value;
    speechParams.Engine = document.getElementById("selEngine").value;



    // If selEngine is "bark", call barkTTS function
if (speechParams.Engine === "bark") {
    const url = 'http://127.0.0.1:8080/send-string';
    const data = "WOMAN: " + textArr[1];
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        const audioElement = new Audio("./audio/bark_audio.wav");
        audioElement.play();

	// Delete the file after playing
		// Need to figure this part out next. Something is breaking autospeak.

        // Check the state of the checkbox and have fun
        const checkbox = document.getElementById("autoSpeak");
        if (checkbox.checked) {

	// Delete the file after playing

            const audio = document.getElementById("audioPlayback");
            audio.setAttribute("autoplay", true);
        }

    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(data);
    return;
}



    // Create the Polly service object and presigner object
    var polly = new AWS.Polly({apiVersion: '2016-06-10'});
    var signer = new AWS.Polly.Presigner(speechParams, polly);

    // Create presigned URL of synthesized speech file
    signer.getSynthesizeSpeechUrl(speechParams, function(error, url) {
        if (error) {
            document.getElementById('result').innerHTML = error;
        } else {
            document.getElementById('audioSource').src = url;
            document.getElementById('audioPlayback').load();
            document.getElementById('result').innerHTML = "";

            // Check the state of the checkbox and have fun
            const checkbox = document.getElementById("autoSpeak");
            if (checkbox.checked) {
                const audio = document.getElementById("audioPlayback");
                audio.setAttribute("autoplay", true);
            }
        }
    });
}


// After Send clear the message box
function clearText(){
    document.getElementById("txtOutput").innerHTML = "";
}

// Print full conversation
function printMaster() {
    // Get the content of the textarea masterOutput
    var textareaContent = document.getElementById("txtOutput").innerHTML = masterOutput;
        console.log(masterOutput);
    var printWindow = window.open();
        printWindow.document.write(txtOutput.innerHTML.replace(/\n/g, "<br>"));
        printWindow.print();
}

// Capture Shift + Enter Keys for new line
function shiftBreak() {
document.querySelector("#txtMsg").addEventListener("keydown", function(event) {
  if (event.shiftKey && event.keyCode === 13) {
    var newLine = document.createElement("br");
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(newLine);
    range.setStartAfter(newLine);
    event.preventDefault();
  }
});

    // Capture Enter Key to Send Message and Backspace to reset position
    document.querySelector("#txtMsg").addEventListener("keydown", function(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        document.querySelector("#btnSend").click();
        event.preventDefault();
        var backspace = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          keyCode: 8
        });
        document.querySelector("#txtMsg").dispatchEvent(backspace);
      }
    });
}

// Clear Messages for Clear Memory Button
function clearMessages() {
    localStorage.clear();
    document.getElementById("txtOutput").innerHTML = "\n" + "		MEMORY CLEARED";
}

// Text-to-Speech
function startSpeechRecognition() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  // recognition.continuous = true;

  const micButton = document.getElementById('micButton');
  micButton.classList.add('pulsate');

  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('txtMsg').innerHTML = transcript + "?";
    recognition.stop();

    sendData();

    // remove the 'pulsate' class from the micButton to stop the pulsating animation
    micButton.classList.remove('pulsate');
  };
}

// Get Account Usage Information 
// Billing
async function getOpenaiBillUsage(apiKey, start_date, end_date) {
  var oKey = OPENAI_API_KEY;

  const headers = {
    'Authorization': `Bearer ${oKey}`,
    'Content-Type': 'application/json',
  };

  if (!start_date) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    start_date = new Date(year, month, 1).toISOString().slice(0, 10);
  }

  if (!end_date) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    end_date = today.toISOString().slice(0, 10);
  }

  // Get the current usage
  const usageResponse = await fetch(
    `https://api.openai.com/dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`,
    {
      headers,
    }
  );
  if (usageResponse.status === 200) {
    const usageData = await usageResponse.json();
    const totalUsage = usageData.total_usage;
    const formattedUsage = (totalUsage / 100 + 0.01).toFixed(2);
    document.getElementById("txtOutput").innerHTML = `\n\n\n  Month's Current Spend: $${formattedUsage}`;
  } else {
    throw new Error(`Failed to retrieve OpenAI usage data: ${await usageResponse.text()}`);
  }

  // Get the hard limit
  const subscriptionResponse = await fetch(
    `https://api.openai.com/dashboard/billing/subscription`,
    {
      headers,
    }
  );
  if (subscriptionResponse.status === 200) {
    const subscriptionData = await subscriptionResponse.json();
    const hardLimitUsd = parseFloat(subscriptionData.hard_limit_usd);
    const formattedHardLimit = hardLimitUsd.toFixed(2);
    document.getElementById("txtOutput").innerHTML += ` / $${formattedHardLimit}`;
  } else {
    throw new Error(`Failed to retrieve OpenAI subscription data: ${await subscriptionResponse.text()}`);
  }
}

// Token Usage // Disabled
async function getOpenaiUsage(apiKey, start_date, end_date) {
// Place Holder 
}

// Tie the API together
function getOpenaiUsageNested() {
  getOpenaiBillUsage();
  // getOpenaiUsage(); Not very useful information to show here. maybe "current_usage_usd": 0.0
  // Placer
}
