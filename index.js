
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

function login() { 
    let password = document.getElementById("password").value;
    var encryptedPassword = hex_sha256(password);
    usrname = `${document.getElementById("uname").value}@${window.location.hostname}`;
    let userRef = coredb.get('users').get(usrname);
    
    userRef.once((data) => {
        let storedPassword = encryptedPassword;
        if (storedPassword === undefined || storedPassword === null) {
            userRef.put({ encryptedPassword });
            showMainPage();
            console.log("passwd");
        } else if (storedPassword === encryptedPassword) {
            showMainPage();
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

