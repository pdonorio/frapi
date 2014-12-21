##How to rebuild a new angular prototype from zero

```bash
$ docker run -it -p 80:9000 -v yourapp:/opt/yourapp node

cd yourapp
yo  #follow instructions for angular generator
grunt build
# Modify Gruntfile.js, localhost to 0.0.0.0 for outside access
grunt serve
```

##what else?

```bash
Let's go
```