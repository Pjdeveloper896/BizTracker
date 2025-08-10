<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let tableData = [];
  let itemName = '';
  let costPrice = '';
  let sellingPrice = '';
  let quantity = '';
  let profitLoss = 0;

  const API_BASE = 'https://biz-suit-api.onrender.com/api';
  const API_KEY = 'dev-key-localhost'; // change to your key

  function calculateProfitLoss() {
    profitLoss = tableData.reduce(
      (acc, row) => acc + (row.sellingPrice - row.costPrice) * row.quantity,
      0
    );
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
    }
  }

  async function removeEntry(index: number) {
    const item = tableData[index];
    if (!item || !item.itemName) return;

    try {
      const res = await fetch(
        `${API_BASE}/stock/${encodeURIComponent(item.itemName)}`,
        {
          method: 'DELETE',
          headers: { 'x-api-key': API_KEY }
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadFromAPI();
    } catch (err) {
      console.error('❌ Error removing entry:', err);
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

<!-- Container -->
<div class="min-h-screen bg-gray-100 flex flex-col">
  <!-- Header -->
  <header class="bg-indigo-600 text-white p-4 shadow-lg flex justify-between items-center">
    <h2 class="text-lg font-bold">📦 Stock Manager</h2>
    <div class="font-semibold bg-white text-indigo-700 px-3 py-1 rounded-full">
      Total: ₹{profitLoss}
    </div>
  </header>

  <!-- Form Section -->
  <section class="bg-white shadow-md p-4 grid gap-2 sm:grid-cols-5">
    <input type="text" placeholder="Item Name" bind:value={itemName} class="border p-2 rounded" />
    <input type="number" placeholder="Cost Price" bind:value={costPrice} class="border p-2 rounded" />
    <input type="number" placeholder="Selling Price" bind:value={sellingPrice} class="border p-2 rounded" />
    <input type="number" placeholder="Quantity" bind:value={quantity} class="border p-2 rounded" />
    <button class="bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700" on:click={addEntry}>➕ Add</button>
  </section>

  <!-- Actions -->
  <div class="flex justify-end p-4 bg-gray-50">
    <button class="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600" on:click={exportCSV}>
      📤 Export CSV
    </button>
  </div>

  <!-- Table -->
  <main class="p-4 flex-1">
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow rounded-lg">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="p-3 text-left">Item</th>
            <th class="p-3 text-left">Cost Price</th>
            <th class="p-3 text-left">Selling Price</th>
            <th class="p-3 text-left">Quantity</th>
            <th class="p-3 text-left">Profit/Loss</th>
            <th class="p-3 text-left">Remove</th>
          </tr>
        </thead>
        <tbody>
          {#each tableData as row, i}
            <tr class="border-b hover:bg-gray-50">
              <td class="p-3">{row.itemName}</td>
              <td class="p-3">₹{row.costPrice}</td>
              <td class="p-3">₹{row.sellingPrice}</td>
              <td class="p-3">{row.quantity}</td>
              <td class="p-3 font-semibold {(row.sellingPrice - row.costPrice) * row.quantity >= 0 ? 'text-green-600' : 'text-red-600'}">
                ₹{(row.sellingPrice - row.costPrice) * row.quantity}
              </td>
              <td class="p-3">
                <button class="text-red-500 hover:underline" on:click={() => removeEntry(i)}>✕</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </main>
</div>

<style>
  :global(html) {
    font-family: system-ui, sans-serif;
    scroll-behavior: smooth;
  }
</style>
