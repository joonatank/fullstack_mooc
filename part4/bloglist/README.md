# Blog listing
NodeJS Backend that allows users to link blog articles.

Part 4 of Helsinki Fullstack MOOC [add link]

## Cool stuff here
- Token authentication
- Testing with Jest
- Combining (populating) Mongo documents

## Usage
TODO add Heroku address for the test app (both front-and-backend)

``` bash
# GET blogs : doesn't require login
http GET http://localhost:3003/api/blogs

http GET http://localhost:3003/api/blogs/:id

# POST blog : requires login
http POST http://localhost:3003/api/blogs title={title} author={author} url={url}

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

TODO document the data structures (JSONs)

### Installation
Requires MongoDB

requires following to be defined in .env
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

### Heroku
TODO add this

## TODO
- PUT doesn't support token authorization
- DELETE doesn't support token authorization
- No user deletion
- No batch deletion for blogs
  http DELETE http://localhost:3003/api/blogs with a message body containing all the ids to delete
