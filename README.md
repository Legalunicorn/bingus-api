<h1 align="center">Bingus API</h1>

Backend for [Bingus repo](https://github.come/Legalunicorn/bingus)
Demo for bingus [Live](https://wwww.bingus-production.up.railway.app)

## Built with
- ExpressJS 
- Postgresql
- 

## Tools 
- **Cloudinary** : cloud based media management service 
- **Socket.IO**: for live communication between client and server
- **Prisma**: ORM to connect and query database

## Development 
Here are the steps to start the project locally.
Prerequisites.
- Installed psql 
- Installed npm

### 1. Clone the repo
```bash
# HTTPS
$ git clone https://github.com/Legalunicorn/bingus-api.git

#SSH
$ git clone git@github.com:Legalunicorn/bingus-api.git
```

### 2. Download dependencies
```
cd bingus-api
npm i
```

### 3. Get your google API Keys.
 [follow this](https://support.google.com/googleapi/answer/6158862?hl=en).Set up a project and Under API and services, add the following url to **Authorized redirect URIs**.: 

`https://localhost:3000/api/auth/oauth/google/redirect`

Proceed to the next step if you can do this else read below.

**If you cant get this step done,** you can comment out `/config/passportSetup.js`. Also head to `/routes/authRoutes.js` and comment out 
```js
//router.get('/oauth/google',controller.googleGet) 
//router.get('/oauth/google/redirect',controller.googleRedirectGet)

```
Also head over to `/controllsers/authControllers/js` and comment out two functions:

`exports.googleGet` and `exports.googleRedirectGet`

### 4. Create a [Cloudinary account](www.cloudinary.com) 
This will give you access the following:
- CLOUDINARY_API_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### 5. Create postgresql database
- `$ psql`
- 'CREATE DATABASE bingus;`

### 6. Create and populate `.env`
```
touch .env
```

Values: 
```.env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/bingus?schema=public"

SECRET= #Create your own secret, it can be anything.

GOOGLE_CLIENT_ID= #from your google account
GOOGLE_CLIENT_SECRET= #from your google account

CLOUDINARY_CLOUD_NAME= #from your cloudinary account
CLOUDINARY_API_KEY= #from your cloudinary account
CLOUDINARY_API_SECRET= #from your cloudinary account

DEFAULT_PFP="https://res.cloudinary.com/ds80ayjp7/image/upload/v1725690182/bingus_pfp_bzezbh.png"
```


### 7. Run the server
```
$ npm run serverstart 
```


### [Optionally] 8. clone the frontend repo and run it
If you wish to use the UI, head over to the [Bingus frontend repo](https://github.come/Legalunicorn/bingus) and follow the instructions to run it.

Otherwise you can use a service like [Postman](www.postman.com) to test and build the API






## ERD
![erd](/public/images/ERD.png)

## features todo
- Implement Access and Refresh Tokens with JWT
- Integrate notifications model for messages, likes, comments
- Add socket.io for live messages between users 

## API Check list
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
- [x] `/posts/single/:postId` __GET__

- [x] `/posts` __POST__ 
- [x] `/posts/:postId/like` __POST__
- [x] `/posts/:postId/unlike` __POST__
- [x] `/posts/:postId` __DELTE__
- [x] `/posts/:postId` __PATCH__

- [x] `/posts/:postId//link` __PATCH__
#### User
- [x] `/users` __GET__ 
- [x] `/users/:userId` __GET__
- [x] `/users/self/:userId` __GET__
- [x] `/users/:userId/followers` __GET__
- [x] `/users/:userId/following` __GET__
- [x] `/users/:userId/profile` __PATCH__
- [x] `/users/:userId/bio` __PATCH__ (not in use)
- [x] `/users/:userId/settings` __PATCH__ (not in use)
- [x] `/users/:userId` __DELETE__ (not in use yet)
- [x] `/users/:userId/follow` __POST__
- [x] `/users/:userId/unfollow` __POST__


#### Comment
- [x] `/comments/:commentId` __GET__
      delete a comment
- [x] `/comments/` __POST__
- [x] `/comments/:commentId/like` __POST__
- [x] `/comments/:commentId/unlike` **POST**
- [x] `/comments/:commentId` __DELETE__

#### Chats
- [x] `/chats/` __GET__
- [x] `/chats/:chatId` __GET__
- [x] `/chats/user/:userId` __PUT__


#### Tags_
- [x] -`/tags/:tagId/posts` __GET__> get all post by tags

#### Init  
- [x] `/init` __GET__
