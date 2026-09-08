import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'
console.log('=== MAIN.JS LOADED ===');

document.addEventListener('DOMContentLoaded', function() {
    const section = document.querySelector('.scroll-section');
    const items = document.querySelectorAll('.scroll-item');
    const totalItems = items.length;
    
    // Remove the mobile check - let it work on all devices
    let currentIndex = 0;
    
    function updateItems() {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Check if section is in view
      if (sectionTop <= 0 && sectionTop > -sectionHeight + viewportHeight) {
        // Calculate progress through section (0 to 1)
        const progress = Math.abs(sectionTop) / (sectionHeight - viewportHeight);
        
        // Determine which item should be active
        const newIndex = Math.min(
          Math.floor(progress * totalItems),
          totalItems - 1
        );
        
        // Update if index changed
        if (newIndex !== currentIndex) {
          // Remove classes from all items
          items.forEach(item => {
            item.classList.remove('active', 'previous');
          });
          
          // Add classes
          if (currentIndex < newIndex) {
            // Scrolling down
            items[currentIndex].classList.add('previous');
          }
          items[newIndex].classList.add('active');
          
          currentIndex = newIndex;
        }
      } else if (sectionTop > 0) {
        // Before section is reached, show first item
        items.forEach(item => item.classList.remove('active', 'previous'));
        items[0].classList.add('active');
        currentIndex = 0;
      }
    }
    
    // Initial check
    updateItems();
    
    // Update on scroll
    window.addEventListener('scroll', updateItems);
  });
  
  
  
  document.addEventListener('DOMContentLoaded', () => {
    // Select ALL forms with the class
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get elements within THIS specific form
        const emailInput = form.querySelector('.email-input');
        const email = emailInput.value.trim();
        const button = form.querySelector('button');
        const message = form.querySelector('.form-message');
        
        if (!email) {
          message.textContent = 'Please enter your email';
          message.style.color = '#ef4444';
          message.style.display = 'block';
          return;
        }
        
        button.textContent = 'Subscribing...';
        button.disabled = true;
        message.style.display = 'none';
        
        try {
          const response = await fetch('https://api.snappipay.xyz/api/mailing-list/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            message.textContent = data.message || '✅ Successfully subscribed!';
            message.style.color = '#10b981';
            message.style.display = 'block';
            emailInput.value = '';
            
            setTimeout(() => {
              message.style.display = 'none';
            }, 5000);
            
          } else {
            message.textContent = data.message || '❌ Subscription failed. Please try again.';
            message.style.color = '#ef4444';
            message.style.display = 'block';
            
            setTimeout(() => {
              message.style.display = 'none';
            }, 5000);
          }
          
        } catch (error) {
          console.error('Error:', error);
          message.textContent = '❌ Something went wrong. Please try again.';
          message.style.color = '#ef4444';
          message.style.display = 'block';
          
          setTimeout(() => {
            message.style.display = 'none';
          }, 5000);
        } finally {
          button.textContent = 'Join our waitlist';
          button.disabled = false;
        }
      });
    });
  });
  