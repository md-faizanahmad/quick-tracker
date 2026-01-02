<h1>Offline Expense Tracker (PWA)</h1>
<p>
A <strong>mobile-first, offline-first expense tracking web app</strong> that works reliably on real phones,
supports IndexedDB storage, and syncs data safely when the network is available.
</p>

<hr />

<h2>🎯 Project Goals</h2>
<ul>
  <li>Work fully offline (add, edit, delete expenses without internet)</li>
  <li>Reliable sync when network is available</li>
  <li>Correct behavior on <strong>mobile and PWA</strong>, not just desktop</li>
  <li>Prevent UI breakage from unbounded user input</li>
  <li>Keep architecture simple, debuggable, and scalable</li>
</ul>

<hr />

<h2>🧱 Architecture Overview</h2>
<p><strong>High-level data flow:</strong></p>
<pre>
UI (React Components)
   ↓
Local State + Events
   ↓
IndexedDB (Source of Truth)
   ↓
Sync Layer (NetworkOnly)
   ↓
Backend API (/sync)
</pre>

<p>
<strong>Core principle:</strong><br />
IndexedDB is the source of truth. Network sync is opportunistic and never blocks user actions.
</p>

<hr />

<h2>🗂️ Folder Structure</h2>
<pre>
src/
├── components/
│   ├── Header.tsx
│   ├── ExpenseForm.tsx
│   ├── ExpenseList.tsx
│   ├── CategoryChart.tsx
│   └── InstallPrompt.tsx
│
├── hooks/
│   ├── useSync.ts
│   ├── useOnlineStatus.ts
│   └── useSyncStatus.ts
│
├── lib/
│   ├── db/
│   │   └── indexedDb.ts
│   ├── api/
│   │   └── sync.ts
│   ├── analytics/
│   │   └── categorySummary.ts
│   └── validation/
│       └── expenseValidation.ts
│
├── types/
│   └── expenses.ts
│
├── App.tsx
└── main.tsx
</pre>

<hr />

<h2>💾 Offline Storage (IndexedDB)</h2>
<ul>
  <li>All CRUD operations happen locally</li>
  <li>App never blocks on network availability</li>
  <li>Each expense tracks its sync state using a <code>synced</code> flag</li>
</ul>
<p>
Whenever IndexedDB changes, the app dispatches a custom event:
</p>
<pre>
window.dispatchEvent(new Event("expenses-updated"));
</pre>
<p>
This keeps components decoupled without introducing complex global state.
</p>

<hr />

<h2>🔁 Sync Strategy (Mobile-Safe)</h2>
<p><strong>Important design choice:</strong></p>
<ul>
  <li>Never block sync logic using <code>navigator.onLine</code></li>
  <li>Always attempt the network request</li>
  <li>Let <code>fetch()</code> decide if the network is available</li>
</ul>

<p>
Mobile browsers and PWAs frequently report incorrect online status.
Relying on <code>navigator.onLine</code> causes false negatives on phones.
</p>

<p>
Correct pattern:
</p>

<pre>
try request → if fails → keep pending → retry later
</pre>

<hr />

<h2>🌐 Service Worker & PWA Handling</h2>

<p>
Mobile PWAs aggressively cache requests and can silently swallow API calls.
To prevent this:
</p>

<ul>
  <li>The <code>/sync</code> endpoint is explicitly marked as <strong>NetworkOnly</strong></li>
  <li>Absolute backend URL is matched in Workbox runtime caching</li>
  <li>Sync requests use <code>cache: "no-store"</code></li>
</ul>

<p>
This guarantees sync works correctly on real phones and installed PWAs.
</p>

<hr />

<h2>✍️ Input Validation & UI Safety</h2>

<ul>
  <li>Maximum amount limits to prevent absurd values</li>
  <li>Text and note length caps to prevent card overflow</li>
  <li>Validation logic separated from UI components</li>
</ul>

<p>
Validation lives in a dedicated module:
</p>

<pre>
lib/validation/expenseValidation.ts
</pre>

<p>
This keeps components clean and reusable.
</p>

<hr />

<h2>📊 Spending Insights</h2>

<p>
Instead of heavy chart libraries:
</p>

<ul>
  <li>Expenses are grouped by category</li>
  <li>A lightweight bar chart shows where money is spent most</li>
  <li>No third-party chart dependencies</li>
</ul>

<p>
This keeps the app fast, mobile-friendly, and bundle-size efficient.
</p>

<hr />

<h2>📱 Mobile-First Considerations</h2>

<ul>
  <li>Large tap targets</li>
  <li>Card-based layout</li>
  <li>No hover-only interactions</li>
  <li>Sync logic tested on real devices</li>
</ul>

<hr />

<h2>🚫 Intentional Trade-offs</h2>

<ul>
  <li>No server-side state ownership</li>
  <li>No blocking network calls</li>
  <li>No heavy state libraries (Redux, Zustand)</li>
  <li>No reliance on unreliable online flags</li>
</ul>

<hr />

<h2>🧠 Engineering Takeaways</h2>

<ul>
  <li>Offline-first requires optimistic UI and pessimistic sync</li>
  <li>IndexedDB is storage, not UI state</li>
  <li>Mobile PWAs require explicit Service Worker control</li>
  <li>Attempt-based networking is more reliable than status flags</li>
</ul>

<hr />

<h2>🚀 Future Improvements</h2>

<ul>
  <li>Background Sync API</li>
  <li>Retry with exponential backoff</li>
  <li>Monthly summaries</li>
  <li>Export (CSV / PDF)</li>
  <li>Budget alerts</li>
</ul>

<hr />

<h2>✅ Why This Project Matters</h2>

<p>
This project focuses on real-world constraints:
</p>

<ul>
  <li>Unstable mobile networks</li>
  <li>Offline usage</li>
  <li>PWA pitfalls</li>
  <li>Clean, maintainable architecture</li>
</ul>

<p>
It is built as a practical solution, not a tutorial demo.
</p>
