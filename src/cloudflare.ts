import { monitorEnv } from "./env";
import axios from "axios";
import { z } from "zod";

export const listDnsRecords = async () =>
  axios
    .get(
      `https://api.cloudflare.com/client/v4/zones/${monitorEnv.CLOUDFLARE_ZONE_ID}/dns_records`,
      {
        headers: {
          "X-Auth-Email": monitorEnv.CLOUDFLARE_EMAIL,
          "X-Auth-Key": monitorEnv.CLOUDFLARE_API_KEY,
          "Content-Type": "application/json",
        },
      },
    )
    .then((response) => listDnsRecordsSchema.parse(response.data))
    .catch((error) => {
      console.error("Error listing DNS records:", error);
      return null;
    });

const listDnsRecordsSchema = z.object({
  result: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      content: z.string(),
    })
    .array(),
});

export const createDnsRecord = async ({
  newIpAddress,
}: {
  newIpAddress: string;
}) => {
  console.log(`Creating DNS record for ${newIpAddress}...`);

  return await axios
    .post(
      `https://api.cloudflare.com/client/v4/zones/${monitorEnv.CLOUDFLARE_ZONE_ID}/dns_records`,
      {
        type: "A",
        name: monitorEnv.DOMAIN_NAME,
        content: newIpAddress,
        ttl: 1,
      },
      {
        headers: {
          "X-Auth-Email": monitorEnv.CLOUDFLARE_EMAIL,
          "X-Auth-Key": monitorEnv.CLOUDFLARE_API_KEY,
          "Content-Type": "application/json",
        },
      },
    )
    .then(() => {
      console.log(`DNS record created successfully for ${newIpAddress}!`);
      return true;
    })
    .catch((error) => {
      console.error("Error creating DNS record:", error);
      return false;
    });
};

export const updateDnsRecord = async ({
  newIpAddress,
  recordId,
}: {
  newIpAddress: string;
  recordId: string;
}) => {
  console.log(`Updating DNS record to ${newIpAddress}...`);

  return await axios
    .put(
      `https://api.cloudflare.com/client/v4/zones/${monitorEnv.CLOUDFLARE_ZONE_ID}/dns_records/${recordId}`,
      {
        type: "A",
        name: monitorEnv.DOMAIN_NAME,
        content: newIpAddress,
        ttl: 1,
      },
      {
        headers: {
          "X-Auth-Email": monitorEnv.CLOUDFLARE_EMAIL,
          "X-Auth-Key": monitorEnv.CLOUDFLARE_API_KEY,
          "Content-Type": "application/json",
        },
      },
    )
    .then(() => {
      console.log(`DNS record updated successfully to ${newIpAddress}!`);
      return true;
    })
    .catch((error) => {
      console.error("Error updating DNS record:", error);
      return false;
    });
};
