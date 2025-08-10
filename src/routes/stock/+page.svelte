<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let tableData = [];
  let itemName = '';
  let costPrice = '';
  let sellingPrice = '';
  let quantity = '';
  let profitLoss = 0;

  // ✅ Match backend endpoint prefix
  const API_BASE = 'https://biz-suit-api.onrender.com/api';
  const API_KEY = 'dev-key-localhost'; // Change to your desired key

  function calculateProfitLoss() {
    profitLoss = tableData.reduce((acc, row) => {
      return acc + (row.sellingPrice - row.costPrice) * row.quantity;
    }, 0);
  }

  async function loadFromAPI() {
    try {
      const res = await fetch(`${API_BASE}/stock`, {
        headers: { 'x-api-key': API_KEY }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      tableData = data;
      calculateProfitLoss();
      saveToLocalStorage();
    } catch (err) {
      console.error('❌ Failed to fetch stock from API', err);
      loadFromLocalStorage();
    }
  }

  async function addEntry() {
    if (!itemName || !costPrice || !sellingPrice || !quantity) return;

    const newRow = {
      itemName,
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      quantity: parseInt(quantity)
    };

    try {
      const res = await fetch(`${API_BASE}/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(newRow)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadFromAPI();
      itemName = costPrice = sellingPrice = quantity = '';
    } catch (err) {
      console.error('❌ Error adding entry:', err);
      alert('Failed to add item — please check network/API.');
    }
  }

  async function removeEntry(index: number) {
    const item = tableData[index];
    if (!item || !item.itemName) return;

    try {
      const res = await fetch(`${API_BASE}/stock/${encodeURIComponent(item.itemName)}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadFromAPI();
    } catch (err) {
      console.error('❌ Error removing entry:', err);
      alert('Failed to delete item — please check network/API.');
    }
  }

  function saveToLocalStorage() {
    if (browser) {
      localStorage.setItem('stockTable', JSON.stringify(tableData));
    }
  }

  function loadFromLocalStorage() {
    if (browser) {
      const saved = localStorage.getItem('stockTable');
      if (saved) {
        tableData = JSON.parse(saved);
        calculateProfitLoss();
      }
    }
  }

  function exportCSV() {
    if (!tableData.length) return;

    const headers = ['Item Name', 'Cost Price', 'Selling Price', 'Quantity', 'Profit/Loss'];
    const rows = tableData.map(row => [
      row.itemName,
      row.costPrice,
      row.sellingPrice,
      row.quantity,
      (row.sellingPrice - row.costPrice) * row.quantity
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(val => `"${val}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'stock_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onMount(() => {
    loadFromAPI();
  });
</script>

<div class="stock-container">
  <h2 class="page-title">📦 Stock Management</h2>

  <div class="card">
    <div class="form-grid">
      <input type="text" placeholder="Item Name" bind:value={itemName} />
      <input type="number" placeholder="Cost Price" bind:value={costPrice} />
      <input type="number" placeholder="Selling Price" bind:value={sellingPrice} />
      <input type="number" placeholder="Quantity" bind:value={quantity} />
    </div>

    <div class="action-buttons">
      <button class="btn primary" on:click={addEntry}>➕ Add Item</button>
      <button class="btn secondary" on:click={exportCSV}>📤 Export CSV</button>
    </div>
  </div>

  <div class="card table-card">
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Cost Price</th>
          <th>Selling Price</th>
          <th>Quantity</th>
          <th>Profit/Loss</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {#each tableData as row, i}
          <tr>
            <td>{row.itemName}</td>
            <td>₹{row.costPrice}</td>
            <td>₹{row.sellingPrice}</td>
            <td>{row.quantity}</td>
            <td class={(row.sellingPrice - row.costPrice) * row.quantity >= 0 ? 'profit' : 'loss'}>
              ₹{(row.sellingPrice - row.costPrice) * row.quantity}
            </td>
            <td>
              <button class="btn danger small" on:click={() => removeEntry(i)}>✕</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="summary-card card">
    <strong>Total Profit/Loss:</strong>
    <span class={profitLoss < 0 ? 'loss' : 'profit'}>₹{profitLoss}</span>
  </div>
</div>

<style>
  .stock-container {
    max-width: 900px;
    margin: auto;
    padding: 20px;
    font-family: system-ui, sans-serif;
  }
  .page-title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  .card {
    background: white;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }
  .form-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: #007BFF; }
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 12px;
  }
  .btn {
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    font-weight: 500;
    transition: background 0.2s;
  }
  .btn.primary { background: #007BFF; color: white; }
  .btn.primary:hover { background: #0056b3; }
  .btn.secondary { background: #f0f0f0; }
  .btn.secondary:hover { background: #e0e0e0; }
  .btn.danger { background: #dc3545; color: white; }
  .btn.danger:hover { background: #a71d2a; }
  .btn.small { padding: 4px 8px; font-size: 0.85rem; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td {
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }
  th { background: #f8f9fa; font-weight: 600; }
  tr:hover { background: #fafafa; }
  .profit { color: green; font-weight: 600; }
  .loss { color: red; font-weight: 600; }
  .summary-card {
    text-align: center;
    font-size: 1.2rem;
    padding: 16px;
  }
</style>
