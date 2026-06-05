            // ---------- GHANA HOSTELS DATA with official booking URLs ----------
            const hostelsData = [
                {
                    id: 1,
                    name: "Unidaz Hostel",
                     image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=400",
                    location: "Ghana Communication Technology University, Tesano - Accra",
                    price:  2400,
                    priceLabel: "GHS 2,400/sem",
                    amenities: ["WiFi", "Study Area", "Security", "Water Supply", "AC rooms"],
                    area: "accra",
                    availability: "available",
                    officialUrl: "https://www.unidaz.com",
                    icon: "fa-university",
                    category: "budget",
                    nearby: true
                    
                },
                {
                    id: 2,
                    name: "Palace Hostel",
                    image: "https://images.unsplash.com/photo-1608198399988-341f712c3711?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D",
                    location: "Ghana Communication Technology University, Tesano  - Accra",
                    price: 2500,
                    priceLabel: "GHS 2,500/sem",
                    amenities: ["WiFi", "Study Area", "Security", "Water Supply"],
                    area: "accra",
                    availability: "limited",
                    officialUrl: "https://www.palacehostel.com",
                    icon: "fa-university",
                    category: "budget",
                    nearby: true 
                    
                },
                {
                    id: 3,
                    name: "Delicious Hostel",
                     image: "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9zdGVsfGVufDB8fDB8fHww",
                    location: "Ghana Communication Technology University, Tesano  - Accra",
                    price: 2800,
                    priceLabel: "GHS 2,400/sem",
                    amenities: ["WiFi", "Study Area", "Security", "Water Supply"],
                    area: "accra",
                    availability: "closed",
                    officialUrl: "https://www.delicioushostel.com",
                    icon: "fa-building",
                    category: "budget",
                    nearby: true
                
                },{
                    id: 4,
                    name: "Delicious Hostel (Annex)",
                     image: "https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D",
                    location: "Ghana Communication Technology University, Tesano  - Accra",
                    price: 2930,
                    priceLabel: "GHS 2,930/sem",
                    amenities: ["WiFi", "Study Area", "Security", "Water Supply"],
                    area: "accra",
                    availability: "limited",
                    officialUrl: "https://www.delicioushostel.com",
                    icon: "fa-building",
                    category: "budget",
                    nearby: true
                
                },
                {
                    id: 5,
                    name: "Zack B Hostel",
                     image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=400",
                    location: "Ghana Communication Technology University, Tesano  - Accra",
                    price: 3000,
                    priceLabel: "GHS 3,000/sem",
                    amenities: ["WiFi", "Study Area", "Security", "Water Supply"],
                    area: "accra",
                    availability: "limited",
                    officialUrl: "https://www.zackbhostel.com",
                    icon: "fa-building",
                    category: "budget",
                     far: true
                }, {
                    id: 6,
                    name: "Zack B Hostel (Annex)",
                    image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=400",
                    location: "Ghana Communication Technology University, Tesano  - Accra",
                    price: 3200,
                    priceLabel: "GHS 3,200/sem",
                    amenities: ["WiFi", "Study Area", "Security", "Water Supply"],
                    area: "accra",
                    availability: "limited",
                    officialUrl: "https://www.zackbhostel.com",
                    icon: "fa-building",
                     far: true
                },
            ];

            // Filters
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFilter = btn.dataset.filter;
                    renderHostels();
                });
            });

            document.getElementById('searchInput').addEventListener('input', (e) => {
                searchTerm = e.target.value;
                renderHostels();
            });

              // ---------- STUDENT REVIEWS (testimonials) ----------
        const testimonialsData = [
            {
                id: 1,
                name: "Deborah Owusu",
                university: "Ghana Communication Technology University",
                rating: 4.3,
                text: "GCTUStudentHostels made finding a hostel near campus incredibly easy. The rooms at Palace hostel are clean, WiFi is fast, and the wardens are super helpful! Felt like home away from home.",
                avatarIcon: "fa-female"
            },
            {
                id: 2,
                name: "Mikella Shon",
                university: "Ghana Communication Technology University",
                rating: 4.2,
                text: "Affordable and safe. I stayed at Delicious Residency — AC, study lounge, and great food. The filters helped me compare prices at a glance. Highly recommended!",
                avatarIcon: "fa-user-graduate"
            },
            {
                id: 3,
                name: "Angela Appiah",
                university: "Ghana Communication Technology University",
                rating: 4.6,
                text: "I loved the 'nearby uni' filter. Found Unidaz Hostel within walking distance. The staff is friendly and they organize weekend events for students. 10/10!",
                avatarIcon: "fa-chalkboard-user"
            },
            {
                id: 4,
                name: "Daniel Afari",
                university: "Ghana Communication Technology University",
                rating: 4.5,
                text: "Zack B Hostel was budget-friendly and the vibe is amazing. 24/7 water and friendly owners. The testimonials on this site are genuine — I experienced the same warmth.",
                avatarIcon: "fa-book-open"
            }
        ];

          let currentFilter = "all";
        let searchTerm = "";

        // Helper: render hostels (view only, show "view details" badge instead of booking button)
        function renderHostels() {
            const grid = document.getElementById("hostelsGrid");
            if (!grid) return;

            let filtered = [...hostelsData];

            if (currentFilter === "available") {
                filtered = filtered.filter(h => h.availability === "available");
            } else if (currentFilter === "limited") {
                filtered = filtered.filter(h => h.availability === "limited");
            } else if (currentFilter === "nearby") {
                filtered = filtered.filter(h => h.nearby === true);
            }else if (currentFilter === "budget") {
                filtered = filtered.filter(h => h.category === "budget");
            }else if (currentFilter === "far") {
                filtered = filtered.filter(h => h.far === true);
            }

            if (searchTerm.trim() !== "") {
                const term = searchTerm.trim().toLowerCase();
                filtered = filtered.filter(h =>
                    h.name.toLowerCase().includes(term) ||
                    h.location.toLowerCase().includes(term)
                );
            }

            if (filtered.length === 0) {
                grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px;">🏝️ No hostels match, try different filters.</div>`;
                return;
            }

            grid.innerHTML = filtered.map(hostel => `
            <div class="hostel-card" data-id="${hostel.id}">
                <div class="card-img">
                     <img src="${hostel.image}" alt="${hostel.name}">
                </div>
                <div class="card-content">
                    <div class="card-title">
                        ${hostel.name}
                        <span class="price">${hostel.priceLabel}</span>
                    </div>
                    <div class="location"><i class="fas fa-map-marker-alt"></i> ${hostel.location}</div>
                    <div class="amenities">
                        ${hostel.amenities.slice(0, 3).map(am => `<span class="amenity-tag">${am}</span>`).join('')}
                        ${hostel.amenities.length > 3 ? `<span class="amenity-tag">+${hostel.amenities.length - 3}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        }

        // Render student testimonials dynamically
        function renderTestimonials() {
            const container = document.getElementById("testimonialsGrid");
            if (!container) return;

            const starsRenderer = (rating) => {
                let fullStars = Math.floor(rating);
                let halfStar = (rating % 1) >= 0.3 ? true : false; // small design trick
                let starHtml = "";
                for (let i = 0; i < fullStars; i++) starHtml += '<i class="fas fa-star"></i>';
                if (halfStar) starHtml += '<i class="fas fa-star-half-alt"></i>';
                let remaining = 5 - Math.ceil(rating);
                for (let i = 0; i < remaining; i++) starHtml += '<i class="far fa-star"></i>';
                return starHtml;
            };

            container.innerHTML = testimonialsData.map(test => `
            <div class="testimonial-card">
                <div class="rating">
                    ${starsRenderer(test.rating)}
                </div>
                <div class="testimonial-text">“${test.text}”</div>
                <div class="student-info">
                    <div class="student-avatar">
                        <i class="fas ${test.avatarIcon}"></i>
                    </div>
                    <div class="student-details">
                        <h4>${test.name}</h4>
                        <p>${test.university}</p>
                    </div>
                </div>
            </div>
        `).join('');
        }


        // event listeners (no booking modals, just browsing & reviews)
        function setupEventListeners() {
            const filterBtns = document.querySelectorAll(".filter-btn");
            filterBtns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    filterBtns.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    currentFilter = btn.getAttribute("data-filter");
                    renderHostels();
                });
            });

            const searchInput = document.getElementById("searchInput");
            searchInput.addEventListener("input", (e) => {
                searchTerm = e.target.value;
                renderHostels();
            });

            const exploreBtn = document.getElementById("exploreCta");
            if (exploreBtn) {
                exploreBtn.addEventListener("click", () => {
                    document.getElementById("hostels").scrollIntoView({ behavior: "smooth" });
                });
            }


            // optional: any testimonial link? but just passive
            const reviewsLink = document.querySelector('a[href="#testimonials"]');
            if (reviewsLink) {
                reviewsLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    document.getElementById("testimonials").scrollIntoView({ behavior: "smooth" });
                });
            }
        }

        document.addEventListener("DOMContentDidLoad", () => {
            renderHostels();
            renderTestimonials();
            setupEventListeners();
        });

        // ensure normal DOM ready
        window.addEventListener("DOMContentLoaded", () => {
            renderHostels();
            renderTestimonials();
            setupEventListeners();
        });

