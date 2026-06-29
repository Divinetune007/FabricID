---
name: testing-fabricid
description: Test the FabricID textile authentication app end-to-end. Use when verifying UI, auth, fabric registration, verification, or marketplace changes.
---

# Testing FabricID

## Local Dev Setup

```bash
cd /home/ubuntu/fabric-id
npm install
npx vite --host 0.0.0.0 --port 5173
```

App runs at `http://localhost:5173/`. No backend or database needed — all data is in localStorage + demo data from `src/utils/demoData.js`.

## Devin Secrets Needed

None. The app runs entirely client-side with demo data. Firebase config uses env var fallbacks for demo mode.

## Key Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing page with hero, stats, how-it-works | No |
| `/signup` | Role-based signup (Manufacturer/Buyer) | No |
| `/login` | Login with role selector | No |
| `/dashboard` | Manufacturer dashboard with product registration | Yes (manufacturer) |
| `/verify` | Buyer verification with FabricID input | No |
| `/marketplace` | Browse verified products & manufacturers | No |

## Testing Flows

### 1. Manufacturer Signup
- Navigate to `/signup`
- "Manufacturer" role is pre-selected by default
- Fill required fields: Name, Email, Password
- Fill business fields: Company Name, Phone, Location, Specialization (dropdown)
- Click "Create Account" → redirects to `/dashboard`
- Verify: Nav shows "Dashboard" link, profile avatar appears

### 2. Fabric Registration (requires login as manufacturer)
- On `/dashboard`, click "Register New Fabric" button
- Fill Product Name (required), Category (dropdown), Price
- **Image Upload**: The file input is hidden behind the "Add" button. To upload programmatically via Playwright/CDP:
  ```javascript
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles('/path/to/image.png');
  ```
  Or create a test image first: `convert -size 200x200 xc:'#D4A574' test.png`
- Click "Analyze & Generate FabricID"
- Verify: Animation sequence (uploading → analyzing → done), FabricID generated (FID-XXXXXXXX), QR code visible, AI analysis report displayed

### 3. Buyer Verification
- Navigate to `/verify`
- Demo FabricIDs are shown as clickable buttons below the input
- Available demo IDs: `FID-A3B7C9D2`, `FID-F4E8D1C5`, `FID-B2C6D8E3`, `FID-E7A1B5C9`, `FID-C8D2E6F1`
- Click a demo ID or type one manually → click "Verify"
- Verify: Trust score (94-99%), product details, manufacturer info, AI analysis, QR code
- Test invalid ID: type any non-matching ID → expect "Product Not Found" with counterfeit warning

### 4. Marketplace
- Navigate to `/marketplace`
- Products tab: 5 demo products (+ any registered). Category filters: All, Sarees, Fabric Rolls, Dupattas, etc.
- Manufacturers tab: 5 manufacturers. Location filter dropdown.
- Click a manufacturer card → profile modal with full details

## Important Notes

- Auth is localStorage-based; clearing localStorage or hard refresh will log out
- The AI analysis is deterministic based on manufacturer name hash — same inputs produce same analysis
- Newly registered products appear in the marketplace but not in the demo data after page refresh (localStorage vs hardcoded demo data)
- The "Scan QR" button on the verify page opens a modal for manual FabricID entry (no camera in demo mode)
- Animations use Framer Motion with ~2-3 second delays for uploading/analyzing/verifying states — account for this in test timing
