document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('#dollar_click').addEventListener('click', () => { loadPage('dollar'); });
  document.querySelector('#gold_click').addEventListener('click', () => { loadPage('gold'); });


  getHomeSubDate();

  updateTime();

  setInterval(updateTime, 1000);

  // Check if there's a stored page ID in the localStorage
  const storedPage = localStorage.getItem('currentPageLite');
  if (storedPage) {
    loadPage(storedPage); // Load the stored page
  } else {
    loadPage('dollar'); // Load the home page by default if no stored page
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
    const homeLink = document.getElementById('dollar_click');
    if (homeLink) {
      homeLink.classList.add('active');
      activeLinkId = 'dollar_click';
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
  localStorage.setItem('currentPageLite', pageId);
  switch (pageId) {
    case 'dollar':
      load_dollar();
      break;
    case 'gold':
      load_gold();
      break;
    default:
      console.error('Invalid page ID');
  }
}


function reload_part() {
  const loader = document.getElementById("reload")
  loader.innerHTML = `<i class='bx bx-loader-alt'></i>`
  loader.className = "reload-animation"
  getHomeSubDate();
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
    const storedPage = localStorage.getItem('currentPageLite');
    let nextPageId;
    if (storedPage === 'dollar' && direction === 'left') {
      nextPageId = 'gold'; // Swipe left from 'dollar' to 'gold'
    } else if (storedPage === 'gold'&& direction === 'right') {
      nextPageId = 'dollar'; // Swipe right from 'gold' to 'dollar'
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

function showIndicatorDescription() {
  var modal = document.getElementById('indicatorModal');
  modal.style.display = 'block';
  document.getElementById('indicatorDescription').innerHTML = `<h2>CaiorCoin Indicator</h2>
  <p>
      The CaiorCoin indicator reflects fluctuations in the Egyptian Pound for the current day, ranging from -10 to 10, based on a set of indicators. 
      Each indicator carries a weighted value. A negative value indicates an increase in the strength of the Egyptian Pound.
      As the negative value approaches -10, the pound's strength intensifies. Conversely, a positive value implies a decrease 
      in the pound's strength. As it approaches 10, its strength weakens, and its value depreciates further.
  </p>
  <p class="line ml-2" style="font-size: 12px;">
    Case <a class="line mx-1">[<i class='bx bx-infinite'></i>]</a> : market get into madness
  </p>`
}

function showIndicatorPlusDescription() {
  var modal = document.getElementById('indicatorModal');
  modal.style.display = 'block';
  document.getElementById('indicatorDescription').innerHTML = `<h2>Card instantaneous change indicator.</h2>
  <p>
    The card indicator represents the instantaneous change in value compared to the previous half-hour average.
  </p>
  <p class="line ml-2" style="font-size: 12px;">
    Case <a class="line mx-1">[<i class='bx bx-infinite'></i>]</a> : the rate is too big
  </p>`
}

// Function to close the modal
function closeIndicatorDescription() {
  var modal = document.getElementById('indicatorModal');
  modal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  var modal = document.getElementById('indicatorModal');
  if (event.target == modal) {
      modal.style.display = 'none';
  }
  var keyWindow = document.getElementById('keyWindow');
  if (event.target == keyWindow) {
      keyWindow.style.display = 'none';
  }
};
