/**
 * CHAVEE - Multi-Step Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('application-form');
  const steps = document.querySelectorAll('.form-step');
  const nodes = document.querySelectorAll('.progress-step-node');
  const progressFill = document.getElementById('progress-fill');
  
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  
  let currentStep = 0;
  const totalSteps = steps.length;
  
  // Dynamic Interest Tags Selector
  const tags = document.querySelectorAll('.interest-tag-pill');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
      
      // Accessibility states
      const isSelected = tag.classList.contains('selected');
      tag.setAttribute('aria-pressed', isSelected);
    });
  });

  // Check URL parameters for pre-selected event requesting
  parseUrlParameters();

  // Navigation: Next Step
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps - 1) {
          currentStep++;
          updateFormProgress();
        } else {
          // Final Submit
          submitApplicationForm();
        }
      }
    });
  }

  // Navigation: Previous Step
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateFormProgress();
      }
    });
  }

  // Floating label input keyboard listeners (removes invalid highlights on typing)
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
    });
  });

  /**
   * Updates multi-step form visibility and header progress nodes
   */
  function updateFormProgress() {
    // Update step containers
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });

    // Update progress node states
    nodes.forEach((node, idx) => {
      node.classList.toggle('active', idx === currentStep);
      node.classList.toggle('completed', idx < currentStep);
    });

    // Update connecting line percentage width
    const percentage = (currentStep / (totalSteps - 1)) * 100;
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }

    // Toggle Back button visibility
    if (btnPrev) {
      btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    }

    // Change Next button text on last step
    if (btnNext) {
      if (currentStep === totalSteps - 1) {
        btnNext.textContent = 'Submit Application';
        btnNext.classList.add('btn-gold');
      } else {
        btnNext.textContent = 'Continue';
        btnNext.classList.remove('btn-gold');
      }
    }
  }

  /**
   * Validation Engine for fields in each step
   */
  function validateStep(stepIndex) {
    let isValid = true;

    if (stepIndex === 0) {
      const name = document.getElementById('app-name');
      const email = document.getElementById('app-email');
      const phone = document.getElementById('app-phone');

      // Name check
      if (!name || name.value.trim().length < 3) {
        name.classList.add('invalid');
        isValid = false;
      }

      // Email check (Regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        email.classList.add('invalid');
        isValid = false;
      }

      // Phone check
      if (!phone || phone.value.trim().length < 7) {
        phone.classList.add('invalid');
        isValid = false;
      }
    }

    if (stepIndex === 1) {
      const statement = document.getElementById('app-statement');
      
      // Check statement text length
      if (!statement || statement.value.trim().length < 15) {
        statement.classList.add('invalid');
        isValid = false;
      }
    }

    if (stepIndex === 2) {
      const ndaCheck = document.getElementById('nda-agree');
      const customCheckbox = document.querySelector('.custom-checkbox');

      if (!ndaCheck || !ndaCheck.checked) {
        customCheckbox.style.borderColor = '#ff6b6b';
        isValid = false;
        
        // Flash border to alert
        setTimeout(() => {
          customCheckbox.style.borderColor = '';
        }, 1500);
      }
    }

    return isValid;
  }

  /**
   * Packages input fields, stores in localStorage, and routes to thankyou.html
   */
  function submitApplicationForm() {
    const name = document.getElementById('app-name').value.trim();
    const email = document.getElementById('app-email').value.trim();
    const phone = document.getElementById('app-phone').value.trim();
    const statement = document.getElementById('app-statement').value.trim();
    
    // Fetch active tag labels
    const selectedTagsList = [];
    document.querySelectorAll('.interest-tag-pill.selected').forEach(tag => {
      selectedTagsList.push(tag.textContent);
    });

    // Generate nominee card metadata
    const nomineeId = `CHV-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get selected event if any
    const selectedEventId = sessionStorage.getItem('applied_event_id') || 'Global Chapter Access';

    // Bundle
    const nomineeProfile = {
      id: nomineeId,
      name: name,
      email: email,
      phone: phone,
      statement: statement,
      interests: selectedTagsList,
      date: timestamp,
      eventRequested: selectedEventId
    };

    // Save profile to localStorage
    localStorage.setItem('chavee_nominee_profile', JSON.stringify(nomineeProfile));
    
    // Redirect smoothly
    window.location.href = 'thankyou.html';
  }

  /**
   * Parse query strings and pre-highlight matching interest channels
   */
  function parseUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventParam = urlParams.get('event');
    
    if (eventParam) {
      // Map event IDs to target pill tags
      let targetTagText = '';
      if (eventParam === 'evt-001' || eventParam === 'evt-005') {
        targetTagText = 'Culinary Craft';
        sessionStorage.setItem('applied_event_id', eventParam === 'evt-001' ? 'Secret Gastronomy Night' : 'Whisky Masterclass');
      } else if (eventParam === 'evt-002' || eventParam === 'evt-006') {
        targetTagText = 'Arts & Culture';
        sessionStorage.setItem('applied_event_id', eventParam === 'evt-002' ? 'Light & Space Vernissage' : 'Sound Resonance Bath');
      } else if (eventParam === 'evt-003') {
        targetTagText = 'Tech & Ideas';
        sessionStorage.setItem('applied_event_id', 'Sovereign VC Summit');
      } else if (eventParam === 'evt-004') {
        targetTagText = 'Galas & Soir\u00e9es';
        sessionStorage.setItem('applied_event_id', 'Midsummer Gala');
      }

      // Auto toggle the pill tag
      if (targetTagText) {
        document.querySelectorAll('.interest-tag-pill').forEach(tag => {
          if (tag.textContent === targetTagText) {
            tag.classList.add('selected');
            tag.setAttribute('aria-pressed', 'true');
          }
        });
      }
    } else {
      // Clear event caches
      sessionStorage.removeItem('applied_event_id');
    }
  }
});
