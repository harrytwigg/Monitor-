import { publicIpv4 } from "public-ip";
import { monitorEnv } from "./env";
import { createDnsRecord, listDnsRecords, updateDnsRecord } from "./cloudflare";

const handler = async () => {
  const ip = await publicIpv4();

  const records = await listDnsRecords();

  if (records === null) {
    console.warn("No DNS records found.");
    return;
  }

  const record = records.result.find(
    (record) => record.name === monitorEnv.DOMAIN_NAME,
  );
  if (!record) {
    await createDnsRecord({ newIpAddress: ip });
    return;
  }

  // If record already exists, with same name and type then dont update
  if (record.type === "A" && record.content === ip) {
    return;
  }

  await updateDnsRecord({
    newIpAddress: ip,
    recordId: record.id,
  });
};

console.log("Starting Monitor 🦎");

(async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await handler();
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
})().catch((error) =>
  console.error(
    "An unhandled error occurred while updating DNS record.",
    error,
  ),
);
