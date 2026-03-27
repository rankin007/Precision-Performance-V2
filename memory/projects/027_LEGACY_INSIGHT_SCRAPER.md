created: 27/03/2026
last_updated: 27/03/2026
status: active

# Project 027: Legacy Insight Scraper & Knowledge Base

## Objective
Extract UI/UX patterns, testing data, and biological formulas from Attempt 1 documents without contaminating the V2 codebase.

## Requirements
- **Isolation:** Files live in a `/knowledge-base` directory, ignored by the production build.
- **Pattern Extraction:** Identify "Entering and Editing" layouts that felt intuitive in the first attempt.
- **Data Seed:** Use old testing logs to create "Mock Horses" for stress-testing the .com.au environment.
- **Formula Audit:** Cross-reference every mention of $C = ms \times 1.43$ and the 3.0%–4.0% Brix range for absolute consistency.

## Status
- [ ] Directory Setup (`/knowledge-base/legacy-insights`)
- [ ] Document Indexing
- [ ] UI/UX Scrape (Layout analysis)
