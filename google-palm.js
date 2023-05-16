function palmSend() {

  function auth() {
    return fetch('./config.json')
      .then(response => response.json())
      .then(config => config.GOOGLE_PALM_KEY);
  }

  var sQuestion = document.getElementById("txtMsg").innerHTML;
    sQuestion = sQuestion.replace(/<br>/g, "\n");
  if (sQuestion.trim() == "") {
    alert("Type in your question!");
    txtMsg.focus();
    return;
  }

  const MODEL_NAME = "chat-bison-001";

  auth().then(GOOGLE_PALM_KEY => {
	txtMsg.innerHTML = "";
	txtOutput.innerHTML += "You: " + sQuestion + "\n";
    const gapiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/${MODEL_NAME}:generateMessage?key=${GOOGLE_PALM_KEY}`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          context:
            "You are Eva, a knowledgeable AI language model. Your goal is to provide accurate, and helpful responses to questions, while being honest and straightforward.",
          examples: [],
          messages: [{ content: sQuestion }],
        },
        temperature: 0.25,
        top_k: 40,
        top_p: 0.95,
        candidate_count: 1,
      }),
    };

    fetch(gapiUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const candidates = result.candidates.map(candidate => candidate.content);
        const formattedResult = candidates.join('\n');
        console.log(formattedResult);
        document.getElementById("txtOutput").innerHTML += "Eva: " + formattedResult;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
