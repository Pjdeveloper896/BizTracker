<script lang="ts">
  import { onMount, tick } from "svelte";
  import { browser } from "$app/environment";

  let tableData: any[] = [];
  let itemName = "";
  let costPrice = "";
  let sellingPrice = "";
  let quantity = "";
  let profitLoss = 0;

  let statusMessage: string = "";
  let statusType: "success" | "error" | "" = "";

  const API_BASE = "https://biz-suit-api.onrender.com/api";
  const API_KEY = "dev-key-localhost"; // Replace with real API key

  function setStatus(message: string, type: "success" | "error" = "success") {
    statusMessage = message;
    statusType = type;
    setTimeout(() => {
      statusMessage = "";
      statusType = "";
    }, 4000);
  }

  function calculateProfitLoss() {
    profitLoss = tableData.reduce(
      (acc, row) => acc + (row.sellingPrice - row.costPrice) * row.quantity,
      0
    );
  }

  async function loadFromAPI() {
    try {
      const res = await fetch(`${API_BASE}/stock`, {
        headers: { "x-api-key": API_KEY },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      tableData = data.map((item) => ({
        ...item,
        costPrice: Number(item.costPrice) || 0,
        sellingPrice: Number(item.sellingPrice) || 0,
        quantity: Number(item.quantity) || 0,
        id: item._id || item.id,
      }));
      calculateProfitLoss();
      saveToLocalStorage();
      await tick();
      setStatus("✅ Stock loaded successfully", "success");
    } catch (err) {
      console.error("❌ Failed to fetch stock from API", err);
      loadFromLocalStorage();
      await tick();
      if (tableData.length) {
        setStatus("⚠️ Loaded offline data", "error");
      } else {
        setStatus("⚠️ No offline data available", "error");
      }
    }
  }

  async function addEntry() {
    if (!itemName || !costPrice || !sellingPrice || !quantity) {
      setStatus("⚠️ Please fill all fields", "error");
      return;
    }

    const newRow = {
      itemName,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
    };

    try {
      const res = await fetch(`${API_BASE}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(newRow),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadFromAPI();
      itemName = costPrice = sellingPrice = quantity = "";
      setStatus("✅ Item added successfully", "success");
    } catch (err) {
      console.error("❌ Error adding entry:", err);
      setStatus("❌ Failed to add item", "error");
    }
  }

  async function removeEntry(index: number) {
    const item = tableData[index];
    if (!item || !item.id) return;

    try {
      const res = await fetch(`${API_BASE}/stock/${item.id}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadFromAPI();
      setStatus("🗑️ Item removed", "success");
    } catch (err) {
      console.error("❌ Error removing entry:", err);
      setStatus("❌ Failed to remove item", "error");
    }
  }

  function saveToLocalStorage() {
    if (browser) {
      localStorage.setItem("stockTable", JSON.stringify(tableData));
    }
  }

  function loadFromLocalStorage() {
    if (browser) {
      const saved = localStorage.getItem("stockTable");
      if (saved) {
        tableData = JSON.parse(saved);
        calculateProfitLoss();
      }
    }
  }

  function exportCSV() {
    if (!tableData.length) return;
    const headers = [
      "Item Name",
      "Cost Price",
      "Selling Price",
      "Quantity",
      "Profit/Loss",
    ];
    const rows = tableData.map((row) => [
      row.itemName,
      row.costPrice,
      row.sellingPrice,
      row.quantity,
      (row.sellingPrice - row.costPrice) * row.quantity,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "stock_data.csv");
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus("📤 CSV Exported", "success");
  }

  onMount(() => {
    loadFromAPI();
  });
</script>

<!-- HEADER -->
<div class="min-h-screen bg-gray-100 flex flex-col">
  <header class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 shadow-md flex justify-between items-center">
    <h2 class="text-xl font-bold tracking-wide">📦 Stock Manager</h2>
    <div
      class={`font-semibold px-4 py-2 rounded-full shadow ${
        profitLoss >= 0
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      Total: ₹{profitLoss.toFixed(2)}
    </div>
  </header>

  <!-- STATUS MESSAGE -->
  {#if statusMessage}
    <div
      class={`mx-4 mt-4 p-3 rounded-lg shadow text-sm font-medium ${
        statusType === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {statusMessage}
    </div>
  {/if}

  <!-- FORM -->
  <section class="bg-white shadow-md p-5 grid gap-4 sm:grid-cols-5 rounded-lg mt-5 mx-4">
    <input type="text" placeholder="Item Name" bind:value={itemName}
      class="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-300" />
    <input type="number" placeholder="Cost Price" bind:value={costPrice}
      class="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-300" />
    <input type="number" placeholder="Selling Price" bind:value={sellingPrice}
      class="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-300" />
    <input type="number" placeholder="Quantity" bind:value={quantity}
      class="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-300"
      on:keydown={(e: KeyboardEvent) => e.key === "Enter" && addEntry()} />
    <button class="bg-indigo-600 text-white rounded-lg p-3 font-semibold hover:bg-indigo-700 transition"
      on:click={addEntry}>
      ➕ Add
    </button>
  </section>

  <!-- EXPORT BUTTON -->
  <div class="flex justify-end p-4 bg-gray-50">
    <button class="bg-green-500 text-white px-5 py-2 rounded-lg shadow font-medium hover:bg-green-600 transition"
      on:click={exportCSV}>
      📤 Export CSV
    </button>
  </div>

  <!-- MAIN -->
  <main class="p-4 flex-1 space-y-6">
    {#if tableData.length === 0}
      <p class="text-center text-gray-500 mt-10 text-lg">
        No stock items yet. Add some above!
      </p>
    {:else}
      <div class="overflow-x-auto rounded-lg shadow bg-white">
        <table class="min-w-full border-collapse">
          <thead class="bg-indigo-100">
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
                <td class={`p-3 font-semibold ${
                    (row.sellingPrice - row.costPrice) * row.quantity >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  ₹{((row.sellingPrice - row.costPrice) * row.quantity).toFixed(2)}
                </td>
                <td class="p-3">
                  <button class="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                    on:click={() => removeEntry(i)}>
                    🗑 Delete
                  </button>
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
