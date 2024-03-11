var isSidebarVisible = false;
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('#home_click').addEventListener('click', () => { loadPage('home'); });
  document.querySelector('#keys_click').addEventListener('click', () => { loadPage('keys'); });
  document.querySelector('#usage_click').addEventListener('click', () => { loadPage('usage'); });
  document.querySelector('#plan_click').addEventListener('click', () => { loadPage('plan'); });
  document.querySelector('#docs_click').addEventListener('click', () => { loadPage('docs'); });

  getHomeSubDate();

  updateTime();

  setInterval(getHomeSubDate, 5 * 60 * 1000);

  setInterval(updateTime, 1000);

  // Check if there's a stored page ID in the localStorage
  const storedPage = localStorage.getItem('currentPage');
  if (storedPage && storedPage != '') {
    loadPage(storedPage); // Load the stored page
  } else {
    loadPage('home'); // Load the home page by default if no stored page
  }


  const showNavbar = (toggleId, navId, bodyId, headerId, barId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId),
      barpd = document.getElementById(barId)

    hide_body = document.getElementById('hide_body')
    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener('click', (event) => {
        // prevent body click event from firing
        event.stopPropagation();

        // show navbar
        nav.classList.toggle('show');
        // change icon
        toggle.classList.toggle('bx-x');
        // add padding to body
        bodypd.classList.toggle('body-pd');
        // hide body
        hide_body.classList.toggle('hide_body');
        // add padding to header
        headerpd.classList.toggle('top-nav-pd');
        // add padding to bar
        barpd.classList.toggle('bar-pd');
        isSidebarVisible = !isSidebarVisible;
      });

      document.addEventListener('click', (event) => {
        const clickedElement = event.target;
        // Check if the clicked element is inside the nav or not
        const isClickedInsideNav = nav.contains(clickedElement);
        if (!isClickedInsideNav && isSidebarVisible) {
          // hide navbar
          nav.classList.remove('show');
          // change icon
          toggle.classList.remove('bx-x');
          // remove padding from body
          bodypd.classList.remove('body-pd');
          // remove hide body
          hide_body.classList.remove('hide_body');
          // remove padding from header
          headerpd.classList.remove('top-nav-pd');
          // remove padding to bar
          barpd.classList.remove('bar-pd');
          isSidebarVisible = false;
        }
      });

      nav.addEventListener('mouseenter', () => {
        // Toggle visibility of the sidebar
        if (!isSidebarVisible) {
          // show navbar
          nav.classList.add('show');
          // change icon
          toggle.classList.add('bx-x');
          // add padding to body
          bodypd.classList.add('body-pd');
          // hide body
          hide_body.classList.add('hide_body');
          // add padding to header
          headerpd.classList.add('top-nav-pd');
          // add padding to bar
          barpd.classList.add('bar-pd');
        }
        // Update the visibility status
        isSidebarVisible = true;
      });
    }
  }

  showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header', 'bar');

  /*===== LINK ACTIVE =====*/
  // Get all the navigation links
  const linkColor = document.querySelectorAll('.nav_link');

  // Function to handle link click and switch active class
  function colorLink() {
    // Remove active class from all links
    linkColor.forEach(l => l.classList.remove('active'));

    // Add active class to the clicked link
    this.classList.add('active');

    // Store the ID of the clicked link in localStorage
    localStorage.setItem('activeLink', this.id);

    const toggle = document.getElementById('header-toggle'),
      nav = document.getElementById('nav-bar'),
      bodypd = document.getElementById('body-pd'),
      headerpd = document.getElementById('header'),
      barpd = document.getElementById('bar')
    hide_body = document.getElementById('hide_body')

    // hide navbar
    nav.classList.remove('show');
    // change icon
    toggle.classList.remove('bx-x');
    // remove padding from body
    bodypd.classList.remove('body-pd');
    // remove hide body
    hide_body.classList.remove('hide_body');
    // remove padding from header
    headerpd.classList.remove('top-nav-pd');
    // remove padding to bar
    barpd.classList.remove('bar-pd');
    isSidebarVisible = false;
  }

  // Add event listener to each navigation link
  linkColor.forEach(l => l.addEventListener('click', colorLink));

  // Check if there's a stored active link in localStorage
  let activeLinkId = localStorage.getItem('activeLink');
  if (!activeLinkId) {
    // If no active link is stored, default to the "Home" link
    const homeLink = document.getElementById('home_click');
    if (homeLink) {
      homeLink.classList.add('active');
      activeLinkId = 'home_click';
    }
  }

  // Add active class to the stored active link
  const activeLink = document.getElementById(activeLinkId);
  if (activeLink) {
    activeLink.classList.add('active');
  }

});


function loadPage(pageId) {
  // Store the current page ID in the localStorage
  localStorage.setItem('currentPage', pageId);
  switch (pageId) {
    case 'home':
      load_home();
      break;
    case 'keys':
      load_keys();
      break;
    case 'usage':
      load_usage();
      break;
    case 'plan':
      load_plan();
      break;
    case 'docs':
      load_docs();
      break;
    default:
      load_home();
  }
}

// Function to handle logout
function handleLogout() {
  // Remove stored data from localStorage
  localStorage.removeItem('currentPage');
  localStorage.removeItem('activeLink');
}

