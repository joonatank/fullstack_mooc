# Blog listing
NodeJS Backend that allows users to link blog articles.

[Part 4 of Helsinki Fullstack MOOC](https://fullstackopen.com/en/part4)

## Cool stuff here
- Token authentication
- Testing with Jest
- Combining (populating) Mongo documents

## Usage
Combined front and backend can be found at: [Heroku](https://gentle-ravine-09411.herokuapp.com/)

``` bash
# GET blogs : doesn't require login
http GET http://localhost:3003/api/blogs

http GET http://localhost:3003/api/blogs/:id

# POST blog : requires login
http POST http://localhost:3003/api/blogs title={title} author={author} url={url}

# POST blog comment : requires login
http POST http://localhost:3003/api/blogs/:id/comments comment={comment}

# PUT blog : requires login
http PUT http://localhost:3003/api/blogs/:id likes={N} title={title} author={author}

# DELETE blog : requires login
http DELETE http://localhost:3003/api/blogs/:id

# GET users : doesn't require login
http GET http://localhost:3003/api/users

# POST login : to get an auth token
http POST http://localhost:3003/api/login username={name} password={password}

# POST user : doesn't require login (creates new user for login)
http POST http://localhost:3003/api/users username={name} password={password} name={fullname}
```

### Installation
Requires MongoDB

Requires following to be defined in .env
```
# Databse url used for all requests
MONGODB_URL
# Database username
USERNAME
# Database password
PASSWORD
# Test database name, required for running tests
TEST_DATABASE
# Dev database name, required for running
DEV_DATABASE
# Random string for encryption
SECRET
```
