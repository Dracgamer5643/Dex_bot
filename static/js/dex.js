let elementCount = 0;

function dex_chat() {
    var chat = document.getElementById("chat");
    var view_con = document.querySelector(".view_con");

    let chat_text = chat.value;

    if (chat_text.trim() !== "") {
        var humans_chat = document.createElement("div");
        humans_chat.classList.add("humans_chat");
        var human_name = document.createElement('span');
        var human_text = document.createElement("p");

        human_name.textContent = "Me";
        human_text.textContent = chat_text;
        
        humans_chat.appendChild(human_name);
        humans_chat.appendChild(human_text);
        view_con.appendChild(humans_chat);

        chat.value = "";

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);

                var dex_chat = document.createElement("div");
                dex_chat.classList.add("dex_chat");

                var dex_logo = document.createElement('i');
                var dex_copyText = document.createElement('i');
                dex_copyText.classList.add('fi', 'fi-rr-copy-alt', 'bot', 'bot2');
                dex_logo.classList.add('fi', 'fi-rs-robot', 'bot');

                elementCount++;
                var dex_text = document.createElement("p");
                dex_text.id = 'element-' + elementCount;

                dex_chat.appendChild(dex_logo);
                dex_chat.appendChild(dex_copyText);
                dex_chat.appendChild(dex_text);
                view_con.appendChild(dex_chat);

                var typed = new Typed('#' + dex_text.id, {
                    strings: [response.response],
                    typeSpeed: 5,
                    showCursor: false
                });

                dex_copyText.addEventListener("click", function() {
                    copyText(dex_text.textContent);
                });

                dex_logo.addEventListener("click", function() {
                    const speech = new SpeechSynthesisUtterance(response.response);
                    speech.rate = 1.5; // Speed (1 is normal)
                    speech.pitch = 1.3; // Pitch (1 is normal)
                    speech.volume = 1; // Volume (0 to 1)
                    // Speak the text
                    window.speechSynthesis.speak(speech);
                });
                
            }
        };

        xhr.send('prompt=' + encodeURIComponent(chat_text));

    } else {
        console.log("Prompt not found");
    }
}

function handleEnterPress(event) {
    if (event.key === 'Enter') {
        dex_chat();
    }
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Text successfully copied to clipboard!');
    }).catch(function(error) {
        console.error('Error copying text: ', error);
    });
}

document.getElementById('chat').addEventListener('keydown', handleEnterPress);