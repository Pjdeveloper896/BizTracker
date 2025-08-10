<script lang="ts">
  import { onMount } from 'svelte';

  let stock = [];
  let itemName = '';
  let costPrice = '';
  let sellingPrice = '';
  let quantity = '';
  let profitLoss = 0;

  const API = 'https://biz-suit-api.onrender.com/api/stock';

  function calcProfitLoss() {
    profitLoss = stock.reduce((acc, row) => acc + (row.sellingPrice - row.costPrice) * row.quantity, 0);
  }

  async function fetchStock() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      stock = await res.json();
      calcProfitLoss();
    } catch (err) {
      console.error('❌ Failed to load stock', err);
    }
  }

  async function addItem() {
    if (!itemName || !costPrice || !sellingPrice || !quantity) return;
    try {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName,
          costPrice: +costPrice,
          sellingPrice: +sellingPrice,
          quantity: +quantity
        })
      });
      itemName = costPrice = sellingPrice = quantity = '';
      await fetchStock();
    } catch (err) {
      console.error('❌ Error adding item', err);
    }
  }

  async function deleteItem(id: string) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      await fetchStock();
    } catch (err) {
      console.error('❌ Error deleting item', err);
    }
  }

  onMount(fetchStock);
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
  <!-- Header -->
  <header class="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-10 flex justify-between items-center">
    <h1 class="text-xl font-bold">📦 Biz Stock</h1>
    <span class="bg-white text-blue-600 px-3 py-1 rounded-full font-semibold">
      Total: ₹{profitLoss}
    </span>
  </header>

  <!-- Add Item Form -->
  <section class="bg-white shadow-md p-4 grid gap-2 sm:grid-cols-5 sticky top-[64px] z-10">
    <input class="border p-2 rounded" placeholder="Item" bind:value={itemName} />
    <input type="number" class="border p-2 rounded" placeholder="Cost" bind:value={costPrice} />
    <input type="number" class="border p-2 rounded" placeholder="Sell" bind:value={sellingPrice} />
    <input type="number" class="border p-2 rounded" placeholder="Qty" bind:value={quantity} />
    <button on:click={addItem} class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">Add</button>
  </section>

  <!-- Stock List -->
  <main class="flex-1 p-4">
    {#if stock.length > 0}
      <div class="grid gap-4">
        {#each stock as row}
          <div class="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <h2 class="font-bold">{row.itemName}</h2>
              <p class="text-sm text-gray-500">
                Cost: ₹{row.costPrice} | Sell: ₹{row.sellingPrice} | Qty: {row.quantity}
              </p>
              <p class="{(row.sellingPrice - row.costPrice) * row.quantity >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold">
                ₹{(row.sellingPrice - row.costPrice) * row.quantity}
              </p>
            </div>
            <button on:click={() => deleteItem(row.id)} class="text-red-500 hover:underline">Delete</button>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-center text-gray-500">No stock items yet.</p>
    {/if}
  </main>
</div>

<style>
  /* Mobile smooth scrolling feel */
  :global(html) {
    scroll-behavior: smooth;
    font-family: system-ui, sans-serif;
  }
</style>
