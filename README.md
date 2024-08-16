## API Progress
#### Auth

- [x] `/auth/local/email` POST
- [x] `/auth/local/signup` POST
- [x] `/auth/google/` GET
- [x] `/auth/google/redirect` GET
- [ ] Handle the setting username logic


#### Post
- [x] `/posts/:userId?` ==GET== 
      get posts by everyone or by one user
- [x] `/posts/following` ==GET== 
	get post only by users who userId is following
- [x] `/posts/:postId` ==GET==
- [ ] `/posts` ==POST== (half done)
	 create a new post
	body
		body
		tags
	headers
		- [ ] Bearer Token
- [x] `/posts/:postId` ==DELETE==
- [x] `/posts/:postId` ==PATCH==
- [x] `/posts/:postId/like` ==POST== 
- [x] `/posts/:postId/unlike` ==POST== 
- [ ] LINK parent post to olde post

//should like be in its own controller?

#### User
- [x] `/users` ==GET== 
- [x] `/users/:userId` ==GET== 
- [x] `/users/:userId/bio` ==PATCH==
- [x] `/users/:userId/settings` ==PATCH==
- [x] `/users/:userId` ==DELETE==
- [x] `/users/:userId/follow` ==POST==
- [x] `/users/:userId/unfollow` ==POST==
- [x] `/users/:userId/followers` ==GET==
- [x] `/users/:userId/folllowing` ==GET==
- [ ] `/users/:userId/comments`
- [ ] `/users/:userId/posts` (? why is this not a feature -> i already get all posts from the /users/:userId)

#### Comment
- [ ] `/comments/:commentId` ==GET== (What is the point of this?)
      get a single comment 
- [ ] `/comments/:userId` ==GET== (Actually i dont know if i need this)
      get all comments by a user
- [ ] `/comments/:postId` 
      (Do i need this?? i already retreive all) comments from a post using /posts/postId)
      get all comments in a post
	      -> including the SUB-comments 
- [x] `/comments/:commentId/like` ==PUT==
- [x] `/comments/:commentId` ==DELETE==
      delete a comment
- [ ] `/comments/` POST
- [ ] /commentid/like
- [ ] commentid/unlike

#### Tags
- [x] -> get all post by tags
#### Messages
- [ ] `/messages/` GET
      get all messages either by body:userID, or body:friendID
  


#### Notifications
- [ ] `/notifications` GET
- [ ] `/notificatinons/:notificationId/` PATCH 
- [ ] `/notifications/` PATCH (clear all notifics)
