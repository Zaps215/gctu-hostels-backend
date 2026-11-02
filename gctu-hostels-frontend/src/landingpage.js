// ==========================================
// GCTU HOSTELS - LIVE API INTEGRATED CLIENT
// ==========================================

const API_URL = API_CONFIG.HOSTEL_API;

// Global state holding live database records
let allHostels = [];
let currentFilter = "all";
let searchTerm = new URLSearchParams(window.location.search).get("search") || "";
let priceRange = "all";
const selectedAmenities = new Set();

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function safeHttpUrl(value) {
    try {
        const url = new URL(value, window.location.origin);
        return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
    } catch {
        return "";
    }
}

function renderHostelCard(hostel) {
    const imageUrl = safeHttpUrl(hostel.coverImage || hostel.image) ||
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
    const officialUrl = safeHttpUrl(hostel.officialUrl);

    return `
        <div class="hostel-card" data-id="${escapeHtml(hostel._id)}">
            <div class="card-img">
                 <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(hostel.name)}">
            </div>
            <div class="card-content">
                <div class="card-title">
                    ${escapeHtml(hostel.name)}
                    <span class="price">GHS ${Number.isFinite(hostel.price) ? hostel.price.toLocaleString() : 'N/A'} / ${hostel.paymentTerm === 'per academic year' ? 'yr' : 'sem'}</span>
                </div>
                <div class="location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(hostel.location)} (${escapeHtml(hostel.distanceFromCampus || 'Walking distance')})</div>
                <div class="amenities">
                    ${(hostel.amenities || []).slice(0, 3).map(am => `<span class="amenity-tag">${escapeHtml(am)}</span>`).join('')}
                    ${(hostel.amenities || []).length > 3 ? `<span class="amenity-tag">+${hostel.amenities.length - 3}</span>` : ''}
                </div>
                ${officialUrl ? `
                    <div style="margin-top: 10px;">
                        <a href="${escapeHtml(officialUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: #3498db; text-decoration: none; font-weight: 600;">
                            Visit Official Site <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderAmenityFilters() {
    const container = document.getElementById("amenityFilters");
    if (!container) return;

    const amenities = [...new Set(allHostels
        .flatMap(hostel => Array.isArray(hostel.amenities) ? hostel.amenities : [])
        .map(amenity => String(amenity).trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)))];

    container.innerHTML = `
        <button class="filter-btn active" type="button" data-amenity="" aria-pressed="true">Any</button>
        ${amenities.map(amenity => `
            <button class="filter-btn" type="button" data-amenity="${escapeHtml(amenity)}" aria-pressed="false">
                ${escapeHtml(amenity)}
            </button>
        `).join('')}
    `;
}

// Fetch hostels from MongoDB backend API
async function loadHostelsFromAPI() {
    const grid = document.getElementById("hostelsGrid");
    if (!grid) return;

    // Show loading state matching your card layout
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #666;">
            <i class="fas fa-spinner fa-spin fa-2x"></i>
            <p style="margin-top: 10px;">Loading verified GCTU student housing from database...</p>
        </div>
    `;

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (response.ok && result.success && Array.isArray(result.data)) {
            allHostels = result.data;
            renderAmenityFilters();
            renderHostels();
        } else {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px;">Unable to load hostels right now.</div>`;
        }
    } catch (error) {
        console.error('Failed to fetch hostels:', error);
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px; color: #e74c3c;">⚠️ Unable to connect to GCTU Hostels server. Please try again later.</div>`;
    }
}

