# design doc
*** database architecture 
 [] chats table
    - chatId 
    - firstName 
    - lastName 
    - email 
    - password 
    - room_id

 []  rooms table
    - roomId
    - host_id
    - 


    what is done as of now  

    user - 
        registration 
        login
    rooms-
        create rooms
        join-room 



     now just have to redirect the user to the room and then
     upgrade the connection to the websocket connection and also other user should be able to join



     2 the next feature would be to invite the user or add the user by host only


# TODOS: 
1. write a websocket connection to exchange user 



-  detailed process
  -  user already have a jwt token issued to them 
  - 



# TODOS  - Done
1. introducing a middleware to check the user token and verify the user token 
2. for that I have already a jwt  library to issue and validate the token
3. jwt-v5 --> done 

4.  In fronted I have to use axios because of the token that I want to send with every request going to the backend
    axios  --> done 

5. validated the `jwt`  issued to the user, upon successful attached to the context of the request for further processing
6. issue user jwt token upon requested to join the room and then  also create a middleware to validate the user then add to the context for further processign  [date - tuesday 5: 51 pm done]
















