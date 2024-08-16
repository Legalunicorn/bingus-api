

## ERD
![erd](/public/images/ERD.png)
## API
#### Auth

- [x] `/auth/local/email` __POST__
- [x] `/auth/local/signup` __POST__
- [x] `/auth/google/` __GET__
- [x] `/auth/google/redirect` __GET__
- [ ] Handle the setting username redirect logic


#### Post
- [ ] `/posts/:userId?` __GET__ 
      get posts by everyone or by one user
- [ ] `/posts/following` __GET__ 
	get post only by users who userId is following
- [x] `/posts/:postId` __GET__
- [x] `/posts` __POST__== 
	 create a new post
	body
		body
		tags
	headers
		- [ ] Bearer Token
- [x] `/posts/:postId` __DELTE__
- [x] `/posts/:postId` __PATCH__
- [x] `/posts/:postId/like` __POST__
- [x] `/posts/:postId/unlike` __POST__
- [ ] LINK parent post to olde post

//should like be in its own controller?

#### User
- [x] `/users` __GET__ 
- [x] `/users/:userId` __GET__
- [x] `/users/:userId/bio` __PATCH__
- [x] `/users/:userId/settings` __PATCH__
- [x] `/users/:userId` __DELETE__
- [x] `/users/:userId/follow` __POST__
- [x] `/users/:userId/unfollow` __POST__
- [x] `/users/:userId/followers` __GET__
- [x] `/users/:userId/folllowing` __GET___
%% - [ ] `/users/:userId/comments`
- [ ] `/users/:userId/posts` (? why is this not a feature -> i already get all posts from the /users/:userId) %%

#### Comment
- [x] `/comments/:commentId/like` __PUT__
- [x] `/comments/:commentId` __DELETE__
      delete a comment
- [ ] `/comments/` __POST__
- [ ] `/comments/:commentId/like` **POST**
- [ ] `/comments/:commentId/unlike` **POST**

#### Tags
- [x] -> get all post by tags
#### Messages
- [ ] `/messages/` GET
      get all messages either by body:userID, or body:friendID
  


#### Notifications
- [ ] `/notifications` GET
- [ ] `/notificatinons/:notificationId/` PATCH 
- [ ] `/notifications/` PATCH (clear all notifics)

%% ## Featues tested
- [ ] register with email
- [ ] login with email
- [ ] login with google oauth

- [ ] get all posts by all users
- [ ] get posts by following
- [ ] get a single post
- [ ] create a new post
snippets %%
