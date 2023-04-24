cd ..
tc qdisc del dev eth0 root netem
echo "Running with no loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 0
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 0.1%
echo "Running with 0.1% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 0.1
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 0.5%
echo "Running with 0.5% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 0.5
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 1%
echo "Running with 1% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 1
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 2%
echo "Running with 2% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 2
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 5%
echo "Running with 5% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 5
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 10%
echo "Running with 10% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 10
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 25%
echo "Running with 25% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 25
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 50%
echo "Running with 50% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 50
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 75%
echo "Running with 75% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 75
echo "SUCCESS"
tc qdisc del dev eth0 root netem
tc qdisc add dev eth0 root netem loss 90%
echo "Running with 90% loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 90
echo "SUCCESS"
