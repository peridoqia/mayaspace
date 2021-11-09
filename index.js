let gun = Gun();
let coredb = gun.get(`mayaspace`)
let postsDB = coredb.get('posts')
let username;
function showMainPage() {
    body.innerHTML = `<img class="logo" src="maya.jpg">
<h1>MayaSpace</h1><hr><br>
<div class="container" id="poster">
<input type="text" placeholder="Type a post here..." name="post" id="post" required>
<button onclick="post()">Post</button>
</div>
<div class="container" id="postContainer">
</div>
`;
    let postContainer = document.getElementById("postContainer");
    postsDB.on((data) => { postContainer.innerHTML = `${xss(data[0])}<hr> ${postContainer.innerHTML}` });
}
function login() { 
    let password = document.getElementById("password").value;
    let encryptedPassword = window.crypto.subtle.digest('SHA-256', password);
    username = `${document.getElementById("uname").value}@${window.location.hostname}`;
    let passwd = coredb.get('users').get(username).get(passwordEncrypted)
    if (passwd == "" || passwd == null || passwd == undefined) {
        passwd.put(encryptedPassword);
        showMainPage();
    } else if (passwd == encryptedPassword) {
        showMainPage();
    } else {
        alert("Incorrect Password");
    }
}
function post() {
let postid = `${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}`
let post = document.getElementById("post").value;
postsDB.put([`[${username}]> <br> ${xss(post)}`, postid]);
}

function logout() {
    document.location.href = "index.html";
}