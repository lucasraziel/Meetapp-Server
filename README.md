<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://user-images.githubusercontent.com/26093830/81317603-6e9a7600-9063-11ea-895c-ea46ccd28eb6.PNG" alt="Project logo" style="border-radius:50%"></a>
</p>

<h3 align="center">Meetapp-Server</h3>






---

<p align="justify">
This software is a demonstration for scheduling public meetups online
<br>
<div align="center">
<img src="https://user-images.githubusercontent.com/26093830/67793484-aba10280-fa59-11e9-929b-9108536ab2f9.png" width="600px" >
<img src="https://user-images.githubusercontent.com/26093830/67793485-aba10280-fa59-11e9-9766-7461c993be02.png" width="600px" >
<img src="https://user-images.githubusercontent.com/26093830/67793535-c83d3a80-fa59-11e9-9c92-70f4c5a75440.png" width="288" height="592">
<img src="https://user-images.githubusercontent.com/26093830/67793537-c83d3a80-fa59-11e9-829b-fa0588205f9b.png"  width="288" height="592">
<img src="https://user-images.githubusercontent.com/26093830/67793538-c83d3a80-fa59-11e9-86b3-cad000d6a879.png"  width="288" height="592">
<img src="https://user-images.githubusercontent.com/26093830/67793486-ac399900-fa59-11e9-93e0-d708133516b8.png" width="600px" >
</div>
It is separated among three projects

 - [Backend](https://github.com/lucasraziel/gobarber-server)
 - [Web](https://github.com/lucasraziel/modulo09)
 - [Mobile](https://github.com/lucasraziel/modulo10)
    <br>
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [Acknowledgments](#acknowledgement)
- [Author](#author)

## 🧐 About <a name = "about"></a>

This is a demonstration for schedulling meetups online. The web version is for
the person who wants to schedule a meetup. The mobile version, is for those who
want to join the meetup.
There is a demo version of this web app in the following link

[Demonstration](https://meetapp.lucasrego.com)

Unfortunately, there is no a demonstration versio for mobile.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

You will need to have installe in your machine NodeJs, Redis, Postgresql and MongoDB. You should also have
an environment ready for react-native.

### Installing

#### Backend

To install the backend, these are the steps required:

You should start postresql, with a new database ready for it (the name is of you choice).

You should also start redis and mongodb server.


```
git clone https://github.com/lucasraziel/Meetapp-Server.git meetapp-server

cd meetapp-server

yarn

```

It is also required to setup the environment. The .env.example file must be renamed to
.env and must have its data complete according to your environment.


```
yarn sequelize db:migrate

yarn dev

yarn queue
```

The yarn queue command is only required if you wish that the application sends their emails.


#### Web

The web environment must be installed in this manner:

```
git clone https://github.com/lucasraziel/Meetapp-Web.git meetapp-web

cd meetapp-web

yarn

```

You must, then, edit src/services/api.js and edit the file to adjust your server
configuration

```
yarn start
```

#### Mobile

To install the react-native environment, It is a good idea to follow these instructions
(it is in brazilian portuguese) [instructions](https://react-native.rocketseat.dev/).

The src/services/api.js must be editted in the same way that was in web environment.

```
git clone https://github.com/lucasraziel/Meetapp-Mobile.git meetapp-mobile

cd meetapp-mobile

yarn

react-native run-android

react-native run-ios

```

The ios test will be only possible in mac OS.




## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [ReactJS](https://reactjs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [React-Native](https://reactnative.dev/) - Mobile Framework


# Author <a name = "author"></a>

Lucas Rego [GitHub](https://github.com/lucasraziel) [Resume](https://lucasrego.com)



