cd ..
tc qdisc del dev eth0 root netem
./dist/client/src/measure-all-protocols.sh --loss-rate 0
tc qdisc add dev eth0 root netem loss 0.1%
./dist/client/src/measure-all-protocols.sh --loss-rate 0.1
tc qdisc add dev eth0 root netem loss 0.5%
./dist/client/src/measure-all-protocols.sh --loss-rate 0.5
tc qdisc add dev eth0 root netem loss 1%
./dist/client/src/measure-all-protocols.sh --loss-rate 1
tc qdisc add dev eth0 root netem loss 2%
./dist/client/src/measure-all-protocols.sh --loss-rate 2
tc qdisc add dev eth0 root netem loss 5%
./dist/client/src/measure-all-protocols.sh --loss-rate 5
tc qdisc add dev eth0 root netem loss 10%
./dist/client/src/measure-all-protocols.sh --loss-rate 10
tc qdisc add dev eth0 root netem loss 25%
./dist/client/src/measure-all-protocols.sh --loss-rate 25
tc qdisc add dev eth0 root netem loss 50%
./dist/client/src/measure-all-protocols.sh --loss-rate 50
tc qdisc add dev eth0 root netem loss 75%
./dist/client/src/measure-all-protocols.sh --loss-rate 75
tc qdisc add dev eth0 root netem loss 90%
./dist/client/src/measure-all-protocols.sh --loss-rate 90
