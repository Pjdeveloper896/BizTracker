<script lang="ts">
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let map: any;
  let shopName = "";
  let L: any;
  let userMarker: any;
  let shopMarker: any;

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

  async function locateStore() {
    if (!shopName.trim()) {
      alert("Please enter a shop name.");
      return;
    }

    // Use Nominatim API for location search
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(shopName)}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];

      if (shopMarker) {
        map.removeLayer(shopMarker);
      }

      shopMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(display_name)
        .openPopup();
      map.setView([lat, lon], 16);
    } else {
      alert("No results found for that shop name.");
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
