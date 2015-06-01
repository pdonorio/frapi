#Following this guide
#https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-nginx-for-ubuntu-12-04

#Create directory
mkdir -p /etc/nginx/ssl
cd /etc/nginx/ssl
rm -f server.*

# Make initial key
nohup expect /tmp/expecting_ssl_1
# Sign certificate
nohup expect /tmp/expecting_ssl_2
# Remove password inside certificate
cp server.key server.key.org
nohup expect /tmp/expecting_ssl_3
# Create private key
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
# Change permissions
chmod 400 server.key*
