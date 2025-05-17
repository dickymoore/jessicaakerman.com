// Mobile navigation dropdown toggles
document.addEventListener('DOMContentLoaded', () => {
    // Add click event for mobile dropdown toggles
    const dropdownParents = document.querySelectorAll('.has-dropdown');
    
    dropdownParents.forEach(item => {
      item.addEventListener('click', function(e) {
        // Only handle dropdown behavior on mobile
        if (window.innerWidth <= 768) {
          // Check if the click is on the parent link
          if (e.target === this.querySelector('a')) {
            e.preventDefault();
            const dropdown = this.querySelector('.dropdown-menu');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
          }
        }
      });
    });
  });