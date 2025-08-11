<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

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
    if (!browser || !window.Chart) return;

    const labels = tableData.map(row => row.itemName);

    // Quantity Chart
    if (quantityChart) quantityChart.destroy();
    quantityChart = new window.Chart(document.getElementById('quantityChart') as HTMLCanvasElement, {
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
    profitChart = new window.Chart(document.getElementById('profitChart') as HTMLCanvasElement, {
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
    priceChart = new window.Chart(document.getElementById('priceChart') as HTMLCanvasElement, {
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

<svelte:head>
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<!-- Your UI remains same as earlier improved version -->
