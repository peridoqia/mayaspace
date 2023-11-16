
let gun = Gun(['http://localhost:8765/gun', 'https://gun-manhattan.herokuapp.com/gun']);
let coredb = gun.get(`mayaspace`)
let postsDB = coredb.get('posts')
let usrname;

function showMainPage() {
    body.innerHTML = `<img class="logo" src="maya.jpg">
    <h1>MayaSpace</h1><hr><br>
    <div class="container" id="poster">
    <input type="text" placeholder="Type a post here..." name="post" id="post" required>
    <button onclick="post()">Post</button>
    </div>
    <div class="container" id="postContainer">
    <hr>
    Copyright Samuel Lord. All rights reserved.
    </div>
    `;

    let postContainer = document.getElementById("postContainer");

    // Use on() instead of once() to continuously listen for changes
    postsDB.on((data, key) => {
        addPost(data);
    });
}

async function sha256HexPromise(data) {
  const msgUint8 = new TextEncoder().encode(data); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

ffunction login() {
    let password = document.getElementById("password").value;

    // Perform the SHA-256 hashing asynchronously
    sha256HexPromise(password)
        .then(function (encryptedPassword) {
            usrname = `${document.getElementById("uname").value}@${window.location.hostname}`;
            return encryptedPassword;
        })
        .then(function (encryptedPassword) {
            // Access the user reference and check the stored password
            let userRef = coredb.get('users').get(usrname);
            let storedPassword = coredb.get('users').get(usrname).get("passwd");

            storedPassword.once((storedData) => {
                if (storedData === undefined || storedData === null || storedData === "") {
                    storedPassword.put({ passwd: encryptedPassword });
                    showMainPage();
                    console.log("registering and logging in....");
                } else if (storedData === encryptedPassword) {
                    showMainPage();
                    console.log("welcome back!");
                } else {
                    alert("Incorrect Password");
                }
            });
        })
        .catch(function (error) {
            console.error('Error in sha256HexPromise:', error);
            // Handle the error appropriately
        });
}



function addPost(data) {
    let postContainer = document.getElementById("postContainer");

    let postElement = document.createElement('div');
    postElement.textContent = filterXSS(data);
    postContainer.appendChild(postElement);
    postContainer.appendChild(document.createElement('br'));
}

function post() {
    let postData = `[${usrname}]: ${filterXSS(document.getElementById("post").value)}`;
    addPost(postData);
    postsDB.put(postData);
    console.log("USER: " + usrname);
}

function logout() {
    document.location.href = "index.html";
}
console.log("loaded")
postsDB.on((data) => { addPost(data) });

