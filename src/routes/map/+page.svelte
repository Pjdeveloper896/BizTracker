<script lang="ts">
  import { onMount } from 'svelte';
  let map: any;
  let shopName = "";
  let L: any;

  const shops: Record<string, [number, number]> = {
    "my shop": [28.6239, 77.2090],
    "another shop": [28.61, 77.22],
    "coffee corner": [28.625, 77.21]
  };

  onMount(async () => {
    const leaflet = await import('leaflet');
    L = leaflet.default;

    map = L.map('map').setView([28.6239, 77.2090], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  });

  function locateStore() {
    const coords = shops[shopName.toLowerCase()];
    if (coords) {
      map.setView(coords, 16);
      L.marker(coords).addTo(map).bindPopup(shopName).openPopup();
    } else {
      alert("Shop not found. Try 'my shop' or 'another shop'.");
    }
  }
</script>

<div class="container">
  <input type="text" bind:value={shopName} placeholder="Enter shop name" class="input-field" />
  <button class="btn" on:click={locateStore}>Locate Shop</button>
  <div id="map" style="height: 400px; margin-top: 20px;"></div>
</div>
