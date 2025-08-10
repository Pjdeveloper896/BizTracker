<script lang="ts">
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let map: any;
  let shopName = "";
  let L: any;
  let userMarker: any;
  let shopMarker: any;

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

    // Show user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        userMarker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
        map.setView([latitude, longitude], 14);
      });
    }
  });

  function locateStore() {
    const searchKey = shopName.trim().toLowerCase();
    const coords = shops[searchKey];
    if (coords) {
      if (shopMarker) {
        map.removeLayer(shopMarker);
      }
      shopMarker = L.marker(coords)
        .addTo(map)
        .bindPopup(shopName)
        .openPopup();
      map.setView(coords, 16);
    } else {
      alert("Shop not found. Try: " + Object.keys(shops).join(", "));
    }
  }
</script>

<div class="container" style="max-width: 500px; margin: auto;">
  <input
    type="text"
    bind:value={shopName}
    placeholder="Enter shop name"
    class="input-field"
    style="width: 100%; padding: 8px; margin-top: 10px;"
  />
  <button
    class="btn"
    style="margin-top: 10px; padding: 8px 12px; width: 100%;"
    on:click={locateStore}
  >
    Locate Shop
  </button>
  <div id="map" style="height: 400px; margin-top: 20px; border: 1px solid #ccc;"></div>
</div>
