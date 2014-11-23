# Source was http://stackoverflow.com/a/10952105

# Test 20 connections with 4 threads at the time
# n.b. "localhost" does not work, probably an "ab" bug
ab -c 4 -n 20 -v 10 http://127.0.0.1:5000/data
