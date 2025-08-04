<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let tableData = [];
  let itemName = '';
  let costPrice = '';
  let sellingPrice = '';
  let quantity = '';

  let profitLoss = 0;

  function calculateProfitLoss() {
    profitLoss = tableData.reduce((acc, row) => {
      const profit = (row.sellingPrice - row.costPrice) * row.quantity;
      return acc + profit;
    }, 0);
  }

  function addEntry() {
    if (!itemName || !costPrice || !sellingPrice || !quantity) return;

    const newRow = {
      itemName,
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      quantity: parseInt(quantity)
    };

    tableData = [...tableData, newRow];
    saveToLocalStorage();
    calculateProfitLoss();

    itemName = costPrice = sellingPrice = quantity = '';
  }

  function removeEntry(index: number) {
    tableData.splice(index, 1);
    tableData = [...tableData];
    saveToLocalStorage();
    calculateProfitLoss();
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
    loadFromLocalStorage();
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
  .stock-container {
    max-width: 960px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fafafa;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #263238;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  input {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-add,
  .btn-export {
    background: #00796b;
    color: #fff;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-export {
    background: #6a1b9a;
  }

  .btn-add:hover {
    background: #004d40;
  }

  .btn-export:hover {
    background: #4a148c;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    font-size: 0.95rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  th, td {
    padding: 0.8rem;
    text-align: center;
    border: 1px solid #eee;
  }

  th {
    background-color: #263238;
    color: #fff;
    font-weight: 500;
  }

  .btn-remove {
    background: #e53935;
    color: white;
    padding: 0.4rem 0.6rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-remove:hover {
    background: #c62828;
  }

  .profit {
    color: green;
    font-weight: bold;
  }

  .loss {
    color: red;
    font-weight: bold;
  }

  .summary {
    text-align: right;
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #263238;
  }

  @media (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      flex-direction: column;
      align-items: center;
    }

    .summary {
      text-align: center;
    }
  }
</style>
