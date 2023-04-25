#!/bin/bash

# Define the node arguments

# Move up one directory and delete any existing network emulation rules
cd ..
tc qdisc del dev eth0 root netem

# Run the script with no loss
echo "Running with no loss"
node ./dist/client/src/measure-all-protocols.js --loss-rate 0 "$@"
echo "SUCCESS"

# Set up network emulation for each loss rate and run the script
for loss_rate in 0.1 0.5 1 2 5 10 25 50 75 90; do
  tc qdisc del dev eth0 root netem
  tc qdisc add dev eth0 root netem loss "$loss_rate"% 

  echo "Running with $loss_rate% loss"
  node ./dist/client/src/measure-all-protocols.js --loss-rate "$loss_rate" "$@"
  echo "SUCCESS"
done

# Clean up the network emulation rules
tc qdisc del dev eth0 root netem
