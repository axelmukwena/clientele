# Clientele
 A Node, Express and MongoDB based web application to manage clients and associated contacts.

# Setting up
### Requirements
    $ node -v
    # v16.9.1

### How to setup and run
1. Clone this repository and go to project directory

        $ cd path/clientele

1. Install the modules and dependecies

        $ npm install

1. MongoDB connection string. Specified in the `server.js` file
      
        const database = process.env.MONGOLAB_URI;

1. I'm using the cloud based plartform, if need be I can **provide** my `connection string` for temporary use.

1. I placed mine in an `.env` file, which is not present in this folder.

1. An alternative, go to MongoDB, setup free account, set up a cluster, get connection string and update in `server.js`

1. Be sure to update the variables in the connection string:

        'mongodb+srv://<username>:<password>@<clustername>-rmp3c
        .mongodb.net/database?retryWrites=true&w=majority'
        
        --------------------------------
        <password>: password123
        <clustername>: Cluster
        database: db_name
1. DB is created automatically based on the name you want `db_name`

1. Make sure port `2021` is available, or change port in `server.js` file

        $ npm start

1. Everything should be working perfectly

# Developement

Initialize `packages.json`
    
    $ npm init

### Install core modules

- `express` is an Express application, which is necessary for our Express server
- `ejs` is a templating engine that generates HTML
- `mongoose` is a package that connects our application to our MongoDB

      $ npm install express ejs mongoose

- More about `ejs` https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
- Below, install to set custom layouts

      $ npm i express-ejs-layouts

### Setup lints
- Lints help maintain format and code consistency

      $ npm install --save-dev eslint prettier

- Initialize eslint config files
      
      $ npx eslint --init

  The above command also creates a `.eslintrc.json` in root folder.

### Auto restart the server on save
- Just as it is

      $ npm install nodemon --save-dev


### MongoDB
- https://www.mongodb.com/atlas/database
- Make sure `mongoose` is already installed
- Many-to-Many relationships https://www.bezkoder.com/mongodb-many-to-many-mongoose/

- Mongoose Docummentation https://mongoosejs.com/docs/2.7.x/index.html
- Autopopulate with Mongoose plugin

      $ npm i mongoose-autopopulate

### Handle `.evn` variables
- After install, create a `.env` file in our root directory
      
      $ npm install dotenv

### JQuery and Requests 

    $ npm install axios

### Flash / Notifications

- Bootstrap toast

### Deploy to Heroku

- Create Heroku app

      $ heroku create clientele
