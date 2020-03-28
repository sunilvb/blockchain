# Blockchain
This is sample application that illustrates how one could use Blockchain and Distributed Ledger Technology in the charity space with the following features:

## Security

Only authorized actors have the ability to update the data in the Blockchain.

## Transparency

Show when and who updated the data in the Blockchain.

## Auditability

Every member of the Blockchain can audit the data and once the data is committed there, it cannot be changed (immutability) in the Ledger.

## Trust

With DLT and Blockchain, trus is built-in, you have your copy of the ledger that is immutable accross all the member copies.

## Tech stack
- JavaScript / NodeJS
- HyperLedger v2.0
- Docker
- MongoDB

cd fabric-samples/commercial-paper
cp /home/ec2-user/mywork/fabric_commands.txt dorun.sh
bash dorun.sh

docker run --publish 27017:27017 --detach --name my-mongo mongo:latest
cd /home/ec2-user/mywork/middleware/
npm install
npm start
curl -H "Content-Type: application/json" -X POST -d '{"firstName" : "Sunil","lastName" : "Vishnu","email":"sunilvb@gmail.com","password":"sunder74"}' http://localhost:3600/users/
cd ../web_spa
npm install

=>