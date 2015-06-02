
# Working with SSL & certificates

===

## Development

In case of testing ssl options on your micro-services,
the best option is to build your own certificates.

By following [this guide](https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-nginx-for-ubuntu-12-04) i produced the
`docker/gui/ssl.sh`
script.

===

## Production

When going online you need a real p12 certificate from a certified authority.

Once you obtained the p12 file:

```
## All of this operations will ask for the private key password

# Get the private key
$ openssl pkcs12 -in myp12.pfx -nocerts -out privateKey.pem
# Get the intermediate public certificate
$ openssl pkcs12 -in myp12.pfx -clcerts -nokeys -out publicCert.pem
# Remove passphrase from your private key
$ openssl rsa -in privateKey.pem -out privateUnKey.pem
# Create a public key from your intermediate certificate
## you need
$ cat publicCert.pem server.ca.pem > publicUnified.pem
```

At this point `privateUnKey.pem` and `publicUnified.pem` may be used with
any web server application.

===

## Troubleshooting

- Case of error `bad end line`: [read this](http://www.ur-ban.com/blog/2010/12/09/nginx-ssl-pem_read_biobad-end-line)
