document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('#home_click').addEventListener('click', () => { loadPage('home'); });
  document.querySelector('#keys_click').addEventListener('click', () => { loadPage('keys'); });
  document.querySelector('#usage_click').addEventListener('click', () => { loadPage('usage'); });
  document.querySelector('#plan_click').addEventListener('click', () => { loadPage('plan'); });
  document.querySelector('#docs_click').addEventListener('click', () => { loadPage('docs'); });
  document.querySelector('#account_click').addEventListener('click', () => { loadPage('account'); });

  getHomeSubDate();

  updateTime();

  setInterval(updateTime, 1000);

  // Check if there's a stored page ID in the localStorage
  const storedPage = localStorage.getItem('currentPage');
  if (storedPage) {
    loadPage(storedPage); // Load the stored page
  } else {
    loadPage('home'); // Load the home page by default if no stored page
  }


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
    case 'account':
      load_account();
      break;
    default:
      console.error(pageId);
  }
}

// Function to handle logout
function handleLogout() {
  // Remove stored data from localStorage
  localStorage.removeItem('currentPage');
  localStorage.removeItem('activeLink');
}

function reload_part() {
  const loader = document.getElementById("reload")
  loader.innerHTML = `<i class='bx bx-loader-alt'></i>`
  loader.className = "reload-animation"
  const storedPage = localStorage.getItem('currentPage');
  loadPage(storedPage);
}

function endReload() {
  const loader = document.getElementById("reload")
  loader.innerHTML = `<i class='bx bx-sync'></i>`
  loader.className = ""
}

function load_account() {
  const elements = ['#home', '#keys', '#usage', '#plan', '#docs', '#account', '#reload'];
  elements.forEach(element => {
    document.querySelector(element).style.display = element === '#account' ? 'block' : 'none';
  });

  document.querySelector('#header_data').style.display = 'flex';
}

const swipeThreshold = 100; // Adjust this value as needed
let startX = 0;
let isSwiping = false;
let isNavigationHandled = false;

const handlePageNavigation = (direction) => {
  if (!isNavigationHandled) {
    const storedPage = localStorage.getItem('currentPage');
    let nextPageId;
    switch (storedPage) {
      case 'home':
        nextPageId = (direction === 'left') ? 'keys' : null;
        break;
      case 'keys':
        nextPageId = (direction === 'left') ? 'usage' : 'home';
        break;
      case 'usage':
        nextPageId = (direction === 'left') ? 'plan' : 'keys';
        break;
      case 'plan':
        nextPageId = (direction === 'left') ? 'docs' : 'usage';
        break;
      case 'docs':
        nextPageId = (direction === 'left') ? 'account' : 'plan';
        break;
      case 'account':
        nextPageId = (direction === 'left') ? null : 'docs';
        break;
      default:
        nextPageId = null;
    }

    if (nextPageId) {
      loadPage(nextPageId); // Load the next page
      updateActiveLink(nextPageId); // Update active link
      isNavigationHandled = true; // Set the flag to true after navigation
    }
  }
};

const handleTouchStart = (event) => {
  startX = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
  if (!isSwiping) {
    const diffX = event.touches[0].clientX - startX;

    if (Math.abs(diffX) > swipeThreshold) {
      isSwiping = true; // Set flag to indicate swiping
      startX = 0;
      if (diffX > 0) {
        // Right swipe
        handlePageNavigation('right');
      } else {
        // Left swipe
        handlePageNavigation('left');
      }
      isNavigationHandled = false; // Reset the flag after navigation
    }
  }
};

const handleTouchEnd = () => {
  isSwiping = false; // Reset swiping flag on touch end
};

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

const updateActiveLink = (pageId) => {
  // Remove active class from all links
  const linkColor = document.querySelectorAll('.nav_link');
  linkColor.forEach(l => l.classList.remove('active'));

  // Add active class to the clicked link
  const activeLink = document.getElementById(`${pageId}_click`);
  if (activeLink) {
    activeLink.classList.add('active');

    // Store the ID of the clicked link in localStorage
    localStorage.setItem('activeLink', activeLink.id);
  }
};
