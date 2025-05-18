// navigation.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - navigation.js running');
  
  // Handle mobile menu toggle
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.nav');
  
  if (mobileNavToggle && nav) {
    console.log('Menu elements found');
    
    mobileNavToggle.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Toggle clicked');
      
      // Toggle the show class on the navigation
      nav.classList.toggle('show');
      
      // Update the aria-expanded attribute for accessibility
      const expanded = nav.classList.contains('show');
      mobileNavToggle.setAttribute('aria-expanded', expanded);
      
      console.log('Menu toggle clicked, nav show state:', expanded);
    });
  } else {
    console.log('Menu elements not found', { mobileNavToggle, nav });
  }
  
  // Mobile dropdown toggle
  const dropdownItems = document.querySelectorAll('.has-dropdown');
  console.log('Found dropdown items:', dropdownItems.length);
  
  dropdownItems.forEach(item => {
    const link = item.querySelector('a');
    
    if (link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          // Only for mobile view
          e.preventDefault();
          
          // Find the dropdown menu
          const dropdown = item.querySelector('.dropdown-menu');
          console.log('Dropdown item clicked', dropdown);
          
          if (dropdown) {
            // Close all other dropdowns first
            document.querySelectorAll('.has-dropdown .dropdown-menu').forEach(menu => {
              if (menu !== dropdown) {
                menu.style.display = 'none';
              }
            });
            
            // Toggle this dropdown
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            
            // Toggle active class
            item.classList.toggle('dropdown-active');
          }
        }
      });
    }
  });
  
  // Handle clicks outside the navigation
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      // If clicking outside nav and not on the toggle button
      if (!e.target.closest('.nav') && !e.target.closest('.mobile-nav-toggle')) {
        // Hide all dropdown menus
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
        
        // Remove active class from all items
        document.querySelectorAll('.dropdown-active').forEach(item => {
          item.classList.remove('dropdown-active');
        });
      }
    }
  });
  
  // Reset styles on resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Reset all dropdown menus
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = '';
      });
      
      // Reset active classes
      document.querySelectorAll('.dropdown-active').forEach(item => {
        item.classList.remove('dropdown-active');
      });
    }
  });
});