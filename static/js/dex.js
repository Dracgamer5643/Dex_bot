let elementCount = 0;
let isAudioInput = false; // Track if input is from audio

function isValidBase64(string) {
    return string.startsWith('data:image/');
}

function extractBase64(response) {
    // Assuming response is a string formatted like "['data:image/jpeg;base64,...', 'data:image/png;base64,...']"
    const matches = response.match(/'([^']+)'/g); // Match all base64 strings
    return matches ? matches.map(match => match.replace(/'/g, '')) : []; // Remove quotes and return array
}

function dex_chat() {
    var chat = document.getElementById("chat");
    var view_con = document.querySelector(".view_con");

    let chat_text = chat.value.trim();
    let dataToSend = '';

    if (chat_text !== "" || isAudioInput) {
        // Prepare data for sending
        if (isAudioInput) {
            dataToSend = encodeURIComponent(chat_text);
        } else {
            dataToSend = encodeURIComponent(chat_text);
        }

        // Create human chat bubble
        var humans_chat = document.createElement("div");
        humans_chat.classList.add("humans_chat");
        var human_name = document.createElement('span');
        var human_text = document.createElement("p");

        human_name.textContent = "Me";
        human_text.textContent = chat_text;

        humans_chat.appendChild(human_name);
        humans_chat.appendChild(human_text);
        view_con.appendChild(humans_chat);

        // Clear input field
        chat.value = "";

        // Send prompt to server using XHR
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Parse the response
                var response = JSON.parse(xhr.responseText);

                // Create bot chat bubble
                var dex_chat = document.createElement("div");
                dex_chat.classList.add("dex_chat");

                var dex_logo = document.createElement('i');
                var dex_copyText = document.createElement('i');
                dex_copyText.classList.add('fi', 'fi-rr-copy-alt', 'bot', 'bot2');
                dex_logo.classList.add('fi', 'fi-rs-robot', 'bot');

                // Increase element count for unique IDs
                elementCount++;
                var dex_text = document.createElement("p");
                dex_text.id = 'element-' + elementCount;

                // Extract base64 images from response
                const base64Images = extractBase64(response.response);
                dex_chat.appendChild(dex_logo);
                dex_chat.appendChild(dex_copyText);
                if (base64Images.length > 0) {
                    base64Images.forEach(base64Image => {
                        if (isValidBase64(base64Image)) {
                            const img = document.createElement('img');
                            img.src = base64Image; // Set image source to the base64 string
                            img.style.width = '200px';
                            img.style.margin = '10px';
                            dex_chat.appendChild(img);
                        }
                    });
                } else {
                    dex_text.textContent = response.response; // Display bot's response if not a base64 image
                    dex_chat.appendChild(dex_text);
                }

                // Append icons to the bot chat
                view_con.appendChild(dex_chat); // Add bot chat to container

                // Use Typed.js to display bot's response text with typing effect
                var typed = new Typed('#' + dex_text.id, {
                    strings: [response.response], // Display bot's response
                    typeSpeed: 5,
                    showCursor: false
                });

                // Copy text on click
                dex_copyText.addEventListener("click", function() {
                    copyText(dex_text.textContent);
                });

                // Text-to-speech functionality
                dex_logo.addEventListener("click", function() {
                    const speech = new SpeechSynthesisUtterance(response.response);
                    speech.rate = 1.5; // Speed (1 is normal)
                    speech.pitch = 1.3; // Pitch (1 is normal)
                    speech.volume = 1; // Volume (0 to 1)
                    window.speechSynthesis.speak(speech); // Speak the text
                });
            }
        };

        // Send the data (either audio or text)
        xhr.send('prompt='+dataToSend);

    } else {
        console.log("Prompt not found");
    }

    // Reset audio input flag after sending
    isAudioInput = false;
}

// Trigger chat on Enter key press
function handleEnterPress(event) {
    if (event.key === 'Enter') {
        dex_chat();
    }
}

// Copy text to clipboard
function copyText(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Text successfully copied to clipboard!');
    }).catch(function(error) {
        console.error('Error copying text: ', error);
    });
}

// Add event listener for Enter key
document.getElementById('chat').addEventListener('keydown', handleEnterPress);

// Voice input functionality using Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    console.error('SpeechRecognition not supported in this browser.');
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const voiceButton = document.getElementById('voice-btn');

    // Start recognition on button click
    voiceButton.addEventListener('click', () => {
        recognition.start();
        console.log('Voice recognition started. Please speak.');
    });

    // On speech result
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('You said:', transcript);
        document.getElementById('chat').value = transcript;
        isAudioInput = true; // Set flag to indicate that input came from audio
        dex_chat(); // Trigger chat after voice input is transcribed
    };

    recognition.onend = () => {
        console.log('Voice recognition ended.');
    };

    recognition.onerror = (event) => {
        console.error('Error occurred in recognition:', event.error);
    };
}