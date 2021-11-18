# Clientele
 A Node, Express and MongoDB based web application to manage clients and associated contacts.

# Setting up
### Requirements
    $ node -v
    # v16.9.1

### Instructions
Clone this repository and go to project directory

    $ npm start

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

### Toaster
- Notifications

      $ npm install vanilla-toast
