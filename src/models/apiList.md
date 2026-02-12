# DevTinder Apis


# authRouter
- POST /signup
- POST /login
- POST /logout
- 
  # profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- GET / connections
- GET /requests/receive
- GET / feed - gets you the the profiles of other user on platform
 
 # UserRouter
 - GET /user/connectiona
 - GET /user/requests
 - GET /user/feed

status : ignored , intrested, accepted, rejected 