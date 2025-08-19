<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let tableData: {
    itemName: string;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    profitLoss: number;
  }[] = [];

  let itemName = "";
  let costPrice: number | null = null;
  let sellingPrice: number | null = null;
  let quantity: number | null = null;

  function addItem() {
    if (!itemName || costPrice === null || sellingPrice === null || quantity === null) {
      return;
    }

    let profitLoss = (sellingPrice - costPrice) * quantity;

    tableData = [
      ...tableData,
      { itemName, costPrice, sellingPrice, quantity, profitLoss },
    ];

    itemName = "";
    costPrice = null;
    sellingPrice = null;
    quantity = null;
  }

  function deleteItem(index: number) {
    tableData = tableData.filter((_, i) => i !== index);
  }
</script>

<!-- Materialize CSS CDN -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
/>


<div class="container">
  <h3 class="center-align">📊 BizKhata Inventory</h3>

  <!-- Input Form -->
  <div class="card">
    <div class="card-content">
      <span class="card-title">➕ Add New Item</span>
      <div class="row">
        <div class="input-field col s6">
          <input type="text" bind:value={itemName} placeholder="Item Name" />
          <label class="active">Item Name</label>
        </div>
        <div class="input-field col s6">
          <input type="number" bind:value={costPrice} placeholder="Cost Price" />
          <label class="active">Cost Price</label>
        </div>
        <div class="input-field col s6">
          <input type="number" bind:value={sellingPrice} placeholder="Selling Price" />
          <label class="active">Selling Price</label>
        </div>
        <div class="input-field col s6">
          <input type="number" bind:value={quantity} placeholder="Quantity" />
          <label class="active">Quantity</label>
        </div>
      </div>
      <div class="center">
        <button on:click={addItem} class="btn waves-effect waves-light green">
          Add Item
        </button>
      </div>
    </div>
  </div>

  <!-- Items Table -->
  {#if tableData.length > 0}
    <table class="highlight centered responsive-table z-depth-2">
      <thead class="blue lighten-2 white-text">
        <tr>
          <th>Item</th>
          <th>Cost Price</th>
          <th>Selling Price</th>
          <th>Quantity</th>
          <th>Profit / Loss</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#each tableData as item, index}
          <tr>
            <td>{item.itemName}</td>
            <td>₹{item.costPrice}</td>
            <td>₹{item.sellingPrice}</td>
            <td>{item.quantity}</td>
            <td class={item.profitLoss >= 0 ? "green-text" : "red-text"}>
              ₹{item.profitLoss}
            </td>
            <td>
              <button
                on:click={() => deleteItem(index)}
                class="btn-small red waves-effect waves-light"
              >
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p class="center grey-text">No items added yet.</p>
  {/if}
</div>