// Render hostels based on current filters and search term
function renderHostels() {
    const grid = document.getElementById("hostelsGrid");
    if (!grid) return;

    let filtered = [...allHostels];

    // Apply filter button logic
    if (currentFilter === "available") {
        filtered = filtered.filter(h => h.isAvailable === true);
    } else if (currentFilter === "nearby") {
        filtered = filtered.filter(h => h.distanceFromCampus && h.distanceFromCampus.toLowerCase().includes('walk'));
    } else if (currentFilter === "budget") {
        filtered = filtered.filter(h => h.price <= 3000);
    } else if (currentFilter === "far") {
        filtered = filtered.filter(h => h.distanceFromCampus && !h.distanceFromCampus.toLowerCase().includes('walk'));
    }

    if (priceRange === "under-2000") {
        filtered = filtered.filter(hostel => hostel.price < 2000);
    } else if (priceRange === "2000-3000") {
        filtered = filtered.filter(hostel => hostel.price >= 2000 && hostel.price <= 3000);
    } else if (priceRange === "over-3000") {
        filtered = filtered.filter(hostel => hostel.price > 3000);
    }

    if (selectedAmenities.size > 0) {
        filtered = filtered.filter(hostel => {
            const amenities = (hostel.amenities || []).map(amenity => amenity.toLowerCase());
            return [...selectedAmenities].every(amenity => amenities.includes(amenity));
        });
    }

    // Apply search input query
    if (searchTerm.trim() !== "") {
        const term = searchTerm.trim().toLowerCase();
        filtered = filtered.filter(h =>
            (h.name || "").toLowerCase().includes(term) ||
            (h.location || "").toLowerCase().includes(term)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px;">🏝️ No hostels match your criteria, try different filters.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(renderHostelCard).join('');
}

// ---------- STUDENT REVIEWS (testimonials) ----------
const testimonialsData = [
    {
        id: 1,
        name: "Deborah Owusu",
        university: "Ghana Communication Technology University",
        rating: 4.3,
        text: "GCTUStudentHostels made finding a hostel near campus incredibly easy. The rooms are clean, WiFi is fast, and the wardens are super helpful! Felt like home away from home.",
        avatarIcon: "fa-female"
    },
    {
        id: 2,
        name: "Mikella Shon",
        university: "Ghana Communication Technology University",
        rating: 4.2,
        text: "Affordable and safe. The filters helped me compare prices at a glance. Highly recommended!",
        avatarIcon: "fa-user-graduate"
    },
    {
        id: 3,
        name: "Angela Appiah",
        university: "Ghana Communication Technology University",
        rating: 4.6,
        text: "I loved the 'nearby' filter. Found Unidaz Hostel within walking distance. 10/10!",
        avatarIcon: "fa-chalkboard-user"
    },
    {
        id: 4,
        name: "Daniel Afari",
        university: "Ghana Communication Technology University",
        rating: 4.5,
        text: "Budget-friendly and the vibe is amazing. 24/7 water and friendly owners. The testimonials on this site are genuine.",
        avatarIcon: "fa-book-open"
    }
];

// Render student testimonials dynamically
function renderTestimonials() {
    const container = document.getElementById("testimonialsGrid");
    if (!container) return;

    const starsRenderer = (rating) => {
        let fullStars = Math.floor(rating);
        let halfStar = (rating % 1) >= 0.3;
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

// Event listeners for filters and search
function setupEventListeners() {
    const filterBtns = document.querySelectorAll("#filterGroup .filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            renderHostels();
        });
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        if (searchTerm) searchInput.value = searchTerm;
        searchInput.addEventListener("input", (e) => {
            searchTerm = e.target.value;
            renderHostels();
        });
    }

    const priceFilter = document.getElementById("priceFilter");
    if (priceFilter) {
        priceFilter.addEventListener("change", () => {
            priceRange = priceFilter.value;
            renderHostels();
        });
    }

    const amenityFilters = document.getElementById("amenityFilters");
    if (amenityFilters) {
        amenityFilters.addEventListener("click", event => {
            const button = event.target.closest("button[data-amenity]");
            if (!button) return;

            const amenity = button.dataset.amenity.toLowerCase();
            if (!amenity) {
                selectedAmenities.clear();
            } else if (selectedAmenities.has(amenity)) {
                selectedAmenities.delete(amenity);
            } else {
                selectedAmenities.add(amenity);
            }

            amenityFilters.querySelectorAll("button[data-amenity]").forEach(filterButton => {
                const selected = filterButton.dataset.amenity
                    ? selectedAmenities.has(filterButton.dataset.amenity.toLowerCase())
                    : selectedAmenities.size === 0;
                filterButton.classList.toggle("active", selected);
                filterButton.setAttribute("aria-pressed", String(selected));
            });
            renderHostels();
        });
    }

    const exploreBtn = document.getElementById("exploreCta");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            document.getElementById("hostels").scrollIntoView({ behavior: "smooth" });
        });
    }
}

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    loadHostelsFromAPI();
    renderTestimonials();
    setupEventListeners();
});