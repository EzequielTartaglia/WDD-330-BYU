document.getElementById('newsletterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // const email = document.getElementById('newsletterEmail').value;
    
    // Simulate a successful subscription
    document.getElementById('newsletterMsg').innerText = 'Thank you for subscribing!';
  });

  document.addEventListener('DOMContentLoaded', function() {
    if (!getCookie('visited')) {
      document.getElementById('welcomeBanner').style.display = 'block';
      setCookie('visited', 'yes', 30);
    }
  
    document.getElementById('registerButton').addEventListener('click', showRegistrationForm);
    document.getElementById('closeButton').addEventListener('click', closeRegistrationForm);
    document.getElementById('regForm').addEventListener('submit', handleFormSubmit);
  });
  
  function showRegistrationForm() {
    document.getElementById('welcomeBanner').classList.add('hidden');
    setTimeout(function() {
      document.getElementById('welcomeBanner').style.display = 'none';
      document.getElementById('registrationForm').style.display = 'block';
    }, 500);
  }
  
  function closeRegistrationForm() {
    document.getElementById('registrationForm').style.display = 'none';
  }
  
  function handleFormSubmit(event) {
    event.preventDefault();
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'block';
  }
  

  function setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  }



  function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }