# Following this guide
#https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-nginx-for-ubuntu-12-04

# Create directory
mkdir /etc/nginx/ssl
cd /etc/nginx/ssl

# Make initial key
expect ssl1
# Sign certificate
expect ssl2
# Remove password inside certificate
cp server.key server.key.org
expect ssl3
# Create private key
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
# Activate the virtual host
ln -s /etc/nginx/sites-available/example /etc/nginx/sites-enabled/example
# This link will work only at runtime
