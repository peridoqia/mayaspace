
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

async function login() { 
    let password = await document.getElementById("password").value;
    let encryptedPassword = await sha256HexPromise(password);
    usrname = `${document.getElementById("uname").value}@${window.location.hostname}`;
    let userRef = await coredb.get('users').get(usrname);
    
    userRef.once((data) => {
        let storedPassword = await coredb.get('users').get(usrname).get(encryptedPassword);
        if (storedPassword === undefined || storedPassword === null || storedPassword == "") {
            userRef.put(`${encryptedPassword}`);
            showMainPage();
            console.log("registering and logging in....");
        } else if (storedPassword === encryptedPassword) {
            showMainPage();
            console.log("welcome back!");
        } else {
            alert("Incorrect Password");
        }
    });
}

function addPost(data) {
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

