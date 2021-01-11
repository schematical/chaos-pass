describe('chaos-pass', function() {
    describe('node-rsa', function() {
        it('create key pair', async function() {
            const NodeRSA = require('node-rsa');
            const key = new NodeRSA({b: 512});
            const keyPair = key.generateKeyPair();
            const pem = key.exportKey('pkcs8');
            console.log(pem);
            const pub = key.exportKey('pkcs8-public');
            console.log(pub);

            const keyPem = new NodeRSA(pem);
            const keyPub = new NodeRSA(pub);
            const text = 'Bananas';
            const encrypted = keyPub.encrypt(text, 'base64');
            console.log('encrypted: ', encrypted);
            const decrypted = keyPem.decrypt(encrypted, 'utf8');
            console.log('decrypted: ', decrypted);

            return Promise.resolve();
        });
        it.skip('encrypt/decrypt', function() {
            const NodeRSA = require('node-rsa');
            const key = new NodeRSA({b: 512});

            const text = 'Hello RSA!';
            const encrypted = key.encrypt(text, 'base64');
            console.log('encrypted: ', encrypted);
            const decrypted = key.decrypt(encrypted, 'utf8');
            console.log('decrypted: ', decrypted);
        });
    });


    describe('ssh2-sftp-client', function(){
        it('connect to sftp', async function(){
            this.timeout(10000);
            const fs = require('fs');
            let Client = require('ssh2-sftp-client');
            let sftp = new Client();

            await sftp.connect({
                host: 'ptfs.chaosnet.ai',
                // port: '8080',
                username: process.env.SFTP_USERNAME,
                privateKey: fs.readFileSync(process.env.SFTP_PEM)
            })
            console.log("CONNECTED");
            const list = await sftp.list('/ptfs.chaosnet.ai/schematical');
            console.log(list);
            return Promise.resolve();
        })
    })
});
