# YoursCharitably.com
This is sample application that illustrates how one could use Blockchain and Distributed Ledger Technology (DLT) for building an online charity platform with the following features:

## Security

Only authorized actors have the ability to update the data in the Blockchain. Hence a private blockchain.

## Transparency

For all authorised users, show when and who updated the data in the Blockchain.

## Auditability

Every member of the Blockchain can audit the data and once the data is committed there, it cannot be changed (immutability) in the Ledger.

## Trust

With DLT and Blockchain, trus is built-in, you have your copy of the ledger that is immutable accross all the member copies.

## Features

## Architecture  

## Tech stack
- JavaScript / NodeJS
- HyperLedger v2.x
- Docker
- MongoDB

## Prerequisites
- Install all packages [Git, cURL, Docker and Docker Compase] as described here :   https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html
- Install Samples, Binaries, and Docker Images as descriped here :  https://hyperledger-fabric.readthedocs.io/en/release-2.2/install.html
- Clone this repo into a folder at the same level as fabric-samples folder
for example on an AWS EC2 Linux instance, it may look like below:
- --- ec2-user
-    |--- fabric-samples/
-    |--- mywork/

### STEP-1 [ Start 2 Org Network ]

- cd fabric-samples/commercial-paper
- cp /home/ec2-user/mywork/fabric_commands.txt dorun.sh
- bash dorun.sh

### STEP-2 [ Start Client Apps - Middleware ]

- docker run --publish 27017:27017 --detach --name my-mongo mongo:latest
- docker run  -e ME_CONFIG_MONGODB_SERVER=my-mongo -p 8081:8081 mongo-express
- cd /home/ec2-user/mywork/middleware/
- npm install
- npm start &
- curl -H "Content-Type: application/json" -X POST -d '{"firstName" : "Sunil","lastName" : "Vishnu","email":"sunilvb@gmail.com","password":"sunder74"}' http://localhost:3600/users/

- curl -H "Content-Type: application/json" -X POST -d '{"projectName" : "Project Lunchbox","projectDescription" : "In School lunch for k-5th grade in Uganda","stDate":"5-5-2020","endDate":"10-10-2020"}' http://localhost:3600/projects/

- curl -H "Content-Type: application/json" -X POST -d '{"projectName" : "Hope for the elderly","projectDescription" : "At home care for elderly with disabilities","stDate":"5-5-2020","endDate":"10-10-2020"}' http://localhost:3600/projects/

- curl -H "Content-Type: application/json" -X POST -d '{"email":"sunilvb@gmail.com","password":"sunder74"}' http://localhost:3600/auth/
- curl http://localhost:3600/projects/ 


### Step-3 [ Start Client Apps - Frontend ]

- cd ../web_spa
- npm install
- vi .env # copy the config values
- vi public/js/app.js # update the url to api (not localhost if using public host)

### Step-4 [ Install Blockchain Contract chain-code ]

- cp -r ../org1-application /home/ec2-user/fabric-samples/commercial-paper/organization/magnetocorp/
- ls -l /home/ec2-user/fabric-samples/commercial-paper/organization/magnetocorp/org1-application


- npm install
- node addToWallet.js
- cp 

### Step-last

cleanup

- docker stop <mongo container id>
- docker rm /my-mongo

=>