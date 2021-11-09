let gunModeration = Gun();
let coredbB = gunModeration.get(`mayaspace`)
let postsDBB = coredbB.get('posts')
let usersDBB = coredbB.get('users')
function banUser(username) {
  var user = usersDBB.get(username)
  user.put(null)
}

function removePost(postID) {
    postsDBB.map().once(function(postTable){
        let currentPostId = spostsTable[1]
        if (currentPostId == postID) {
            postsTable = ["", ""]
        }
    })
}
