

## ERD
![erd](/public/images/ERD.png)
## API Progress
#### Auth

- [x] `/auth/local/login` __POST
- [x] `/auth/local/signup` __POST__
- [x] `/auth/oauth/google/` __GET__
- [x] `/auth/oauth/google/redirect` __GET__
- [x] `/auth/oauth/username` __PATCH__
#### Post
- [x] `/posts/:userId?` __GET__ 
      - get posts by everyone or by one user
- [x] `/posts/following` __GET__ 
	get post only by users who userId is following
- [x] `/posts/:postId` __GET__
- [x] `/posts` __POST__ 
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
- [x] `/posts/:postId//link` __PATCH__
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

#### Comment
- [x] `/comments/:commentId/like` __PUT__
- [x] `/comments/:commentId` __DELETE__
      delete a comment
- [x] `/comments/` __POST__
- [x] `/comments/:commentId/like` **POST**
- [x] `/comments/:commentId/unlike` **POST**

#### Tags_
- [x] -`/tags/:tagId/posts` __GET__> get all post by tags
