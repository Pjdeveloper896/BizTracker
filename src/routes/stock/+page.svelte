<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Chart from 'chart.js/auto';

  let tableData = [];
  let itemName = '';
  let costPrice = '';
  let sellingPrice = '';
  let quantity = '';
  let profitLoss = 0;

  let quantityChart, profitChart, priceChart;

  const API_BASE = 'https://biz-suit-api.onrender.com/api';
  const API_KEY = 'dev-key-localhost';

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
      tableData = data.map(item => ({
        ...item,
        id: item._id || item.id
      }));
      calculateProfitLoss();
      saveToLocalStorage();
      renderCharts();
    } catch (err) {
      console.error('❌ Failed to fetch stock', err);
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
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
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
    if (!item?.id) return;

    try {
      const res = await fetch(`${API_BASE}/stock/${item.id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadFromAPI();
    } catch (err) {
      console.error('❌ Error removing entry:', err);
    }
  }

  function saveToLocalStorage() {
    if (browser) localStorage.setItem('stockTable', JSON.stringify(tableData));
  }

  function loadFromLocalStorage() {
    if (browser) {
      const saved = localStorage.getItem('stockTable');
      if (saved) {
        tableData = JSON.parse(saved);
        calculateProfitLoss();
        renderCharts();
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
    const csv = [headers, ...rows].map(r => r.map(val => `"${val}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'stock_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function renderCharts() {
    if (!browser) return;

    const labels = tableData.map(row => row.itemName);

    // Quantity Chart
    if (quantityChart) quantityChart.destroy();
    quantityChart = new Chart(document.getElementById('quantityChart') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Quantity',
          data: tableData.map(row => row.quantity),
          backgroundColor: '#6366F1'
        }]
      }
    });

    // Profit Chart
    if (profitChart) profitChart.destroy();
    profitChart = new Chart(document.getElementById('profitChart') as HTMLCanvasElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Profit/Loss',
          data: tableData.map(row => (row.sellingPrice - row.costPrice) * row.quantity),
          backgroundColor: ['#10B981', '#F43F5E', '#F59E0B', '#3B82F6', '#8B5CF6']
        }]
      }
    });

    // Price Comparison Chart
    if (priceChart) priceChart.destroy();
    priceChart = new Chart(document.getElementById('priceChart') as HTMLCanvasElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Cost Price',
            data: tableData.map(row => row.costPrice),
            borderColor: '#EF4444',
            fill: false
          },
          {
            label: 'Selling Price',
            data: tableData.map(row => row.sellingPrice),
            borderColor: '#22C55E',
            fill: false
          }
        ]
      }
    });
  }

  onMount(() => loadFromAPI());
</script>

<!-- Dashboard Container -->
<div class="min-h-screen bg-gray-50 flex flex-col">
  <!-- Header -->
  <header class="bg-indigo-600 text-white p-4 shadow-lg flex justify-between items-center">
    <h2 class="text-lg font-bold">📊 Stock Dashboard</h2>
    <div class={`font-semibold px-3 py-1 rounded-full ${profitLoss >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      Total: ₹{profitLoss}
    </div>
  </header>

  <!-- Form Section -->
  <section class="bg-white shadow-md p-4 grid gap-3 sm:grid-cols-5 rounded-lg m-4">
    <input type="text" placeholder="Item Name" bind:value={itemName} class="border p-2 rounded w-full" />
    <input type="number" placeholder="Cost Price" bind:value={costPrice} class="border p-2 rounded w-full" />
    <input type="number" placeholder="Selling Price" bind:value={sellingPrice} class="border p-2 rounded w-full" />
    <input type="number" placeholder="Quantity" bind:value={quantity} class="border p-2 rounded w-full" />
    <button class="bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700 transition" on:click={addEntry}>➕ Add</button>
  </section>

  <!-- Actions -->
  <div class="flex justify-end p-4">
    <button class="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition" on:click={exportCSV}>
      📤 Export CSV
    </button>
  </div>

  <!-- Charts Section -->
  <section class="grid md:grid-cols-3 gap-4 p-4">
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="font-bold mb-2">📦 Quantity Overview</h3>
      <canvas id="quantityChart"></canvas>
    </div>
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="font-bold mb-2">💰 Profit Distribution</h3>
      <canvas id="profitChart"></canvas>
    </div>
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="font-bold mb-2">📈 Price Comparison</h3>
      <canvas id="priceChart"></canvas>
    </div>
  </section>

  <!-- Table Section -->
  <main class="p-4 flex-1">
    {#if tableData.length === 0}
      <p class="text-center text-gray-500 mt-10">No stock items yet. Add some above!</p>
    {:else}
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full bg-white border-collapse">
          <thead class="bg-indigo-100 sticky top-0">
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
              <tr class="border-b hover:bg-indigo-50 odd:bg-gray-50">
                <td class="p-3">{row.itemName}</td>
                <td class="p-3">₹{row.costPrice}</td>
                <td class="p-3">₹{row.sellingPrice}</td>
                <td class="p-3">{row.quantity}</td>
                <td class={`p-3 font-semibold ${(row.sellingPrice - row.costPrice) * row.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{(row.sellingPrice - row.costPrice) * row.quantity}
                </td>
                <td class="p-3">
                  <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition" on:click={() => removeEntry(i)}>🗑 Delete</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </main>
</div>

<style>
  :global(html) {
    font-family: 'Inter', system-ui, sans-serif;
    scroll-behavior: smooth;
  }
</style>
