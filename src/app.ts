import { publicIpv4 } from "public-ip";
import { monitorEnv } from "./env";
import axios from "axios";

const getIp = async () => {
    // get public ip
    const ip = await publicIpv4();
};

const updateDnsRecord = async ({ newIpAddress }: { newIpAddress: string }) => {
    console.log(`Updating DNS record to ${newIpAddress}...`);

    try {
        const response = await axios.put(
            `https://api.cloudflare.com/client/v4/zones/${monitorEnv.CLOUDFLARE_ZONE_ID}/dns_records/${monitorEnv.CLOUDFLARE_DNS_RECORD_ID}`,
            {
                type: "A", // Assuming it's an A record. Change if necessary.
                name: monitorEnv.CLOUDFLARE_DNS_RECORD_ID,
                content: newIpAddress,
                ttl: 1,
            },
            {
                headers: {
                    "X-Auth-Email": monitorEnv.CLOUDFLARE_EMAIL,
                    "X-Auth-Key": monitorEnv.CLOUDFLARE_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(`DNS record updated successfully to ${newIpAddress}!`);
    } catch (error) {
        console.error("Error updating DNS record:", error);
    }
};
