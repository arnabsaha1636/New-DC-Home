import { test, expect } from "@playwright/test";
test("Every tab, live inputs, market filters, shocks, report actions and guided walkthrough work", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "StayWise DC", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("$8,733.92").first()).toBeVisible();
  await page.screenshot({
    path: "test-results/desktop-overview.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Revenue & Profit Calculator", exact: true })
    .click();
  const slider = page.locator("#nightly-price-input");
  await slider.fill("200");
  await slider.dispatchEvent("input");
  await expect(page.getByText("$15,368.72").first()).toBeVisible();
  const occupancy = page.locator("#occupancy-rate-input");
  await occupancy.fill("0");
  await occupancy.dispatchEvent("input");
  await page
    .getByRole("button", { name: "Decision Scorecard", exact: true })
    .click();
  await expect(page.getByTestId("recommendation")).toContainText("RECONSIDER");
  await page
    .getByRole("button", { name: "Revenue & Profit Calculator", exact: true })
    .click();
  await page.locator("#occupancy-rate-input").fill("0.5");
  await page.locator("#occupancy-rate-input").dispatchEvent("input");
  // Every original slider changes and restores without reloading.
  for (const [id, value] of [
    ["available-nights-input", "160"],
    ["occupancy-rate-input", "0"],
    ["cleaning-charged-input", "70"],
    ["cleaner-cost-input", "80"],
    ["owner-hours-input", "4"],
  ]) {
    const input = page.locator("#" + id);
    const prior = await input.inputValue();
    await input.fill(value);
    await input.dispatchEvent("input");
    await expect(input).toHaveValue(value);
    await input.fill(prior);
    await input.dispatchEvent("input");
  }
  await page.getByText("Additional model assumptions", { exact: true }).click();
  for (const label of [
    "Average stay (nights)",
    "Initial setup budget",
    "Setup amortization (years)",
    "Monthly utilities",
    "Monthly supplies",
    "Monthly insurance add-on",
    "Annual maintenance",
    "Host platform fee (%)",
    "Modeled income tax (%)",
    "Guest lodging tax (%)",
    "Value of host time / hour",
  ]) {
    const input = page.getByRole("spinbutton", { name: label, exact: true });
    const prior = await input.inputValue();
    await input.fill(String(Number(prior) + 1));
    await expect(input).toHaveValue(String(Number(prior) + 1));
    await input.fill(prior);
  }
  await page
    .getByRole("button", { name: "What-If Simulator", exact: true })
    .click();
  const results = page.getByTestId("stress-results"),
    baseline = await results.innerText();
  await page
    .getByRole("button", { name: "Demand Falls 25%", exact: false })
    .click();
  await expect(results).not.toHaveText(baseline);
  await expect(page.getByText("50.0% → 37.5%", { exact: false })).toBeVisible();
  await page
    .getByRole("button", { name: "Price Compression 15%", exact: false })
    .click();
  await expect(
    page.getByText("$200.00 → $170.00", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Cost & Cleaning Spike 20%", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Compound Stress Test", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Reset Baseline", exact: true })
    .last()
    .click();
  expect(await results.innerText()).toBe(baseline);
  await page
    .getByRole("button", {
      name: "Market Comps (39 Neighborhoods)",
      exact: true,
    })
    .click();
  const stats = page.getByTestId("market-stats"),
    privateSample = await stats.innerText();
  await page
    .getByLabel("Room type", { exact: true })
    .selectOption("Entire home/apt");
  expect(await stats.innerText()).not.toBe(privateSample);
  await page.getByLabel("Stay market", { exact: true }).selectOption("long");
  await expect(stats).toContainText("No priced sample");
  await expect(
    page.getByRole("button", { name: "Use filtered median in calculator" }),
  ).toBeDisabled();
  await page
    .getByLabel("Maximum listing minimum nights", { exact: true })
    .fill("");
  await expect(stats).not.toContainText("No priced sample");
  await page.getByLabel("Stay market", { exact: true }).selectOption("short");
  await page
    .getByLabel("Sort neighborhoods", { exact: true })
    .selectOption("price");
  await page
    .getByLabel("Filter DC neighborhoods", { exact: true })
    .fill("nothing matches this");
  await expect(
    page.getByText("No neighborhoods match your search."),
  ).toBeVisible();
  await page
    .getByLabel("Filter DC neighborhoods", { exact: true })
    .fill("Petworth");
  await page.getByRole("button", { name: "View comps", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Use filtered median in calculator",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "DC Legal Eligibility", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Investment / 2nd Home", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Decision Scorecard", exact: true })
    .click();
  await expect(page.getByTestId("recommendation")).toContainText("STOP");
  await page
    .getByRole("button", { name: "DC Legal Eligibility", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Primary (Homestead)", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Unhosted (Vacation)", exact: true })
    .click();
  await page.getByRole("checkbox").check();
  await expect(page.getByText("90 Nights / Yr", { exact: true })).toBeVisible();
  await page
    .getByRole("button", {
      name: "View DC Short-Term Rental Act",
      exact: false,
    })
    .click();
  await expect(
    page.getByText("15.95%", { exact: false }).first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset Baseline", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Overview & Maya's Case", exact: true })
    .click();
  await page.locator("#open-submission-modal-btn").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("$8,733.92");
  await dialog.getByRole("button", { name: "Copy Text", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("Copied Report");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "$8,733.92",
  );
  for (const name of [
    "Deliverable B: 2:45 Zoom Demo Script",
    "Development Error Log",
    "Data Methodology",
    "Submission Checklist",
  ]) {
    await dialog.getByRole("button", { name, exact: true }).click();
  }
  await expect(dialog.getByRole("checkbox").first()).not.toBeChecked();
  await dialog.getByRole("checkbox").first().check();
  await dialog
    .getByRole("button", {
      name: "Deliverable C: Two-Page Report",
      exact: true,
    })
    .click();
  await page.emulateMedia({ media: "print" });
  const pdfBytes = await page.pdf({
    path: "test-results/report.pdf",
    preferCSSPageSize: true,
    printBackground: true,
  });
  expect(pdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g)).toHaveLength(
    2,
  );
  await page
    .locator(".report-page")
    .first()
    .screenshot({ path: "test-results/report-page-1.png" });
  await page
    .locator(".report-page")
    .last()
    .screenshot({ path: "test-results/report-page-2.png" });
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => {
    window.print = () => {
      document.body.dataset.printed = "yes";
    };
  });
  await dialog.getByRole("button", { name: "Print PDF", exact: true }).click();
  await expect(page.locator("body")).toHaveAttribute("data-printed", "yes");
  await dialog
    .getByRole("button", { name: "Close report", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await page.locator("#start-guided-demo-btn").click();
  for (let i = 0; i < 6; i++)
    await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Complete", exact: true }).click();
  const csv = await page.request.get("assets/dc-listings-2026-09-19.csv");
  expect(csv.ok()).toBeTruthy();
  expect((await csv.text()).startsWith("id,name,host_id")).toBeTruthy();
  const pdf = await page.request.get(
    "assets/aistudio/DC_Airbnb_Listings___2026-09-19_App_Dataset_cb396327.pdf",
  );
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  expect(errors).toEqual([]);
});
test("Mobile layout keeps navigation, tables and report usable without horizontal page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  for (const name of [
    "Overview & Maya's Case",
    "DC Legal Eligibility",
    "Market Comps (39 Neighborhoods)",
    "Revenue & Profit Calculator",
    "What-If Simulator",
    "Decision Scorecard",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.screenshot({
    path: "test-results/mobile-scorecard.png",
    fullPage: true,
  });
  await page.locator("#open-submission-modal-btn").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
