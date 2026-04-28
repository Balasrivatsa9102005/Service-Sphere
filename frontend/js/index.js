// script.js - Clean & Working Version

document.addEventListener('DOMContentLoaded', function () {

    // ===== LOCATION ACCESS FUNCTION =====
    function getUserLocation() {
        console.log("Requesting location...");

        if (!navigator.geolocation) {
            showLocationMessage("📍 Your browser doesn't support location detection.", true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log("Location success:", position);

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Reverse geocoding
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                    .then(res => res.json())
                    .then(data => {
                        const city = data.city || data.locality || "your area";
                        showLocationMessage(`📍 You are from <strong>${city}</strong>! Showing services near you.`);
                    })
                    .catch(() => {
                        showLocationMessage("📍 Showing services near your location.");
                    });
            },
            function (error) {
                console.log("Location error:", error);

                let message = "📍 Unable to detect location.";
                if (error.code === error.PERMISSION_DENIED) {
                    message = "📍 Location access denied.";
                }

                showLocationMessage(message + " Showing general services.", true);
            }
        );
    }

    // ===== FLASH MESSAGE =====
    function showLocationMessage(message, isError = false) {
        const existing = document.querySelector('.location-flash');
        if (existing) existing.remove();

        const flash = document.createElement('div');
        flash.className = 'location-flash';
        flash.innerHTML = `
            <span>${message}</span>
            <button class="flash-close">&times;</button>
        `;

        document.body.appendChild(flash);

        flash.querySelector('.flash-close').onclick = () => flash.remove();

        setTimeout(() => flash.remove(), 5000);
    }

    // ===== 🔥 CALL LOCATION (IMPORTANT LINE) =====
    // This guarantees popup
    setTimeout(() => {
        getUserLocation();
    }, 800);


    // ===== SEARCH FUNCTION =====
    const searchInputs = document.querySelectorAll('.looking-search input, .search-container input');
    const searchButtons = document.querySelectorAll('.looking-search button, .search-container button');

    function performSearch() {
        let searchTerm = '';

        searchInputs.forEach(input => {
            if (input.value.trim()) {
                searchTerm = input.value.trim();
            }
        });

        if (searchTerm) {
            alert(`🔍 Searching for: "${searchTerm}"\n\nShowing results near your location.`);
        } else {
            alert('Please enter a service (e.g., electrician, doctor, plumber)');
        }
    }

    searchButtons.forEach(btn => btn.addEventListener('click', performSearch));
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    });


    // ===== CONTACT FORM =====
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = this.querySelector('input[placeholder="Your Name"]')?.value;
            const email = this.querySelector('input[placeholder="Your Email"]')?.value;
            const message = this.querySelector('textarea')?.value;

            if (name && email && message) {
                alert(`✅ Thank you ${name}! Message sent successfully.`);
                this.reset();
            } else {
                alert('⚠️ Please fill all fields.');
            }
        });
    }


    // ===== ACTIVE NAV LINK =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPage);
    });


    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});