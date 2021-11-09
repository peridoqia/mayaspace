let gunModeration = Gun();
//let coredbB = gunModeration.get(`mayaspace`)
let postsDBB = coredbB.get('posts')
//let usersDBB = coredbB.get('users')
function nabUSSER(username) {
  var user = usersDBB.get(username)
  //user.put(null)
}

function rmFP0st(postID) {
    postsDBB.map().once(function(postTable){
        let currentPostId = spostsTable[1]
        if (currentPostId == postID) {
            postsDBB.get(postTable).put(['',''])
        }
    })
}
