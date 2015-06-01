
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

Once you obtain the p12 file:

```
$ openssl pkcs12 -in myp12.pfx -nocerts -out privateKey.pem
$ openssl pkcs12 -in myp12.pfx -clcerts -nokeys -out publicCert.pem
# It may not work if you don't: http://stackoverflow.com/a/18102479/2114395
$ openssl rsa -in privateKey.pem -out privateUnKey.pem
```

===

## Troubleshooting

- Case of error `bad end line`: [read this](http://www.ur-ban.com/blog/2010/12/09/nginx-ssl-pem_read_biobad-end-line)
