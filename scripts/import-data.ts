import fs from "node:fs";
import { createHash } from "node:crypto";
import { parseCsv } from "../src/data/listingParser.ts";
const text = fs.readFileSync(
  "public/assets/dc-listings-2026-09-19.csv",
  "utf8",
);
const hash = createHash("sha256").update(text).digest("hex");
if (hash !== "adf5f22a93a6bae1bfa7aed60994e382415666ecf563994035d80d760bd9f268")
  throw Error("Source checksum differs from the specified snapshot");
const [headers, ...rows] = parseCsv(text);
const records = rows.map((row) => {
  if (row.length !== headers.length) throw Error("Invalid CSV row");
  const r = Object.fromEntries(headers.map((h, i) => [h, row[i]]));
  return {
    id: r.id,
    neighborhood: r.neighbourhood,
    roomType: r.room_type,
    price:
      r.price.trim() && Number.isFinite(Number(r.price)) && Number(r.price) > 0
        ? Number(r.price)
        : null,
    minimumNights: Number(r.minimum_nights),
    availability365: Number(r.availability_365),
    reviewsLast12Months: Number(r.number_of_reviews_ltm),
    license: r.license,
  };
});
if (
  records.length !== 6906 ||
  new Set(records.map((r) => r.id)).size !== 6906 ||
  records.filter((r) => r.price !== null).length !== 5993 ||
  new Set(records.map((r) => r.neighborhood)).size !== 39
)
  throw Error("Dataset validation failed");
fs.writeFileSync("src/data/listings.json", JSON.stringify(records) + "\n");
console.log(
  JSON.stringify({
    records: records.length,
    priced: records.filter((r) => r.price !== null).length,
    missing: records.filter((r) => r.price === null).length,
    neighborhoods: new Set(records.map((r) => r.neighborhood)).size,
    sha256: createHash("sha256").update(text).digest("hex"),
  }),
);
