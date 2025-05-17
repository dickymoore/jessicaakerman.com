// js/navigation.js
document.addEventListener('DOMContentLoaded', () => {
  // Add click event for mobile dropdown toggles
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  
  // Add the has-dropdown class to nav items with children
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.querySelector('.dropdown-menu') || item.querySelector('ul')) {
      item.classList.add('has-dropdown');
    }
  });
  
  // Handle mobile clicks on dropdown items
  document.querySelectorAll('.has-dropdown').forEach(item => {
    item.addEventListener('click', function(e) {
      // Only handle dropdown behavior on mobile
      if (window.innerWidth <= 768) {
        // Check if the click is on the parent link
        const link = this.querySelector('a');
        if (e.target === link || link.contains(e.target)) {
          e.preventDefault();
          
          // Find the dropdown menu
          const dropdown = this.querySelector('.dropdown-menu') || this.querySelector('ul');
          
          if (dropdown) {
            // Toggle display
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            
            // Toggle an active class for styling
            this.classList.toggle('dropdown-active');
          }
        }
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      const isDropdownClick = e.target.closest('.has-dropdown');
      if (!isDropdownClick) {
        document.querySelectorAll('.has-dropdown .dropdown-menu, .has-dropdown ul').forEach(menu => {
          menu.style.display = 'none';
        });
        document.querySelectorAll('.dropdown-active').forEach(item => {
          item.classList.remove('dropdown-active');
        });
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      // Reset all dropdown menus on larger screens
      document.querySelectorAll('.dropdown-menu, .has-dropdown ul').forEach(menu => {
        menu.style.display = '';
      });
    }
  });
});