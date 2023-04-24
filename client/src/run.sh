cd ..
tc qdisc del dev eth0 root netem
node ./dist/client/src/measure-all-protocols.js --loss-rate 0
tc qdisc add dev eth0 root netem loss 0.1%
node ./dist/client/src/measure-all-protocols.js --loss-rate 0.1
tc qdisc add dev eth0 root netem loss 0.5%
node ./dist/client/src/measure-all-protocols.js --loss-rate 0.5
tc qdisc add dev eth0 root netem loss 1%
node ./dist/client/src/measure-all-protocols.js --loss-rate 1
tc qdisc add dev eth0 root netem loss 2%
node ./dist/client/src/measure-all-protocols.js --loss-rate 2
tc qdisc add dev eth0 root netem loss 5%
node ./dist/client/src/measure-all-protocols.js --loss-rate 5
tc qdisc add dev eth0 root netem loss 10%
node ./dist/client/src/measure-all-protocols.js --loss-rate 10
tc qdisc add dev eth0 root netem loss 25%
node ./dist/client/src/measure-all-protocols.js --loss-rate 25
tc qdisc add dev eth0 root netem loss 50%
node ./dist/client/src/measure-all-protocols.js --loss-rate 50
tc qdisc add dev eth0 root netem loss 75%
node ./dist/client/src/measure-all-protocols.js --loss-rate 75
tc qdisc add dev eth0 root netem loss 90%
node ./dist/client/src/measure-all-protocols.js --loss-rate 90
