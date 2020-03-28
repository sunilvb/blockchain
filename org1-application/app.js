const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CharityProject = require('../contract/lib/project.js');
const path = require('path');

const fixtures = path.resolve(__dirname, '../../../../test-network');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.get('/addW', async(req, res) => {

    // Main try/catch block
    try {
        // A wallet stores a collection of identities
        const wallet = await Wallets.newFileSystemWallet('../identity/user/isabella/wallet');

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, '/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com');
        const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org2.example.com-cert.pem')).toString();
        const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();

        // Load credentials into wallet
        const identityLabel = 'isabella';

        const identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };

    
        await wallet.put(identityLabel,identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
    res.json({ message: 'hooray! welcome to our api!' });   
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', async(req, res) =>{
    
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/isabella/wallet');

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    
    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'isabella';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract');

        // issue commercial paper
        console.log('Submit commercial paper issue transaction.');

        const issueResponse = await contract.submitTransaction('create', 'BigHeartCorp', '00001', '2020-05-31', '2020-11-30', '5000000');

        // process response
        console.log('Process issue transaction response.'+issueResponse);

        let project = CharityProject.fromBuffer(issueResponse);

        console.log(`${project.owner} commercial paper : ${project.projectNumber} successfully issued for value ${project.projectCost}`);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
    
    res.json({ message: 'apiW Done...!' });   
});


app.use('/api', router);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));