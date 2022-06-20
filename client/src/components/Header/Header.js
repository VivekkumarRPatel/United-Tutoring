const Header = () => {
  return (
    /**
     * This code is refered from
     * https://getbootstrap.com/docs/4.0/getting-started/introduction/
     */
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#headermenu"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="headermenu">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Signup
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
