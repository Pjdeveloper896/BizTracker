<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let tableData = [];
  let itemName = '';
  let costPrice = '';
  let sellingPrice = '';
  let quantity = '';

  let profitLoss = 0;

  const API_BASE = 'https://biz-suit-api.onrender.com';

  function calculateProfitLoss() {
    profitLoss = tableData.reduce((acc, row) => {
      const profit = (row.sellingPrice - row.costPrice) * row.quantity;
      return acc + profit;
    }, 0);
  }

  async function loadFromAPI() {
    try {
      const res = await fetch(`${API_BASE}/stock`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      tableData = data;
      calculateProfitLoss();
      saveToLocalStorage();
    } catch (err) {
      console.error('❌ Failed to fetch stock from API', err);
      loadFromLocalStorage(); // fallback to local storage
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Refresh from API after adding
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
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Refresh list
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
  <h2 class="page-title">📦 Stock Entry</h2>

  <div class="form-grid">
    <input type="text" placeholder="Item Name" bind:value={itemName} />
    <input type="number" placeholder="Cost Price" bind:value={costPrice} />
    <input type="number" placeholder="Selling Price" bind:value={sellingPrice} />
    <input type="number" placeholder="Quantity" bind:value={quantity} />
  </div>

  <div class="action-buttons">
    <button class="btn-add" on:click={addEntry}>➕ Add Item</button>
    <button class="btn-export" on:click={exportCSV}>📤 Export CSV</button>
  </div>

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
          <td class="{(row.sellingPrice - row.costPrice) * row.quantity >= 0 ? 'profit' : 'loss'}">
            ₹{(row.sellingPrice - row.costPrice) * row.quantity}
          </td>
          <td>
            <button class="btn-remove" on:click={() => removeEntry(i)}>✕</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="summary">
    Total Profit/Loss: <span class="{profitLoss < 0 ? 'loss' : 'profit'}">₹{profitLoss}</span>
  </div>
</div>

<style>
  /* same CSS you had */
</style>
