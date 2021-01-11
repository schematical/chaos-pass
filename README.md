# chaos-pass


## File Formats:

### Browser Local Cred Storage Format:

```json
{
  "enc":{
    "pem": ""
  },
  
  "sync_hosts": [
      {
        "type": "sftp",
        "host": "ptfs.chaosnet.ai",
        "port": null,
        "username": "xxxxx",
        "privateKey": ""
      }
    ]
}

```


### Password File Save Format:
```json
{
  "logins": {
    "{{host.com}}": {
      "userame": "{{username}}",
      "password": "{{encrypted-password}}"
    }
  }
}
```
