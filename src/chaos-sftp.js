const NodeRSA = require('node-rsa');
let Client = require('ssh2-sftp-client');

class ChaosSFTP{

    constructor(config) {
        this.config = config;
        if(!this.config.enc){
            throw new Error("Missing `enc`");
        }
        this.nodeRSA = new NodeRSA(this.config.env.pem);
        if(!this.config.hosts){
            throw new Error("Missing `hosts`");
        }
        this._clients = [];
        this.config.hosts.forEach((host)=>{
            let sftp = new Client(host);
            this._clients.push(sftp);
        })
    }
    get(path){

        let promises = [];
        this._clients.forEach((client)=>{
            promises.push(client.get(path));
        });
        let decryptedResults = [];
        return Promise.all(promises)
            .then((results)=>{
                results.forEach((result)=>{
                    decryptedResults.push(this.nodeRSA.decrypt(result, 'base64'));
                })
                let masterResult = null;
                decryptedResults.forEach((decrypted)=>{
                    if(!masterResult){
                        decrypted = masterResult;
                    }else if(masterResult !== decrypted){
                        throw new Error("Host Result Miss Match: ", masterResult, decrypted);
                    }

                })
                return masterResult;
            })
    }
    put(src, path){
        const encrypted = this.nodeRSA.encrypt(src, 'base64');
        console.log('encrypted: ', encrypted);
        let promises = [];
        this._clients.forEach((client)=>{
            promises.push(client.put(encrypted, path));
        });
        return Promise.all(promises);
    }
}
export default ChaosSFTP;
