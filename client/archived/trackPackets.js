const pcap = require('pcap2');
const networkInterface = '<your_network_interface_name>'; // e.g., 'en0' or 'eth0'

const session = new pcap.Session(networkInterface, { filter: 'icmp' });
let packetCount = 0;
let droppedPackets = 0;
let icmpSequenceNumbers = new Map();

session.on('packet', (rawPacket) => {
  packetCount++;
  const packet = pcap.decode.packet(rawPacket);

  // Process the packet and check for packet loss
  if (isPacketDropped(packet)) {
    droppedPackets++;
  }

  const packetLossRate = (droppedPackets / packetCount) * 100;
  console.log(`Packet Loss Rate: ${packetLossRate.toFixed(2)}%`);
});

function isPacketDropped(packet) {
  // Check if the packet is an ICMP packet
  if (packet.payload.payload.constructor.name === 'ICMP') {
    const icmpPacket = packet.payload.payload;
    const icmpType = icmpPacket.type;
    const icmpId = icmpPacket.payload.readUInt16BE(0);
    const icmpSeq = icmpPacket.payload.readUInt16BE(2);

    // Handle ICMP echo request (type 8) and echo reply (type 0)
    if (icmpType === 8) { // Echo request
      if (icmpSequenceNumbers.has(icmpId)) {
        icmpSequenceNumbers.set(icmpId, icmpSeq);
      } else {
        icmpSequenceNumbers.set(icmpId, icmpSeq);
      }
      return false; // Don't count echo requests as dropped packets
    } else if (icmpType === 0) { // Echo reply
      if (icmpSequenceNumbers.has(icmpId)) {
        const lastSeq = icmpSequenceNumbers.get(icmpId);
        if (icmpSeq === lastSeq + 1) {
          icmpSequenceNumbers.set(icmpId, icmpSeq);
          return false;
        } else {
          icmpSequenceNumbers.set(icmpId, icmpSeq);
          return true;
        }
      } else {
        icmpSequenceNumbers.set(icmpId, icmpSeq);
        return true;
      }
    }
  }

  return false;
}
