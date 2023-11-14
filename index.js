
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
    postsDB.on((data) => { postContainer.textContent = `${filterXSS(data)}<hr>${postContainer.textContent}`; });
}
function login() { 
    let password = document.getElementById("password").value;
    let encryptedPassword = hex_sha256(password)
    usrname = `${document.getElementById("uname").value}@${window.location.hostname}`;
    let passwd = coredb.get('users').get(usrname).get("encryptedPassword").value
    console.log(String(passwd) + " /// " + encryptedPassword)
    if (passwd == "" || passwd == null || passwd == undefined) {
        coredb.get('users').get(usrname).get("encryptedPassword").put(encryptedPassword);
        showMainPage();
    	console.log("passwd")
    } else if (passwd == encryptedPassword) {
        showMainPage();
    } else {
        alert("Incorrect Password");
    }
}

function addPost(data) {
  let postElement = document.createElement('div');
  postElement.textContent = filterXSS(data);
  postContainer.appendChild(postElement);
  postContainer.appendChild(document.createElement('hr'));
}

function post() {
  let userInput = document.getElementById("post").value;
  let userIdentifier = `${document.getElementById("uname").value}@${window.location.hostname}`;

  // Limit the post to 1000 characters
  if (userInput.length > 1000) {
    alert("Post exceeds the character limit of 1000. Please shorten your message.");
    return;
  }

  let message = filterXSS(userInput);
  let formattedMessage = `[${userIdentifier}]: ${message}`;

  // Display the post on the frontend
  addPost(formattedMessage);

  // Store the post in the database
  postsDB.put(formattedMessage);

  console.log("USER: " + userIdentifier);
}


function logout() {
    document.location.href = "index.html";
}
console.log("loaded")
postsDB.on((data) => { addPost(data) });

