<script lang="ts">
  import { onMount } from 'svelte';

  type Stock = {
    name: string;
    cost: number;
    price: number;
    quantity: number;
  };

  let stocks: Stock[] = [];

  // Load from localStorage on mount
  onMount(() => {
    const saved = localStorage.getItem("stocks");
    if (saved) {
      stocks = JSON.parse(saved);
    } else {
      stocks = [
        { name: "Item A", cost: 10, price: 15, quantity: 100 },
        { name: "Item B", cost: 5, price: 8, quantity: 200 }
      ];
    }
  });

  function saveToLocalStorage() {
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }

  function addRow() {
    stocks = [...stocks, { name: "", cost: 0, price: 0, quantity: 0 }];
    saveToLocalStorage();
  }

  function deleteRow(index: number) {
    stocks.splice(index, 1);
    stocks = [...stocks]; // trigger reactivity
    saveToLocalStorage();
  }

  function calculateProfit(stock: Stock) {
    return (stock.price - stock.cost) * stock.quantity;
  }

  function updateStock() {
    saveToLocalStorage();
  }
</script>

<!-- Materialize CSS CDN -->
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
  rel="stylesheet"
/>

<h4 class="center-align">Stock Entry</h4>

<div class="container">
  <table class="striped highlight responsive-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Cost</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Profit</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each stocks as stock, i}
        <tr>
          <td>
            <input bind:value={stock.name} type="text" class="input-field" on:change={updateStock} />
          </td>
          <td>
            <input type="number" bind:value={stock.cost} class="input-field" on:change={updateStock} />
          </td>
          <td>
            <input type="number" bind:value={stock.price} class="input-field" on:change={updateStock} />
          </td>
          <td>
            <input type="number" bind:value={stock.quantity} class="input-field" on:change={updateStock} />
          </td>
          <td>{calculateProfit(stock)}</td>
          <td>
            <button class="btn red lighten-1" on:click={() => deleteRow(i)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="center-align" style="margin-top: 20px;">
    <button class="btn waves-effect waves-light" on:click={addRow}>
      Add Row
    </button>
  </div>
</div>
