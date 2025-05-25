<!-- src/lib/components/Footer.svelte -->
<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="page-footer grey darken-3">
  <div class="container">
    <div class="row">
      <div class="col l6 s12">
        <h5 class="white-text">BizTrack</h5>
        <p class="grey-text text-lighten-4">
          Your simple and efficient stock management tool.
        </p>
      </div>
      <div class="col l4 offset-l2 s12">
        <h5 class="white-text">Links</h5>
        <ul>
          <li><a class="grey-text text-lighten-3" href="/stock">Stocks</a></li>
          <li><a class="grey-text text-lighten-3" href="/map">Shop Map</a></li>
          <li><a class="grey-text text-lighten-3" href="https://github.com/Pjdeveloper896">GitHub</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-copyright">
    <div class="container">
      &copy; {currentYear} BizTrack | Made with Svelte
    </div>
  </div>
</footer>
