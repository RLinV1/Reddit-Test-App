# Fake Reddit App


## Prerequistes
1. Have mongodb community server installed on your pc (https://www.mongodb.com/try/download/community)
2. Have Node.js installed
3. Create a folder at the path C:\data\db on your pc. This directory will be used by MongoDB to store database files
4. Firebase account with a firebase project. Create a firebase directory in the ev-buddy directory and make a file called firebase.js and past your firebase config file.
<p align="center">
  <img src="https://github.com/user-attachments/assets/2379c43e-fb4c-4017-ab37-e55513d143bd" width="300" height="400" alt="Example Image"/>
  <br/>
  <em>This is an example.</em>
</p>



## Main steps
1. First do npm install inside the server directory and also do the same for the ev-buddy directory.
2. Next start up the mongodb service with the command mongod.
3. Afterwards start up the express server in the server directory with the command nodemon server.js.
4. In the ev-buddy directory start up the frontend with the command npm run dev

### Technologies Used
Next.js, Express, MongoDB, Node.js, Firebase
