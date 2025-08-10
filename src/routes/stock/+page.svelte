<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';

  // --------- Config ----------
  const BASE_URL = 'https://biz-suit-api.onrender.com';
  const STOCK_ENDPOINT = `${BASE_URL}/api/stock`;
  const SCAN_ENDPOINT = (code: string) => `${BASE_URL}/api/scan/${encodeURIComponent(code)}`;

  // --------- Stores & reactive vars ----------
  let tableData: Array<{
    id?: number;
    itemName: string;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    timestamp?: string;
    barcode?: string;
    qr?: string;
  }> = [];

  let itemName = '';
  let costPrice: string | number = '';
  let sellingPrice: string | number = '';
  let quantity: string | number = '';

  let profitLoss = 0;
  let loading = false;
  let apiKey = '';
  let toast = writable<{ type: 'info'|'success'|'error', text: string } | null>(null);
  let showApiModal = false;
  let scanCode = '';
  let scanning = false;

  // --------- Helpers ----------
  function showToast(type: 'info'|'success'|'error', text: string, ms = 3500) {
    toast.set({ type, text });
    setTimeout(() => toast.set(null), ms);
  }

  function getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (apiKey) headers['x-api-key'] = apiKey;
    return headers;
  }

  function calculateProfitLoss() {
    profitLoss = tableData.reduce((acc, row) => {
      const profit = (row.sellingPrice - row.costPrice) * row.quantity;
      return acc + profit;
    }, 0);
  }

  // --------- API calls ----------
  async function loadFromServer() {
    if (!browser) return;
    loading = true;
    try {
      const res = await fetch(STOCK_ENDPOINT, { headers: getHeaders() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast('error', `Failed to load: ${err.error || res.statusText}`);
        tableData = [];
      } else {
        tableData = await res.json();
        // ensure numeric types
        tableData = tableData.map((r: any) => ({
          ...r,
          costPrice: Number(r.costPrice),
          sellingPrice: Number(r.sellingPrice),
          quantity: Number(r.quantity)
        }));
        calculateProfitLoss();
      }
    } catch (e) {
      showToast('error', `Network error while loading stock`);
      tableData = [];
    } finally {
      loading = false;
    }
  }

  async function addEntry() {
    if (!itemName || costPrice === '' || sellingPrice === '' || quantity === '') {
      showToast('info', 'Please fill all fields.');
      return;
    }
    if (!apiKey) {
      showApiModal = true;
      showToast('info', 'Add your API key to save to server.');
      return;
    }

    const newRow = {
      itemName: String(itemName).trim(),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity)
    };

    loading = true;
    try {
      const res = await fetch(STOCK_ENDPOINT, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newRow)
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to add item');
      } else {
        // API returns { success: true, item } in the code you shared
        const item = data.item || data;
        // Normalize the server response
        item.costPrice = Number(item.costPrice);
        item.sellingPrice = Number(item.sellingPrice);
        item.quantity = Number(item.quantity);
        // Append to tableData
        tableData = [...tableData, item];
        calculateProfitLoss();
        showToast('success', 'Item added to server ✅');
        // clear form
        itemName = costPrice = sellingPrice = quantity = '';
      }
    } catch (e) {
      showToast('error', 'Network error while adding item');
    } finally {
      loading = false;
    }
  }

  function removeEntry(index: number) {
    const item = tableData[index];
    // If you later add a DELETE /api/stock/:id endpoint, call it here.
    // Example:
    // await fetch(`${STOCK_ENDPOINT}/${item.id}`, { method: 'DELETE', headers: getHeaders() })

    // For now, remove locally (optimistic) — and inform user to add delete endpoint for server removal
    tableData.splice(index, 1);
    tableData = [...tableData];
    calculateProfitLoss();
    showToast('info', 'Item removed locally. (Add DELETE endpoint to remove from server.)');
  }

  function exportCSV() {
    if (!tableData.length) {
      showToast('info', 'No data to export.');
      return;
    }
    const headers = ['Item Name', 'Cost Price', 'Selling Price', 'Quantity', 'Profit/Loss'];
    const rows = tableData.map(row => [
      row.itemName,
      row.costPrice,
      row.sellingPrice,
      row.quantity,
      (row.sellingPrice - row.costPrice) * row.quantity
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `stock_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'CSV exported');
  }

  // -------------- Scan ---------------
  async function doScan() {
    if (!scanCode) return showToast('info', 'Enter code to scan');
    if (!apiKey) {
      showApiModal = true;
      showToast('info', 'API key required to scan');
      return;
    }
    scanning = true;
    try {
      const res = await fetch(SCAN_ENDPOINT(scanCode), { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Scan failed');
      } else {
        // Show found product and optionally add to table
        showToast('success', `Found: ${data.itemName || data.name || 'product'}`);
        // optionally push to tableData:
        // tableData = [...tableData, { ... } ]
      }
    } catch (e) {
      showToast('error', 'Network error during scan');
    } finally {
      scanning = false;
    }
  }

  // -------------- API Key Helpers ---------------
  function saveApiKey(k: string) {
    apiKey = k.trim();
    if (browser) localStorage.setItem('biz_api_key', apiKey);
    showApiModal = false;
    showToast('success', 'API key saved');
  }

  function loadApiKey() {
    if (!browser) return;
    const saved = localStorage.getItem('biz_api_key');
    if (saved) apiKey = saved;
  }

  // -------------- Mount ---------------
  onMount(() => {
    loadApiKey();
    loadFromServer();
  });
</script>

<!-- ==== UI ==== -->
<div class="stock-container">
  <div class="header">
    <h1>📦 BizSuit — Stock Manager</h1>
    <div class="actions">
      <button class="btn small" on:click={loadFromServer} disabled={loading}>⟳ Sync</button>
      <button class="btn small" on:click={() => { showApiModal = true; }}>🔑 API Key</button>
      <button class="btn small" on:click={exportCSV}>📤 Export CSV</button>
    </div>
  </div>

  <div class="form-grid">
    <input type="text" placeholder="Item Name" bind:value={itemName} />
    <input type="number" placeholder="Cost Price" bind:value={costPrice} />
    <input type="number" placeholder="Selling Price" bind:value={sellingPrice} />
    <input type="number" placeholder="Quantity" bind:value={quantity} />
    <div class="btn-row">
      <button class="btn-primary" on:click={addEntry} disabled={loading}>➕ Add Item</button>
    </div>
  </div>

  <div class="scan-row">
    <input placeholder="Scan barcode / QR code" bind:value={scanCode} />
    <button class="btn" on:click={doScan} disabled={scanning}>🔍 Scan</button>
  </div>

  {#if loading}
    <div class="loader">Loading…</div>
  {/if}

  <table class="stock-table" aria-live="polite">
    <thead>
      <tr>
        <th>Item</th>
        <th>Cost</th>
        <th>Selling</th>
        <th>Qty</th>
        <th>Profit/Loss</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each tableData as row, i (row.id ?? i)}
        <tr>
          <td>{row.itemName}</td>
          <td>₹{row.costPrice}</td>
          <td>₹{row.sellingPrice}</td>
          <td>{row.quantity}</td>
          <td class={(row.sellingPrice - row.costPrice) * row.quantity >= 0 ? 'profit' : 'loss'}>
            ₹{(row.sellingPrice - row.costPrice) * row.quantity}
          </td>
          <td>
            <button class="btn-danger" on:click={() => removeEntry(i)}>✕ Remove</button>
          </td>
        </tr>
      {:else}
        <tr><td colspan="6" class="empty">No items yet — add one above or sync from server</td></tr>
      {/each}
    </tbody>
  </table>

  <div class="summary">
    Total Profit/Loss:
    <span class={profitLoss < 0 ? 'loss' : 'profit'}> ₹{profitLoss}</span>
  </div>
</div>

<!-- API Key Modal -->
{#if showApiModal}
  <div class="modal-backdrop" on:click={() => showApiModal = false}></div>
  <div class="modal" role="dialog" aria-modal="true">
    <h3>Enter API Key</h3>
    <p>Paste your <code>x-api-key</code> for <strong>https://biz-suit-api.onrender.com</strong></p>
    <input placeholder="API Key" bind:value={apiKey} />
    <div class="modal-actions">
      <button class="btn" on:click={() => { saveApiKey(apiKey); }}>Save</button>
      <button class="btn" on:click={() => { apiKey=''; saveApiKey(''); }}>Clear</button>
      <button class="btn-cancel" on:click={() => showApiModal = false}>Close</button>
    </div>
    <small class="hint">Keys are stored in browser localStorage for convenience. In production use an account + server-side vault.</small>
  </div>
{/if}

<!-- Toast -->
{#if $toast}
  <div class="toast {$toast.type}">
    {$toast.text}
  </div>
{/if}

<style>
  :global(body) { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
  .stock-container {
    max-width: 980px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: linear-gradient(180deg,#ffffff,#fbfdff);
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(11,22,33,0.06);
    border: 1px solid rgba(0,0,0,0.03);
  }
  .header { display:flex; justify-content:space-between; align-items:center; gap:1rem; }
  h1 { margin:0; font-size:1.4rem; letter-spacing: -0.2px; }
  .actions { display:flex; gap:0.5rem; }
  .btn { padding: 0.45rem 0.7rem; border-radius:8px; border:none; cursor:pointer; background:#eceff1; }
  .btn.small { padding:0.35rem 0.6rem; font-size:0.9rem; }
  .btn-primary { background: #00695c; color:white; padding:0.6rem 1rem; border-radius:8px; }
  .btn-danger { background:#e53935; color:white; border-radius:6px; padding:0.35rem 0.6rem; }
  .form-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; margin-top:1rem; align-items:center; }
  input[type="text"], input[type="number"] { padding:0.6rem; border-radius:8px; border:1px solid #dfe6e9; font-size:0.95rem; }
  .btn-row { grid-column: span 1; display:flex; justify-content:flex-start; }
  .scan-row { display:flex; gap:0.5rem; margin-top:0.85rem; }
  .loader { margin: 1rem 0; text-align:center; color:#4b5563; }

  table.stock-table { width:100%; margin-top:1.25rem; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(9,30,50,0.04); }
  th, td { padding:0.8rem 0.9rem; border-bottom:1px solid #f2f4f6; text-align:center; font-size:0.95rem; }
  th { background:#263238; color:#fff; font-weight:600; }
  .empty { padding:2rem; color:#6b7280; }

  .profit { color: #087f5b; font-weight:700; }
  .loss { color: #b71c1c; font-weight:700; }

  .summary { margin-top:1rem; text-align:right; font-weight:700; font-size:1.05rem; color:#263238; }

  /* Modal & toast */
  .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.32); }
  .modal { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); background:white; padding:1rem 1.2rem; border-radius:10px; width:min(520px,94%); z-index:60; box-shadow:0 20px 60px rgba(0,0,0,0.18); }
  .modal input { width:100%; margin-top:0.6rem; }
  .modal-actions { margin-top:0.8rem; display:flex; gap:0.5rem; }
  .btn-cancel { background:#f3f4f6; padding:0.5rem 0.7rem; border-radius:8px; }

  .toast { position:fixed; right:1rem; bottom:1rem; padding:0.7rem 1rem; border-radius:10px; color:white; z-index:70; box-shadow:0 8px 30px rgba(0,0,0,0.18); }
  .toast.info { background:#0ea5e9; }
  .toast.success { background:#10b981; }
  .toast.error { background:#ef4444; }

  @media (max-width:720px) {
    .header { flex-direction:column; align-items:stretch; gap:0.6rem; }
    .actions { justify-content:flex-end; }
    .summary { text-align:center; }
  }
</style>
