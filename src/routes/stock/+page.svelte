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

<style>
  .container {
    max-width: 100%;
    padding: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    font-size: 0.95rem;
    background-color: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 0.6rem;
    text-align: center;
  }

  th {
    background: #263238;
    color: #fff;
  }

  input, button {
    padding: 0.5rem;
    margin: 0.3rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    cursor: pointer;
    background: #26a69a;
    color: white;
    border: none;
    transition: background 0.2s;
  }

  button:hover {
    background: #00796b;
  }

  .remove-btn {
    background: #e53935;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }

  .profit {
    margin-top: 1rem;
    font-weight: bold;
    color: green;
  }

  .loss {
    color: red;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  @media screen and (max-width: 600px) {
    table {
      font-size: 0.8rem;
    }

    input {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .action-buttons {
      flex-direction: column;
    }
  }
</style>

<div class="container">
  <h2>📦 Stock Entry</h2>

  <input placeholder="Item Name" bind:value={itemName} />
  <input type="number" placeholder="Cost Price" bind:value={costPrice} />
  <input type="number" placeholder="Selling Price" bind:value={sellingPrice} />
  <input type="number" placeholder="Quantity" bind:value={quantity} />

  <div class="action-buttons">
    <button on:click={addEntry}>➕ Add</button>
    <button on:click={exportCSV}>📤 Export CSV</button>
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
          <td><button class="remove-btn" on:click={() => removeEntry(i)}>✕</button></td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="profit">
    Total Profit/Loss: 
    <span class="{profitLoss < 0 ? 'loss' : 'profit'}">₹{profitLoss}</span>
  </div>
</div>
