/* AlphaTON Capital IR Website - Main JavaScript */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOBILE MENU FUNCTIONALITY =====
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileMenuButton && mobileMenu) {
    // Function to open mobile menu
    function openMobileMenu() {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("animate-slide-down");
      menuIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
      mobileMenuButton.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    // Function to close mobile menu
    function closeMobileMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("animate-slide-down");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    // Toggle mobile menu
    mobileMenuButton.addEventListener("click", function () {
      const isHidden = mobileMenu.classList.contains("hidden");
      if (isHidden) {
        openMobileMenu();
      } else {
        closeMobileMenu();
      }
    });

    // Close menu when clicking on menu items
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Close menu with Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
        closeMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !mobileMenu.classList.contains("hidden") &&
        !mobileMenu.contains(e.target) &&
        !mobileMenuButton.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  // ===== NEWSLETTER FORM FUNCTIONALITY =====
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value;

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Show success message
      alert(
        "Thank you for subscribing! You will receive investor updates from AlphaTON Capital."
      );
      e.target.reset();
    });
  }

  // ===== ACTIVE PAGE NAVIGATION =====
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      // Add active class and update text color
      link.classList.add("active");
      link.classList.remove("text-gray-300");
      link.classList.add("text-white");
    } else {
      // Remove active class and update text color
      link.classList.remove("active");
      link.classList.remove("text-white");
      link.classList.add("text-gray-300");
    }
  });

  // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("nav")?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== BASIC FORM VALIDATION =====
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    // Skip newsletter form as it's handled above
    if (form.classList.contains("newsletter-form")) return;

    form.addEventListener("submit", function (e) {
      const requiredFields = this.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("error");
        } else {
          field.classList.remove("error");
        }

        // Email validation
        if (field.type === "email" && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add("error");
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert("Please fill in all required fields correctly.");
      }
    });
  });

  // ===== ACCESSIBILITY IMPROVEMENTS =====
  // Skip to main content link
  const skipLink = document.querySelector('a[href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    });
  }

  // ===== RSS FEED FUNCTIONALITY =====
  // Initialize RSS feed on news page
  if (document.getElementById("rss-feed-content")) {
    console.log("Initializing RSS feed on news page...");
    window.rssFeed = new RSSFeedComponent();
    rssFeed.init();
  }

  // ===== INITIALIZATION COMPLETE =====
  console.log("AlphaTON Capital IR Website initialized successfully");
  document.body.classList.add("loaded");
});

// RSS Feed Component
class RSSFeedComponent {
  constructor() {
    this.feedUrl = "https://alphatoncapital.com/feed/";
    this.itemsPerPage = 5;
    this.currentPage = 0;
    this.allItems = [];
    this.isLoading = false;

    console.log("RSSFeedComponent initialized");
  }

  async init() {
    try {
      console.log("Initializing RSS feed...");
      await this.loadFeed();
    } catch (error) {
      console.error("Error initializing RSS feed:", error);
      this.showError();
    }
  }

  async loadFeed() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      // Since we can't directly fetch RSS feeds due to CORS, we'll use a proxy service
      // or create mock data for demonstration purposes
      const feedData = await this.fetchFeedData();

      if (feedData && feedData.items) {
        this.allItems = feedData.items;
        this.renderItems();
        this.setupLoadMoreButton();
      } else {
        this.showNoData();
      }
    } catch (error) {
      console.error("Error loading RSS feed:", error);
      this.showError();
    } finally {
      this.isLoading = false;
    }
  }

  async fetchFeedData() {
    // For now, we'll use mock data since RSS feeds often have CORS issues
    // In production, you would use a server-side proxy or RSS-to-JSON service
    return this.getMockFeedData();
  }

  getMockFeedData() {
    // Mock RSS feed data for demonstration
    return {
      title: "AlphaTON Capital News",
      description: "Latest news and press releases from AlphaTON Capital Corp.",
      items: [
        {
          title: "AlphaTON Capital Reports Q3 2024 Financial Results",
          description:
            "AlphaTON Capital Corp. (Nasdaq: ATON) today announced its financial results for the third quarter ended September 30, 2024.",
          link: "#",
          pubDate: new Date("2024-10-15"),
          category: "Financial Results",
        },
        {
          title: "AlphaTON Capital Expands TON Validator Network",
          description:
            "Company announces deployment of additional validator nodes to strengthen TON blockchain infrastructure.",
          link: "#",
          pubDate: new Date("2024-10-10"),
          category: "Infrastructure",
        },
        {
          title: "AlphaTON Capital Partners with Leading DeFi Protocol",
          description:
            "Strategic partnership announced to enhance TON ecosystem liquidity and DeFi capabilities.",
          link: "#",
          pubDate: new Date("2024-10-05"),
          category: "Partnerships",
        },
        {
          title: "AlphaTON Capital Announces Treasury Management Strategy",
          description:
            "Company outlines comprehensive treasury management approach for TON token holdings.",
          link: "#",
          pubDate: new Date("2024-09-28"),
          category: "Corporate Strategy",
        },
        {
          title: "AlphaTON Capital Reports Q2 2024 Financial Results",
          description:
            "AlphaTON Capital Corp. announces strong Q2 performance with increased TON token holdings.",
          link: "#",
          pubDate: new Date("2024-08-15"),
          category: "Financial Results",
        },
        {
          title: "AlphaTON Capital Launches Investor Relations Portal",
          description:
            "New investor relations portal provides enhanced access to company information and updates.",
          link: "#",
          pubDate: new Date("2024-08-01"),
          category: "Corporate",
        },
        {
          title: "AlphaTON Capital Completes NASDAQ Listing",
          description:
            "Company successfully completes listing on NASDAQ Capital Market under ticker symbol ATON.",
          link: "#",
          pubDate: new Date("2024-07-15"),
          category: "Corporate",
        },
        {
          title: "AlphaTON Capital Announces TON Ecosystem Investment Fund",
          description:
            "Company establishes dedicated fund to invest in promising TON ecosystem projects.",
          link: "#",
          pubDate: new Date("2024-07-01"),
          category: "Investment",
        },
      ],
    };
  }

  renderItems() {
    const container = document.getElementById("rss-feed-content");
    if (!container) return;

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const itemsToShow = this.allItems.slice(startIndex, endIndex);

    if (this.currentPage === 0) {
      // Clear loading state and render first batch
      container.innerHTML = "";
    }

    itemsToShow.forEach((item, index) => {
      const newsItem = this.createNewsItem(item, startIndex + index);
      container.appendChild(newsItem);
    });

    this.hideLoading();
  }

  createNewsItem(item, index) {
    const newsItem = document.createElement("div");
    newsItem.className =
      "news-item bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-alphaton-primary/30 transition-all duration-200";
    newsItem.style.animationDelay = `${index * 0.1}s`;

    const pubDate = new Date(item.pubDate);
    const formattedDate = pubDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    newsItem.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-start gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 text-xs font-semibold bg-alphaton-primary/20 text-alphaton-primary rounded-full">
              ${item.category}
            </span>
            <span class="text-gray-400 text-sm">${formattedDate}</span>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-3 hover:text-alphaton-primary transition-colors">
            <a href="${item.link}" class="hover:underline">${item.title}</a>
          </h3>
          
          <p class="text-gray-300 leading-relaxed mb-4">${item.description}</p>
          
          <div class="flex items-center justify-between">
            <a href="${item.link}" class="read-more-btn inline-flex items-center text-alphaton-primary hover:text-blue-400 font-semibold transition-colors duration-200">
              Read More
              <svg class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    return newsItem;
  }

  setupLoadMoreButton() {
    const loadMoreContainer = document.getElementById("load-more-btn");
    if (!loadMoreContainer) return;

    const totalPages = Math.ceil(this.allItems.length / this.itemsPerPage);
    const hasMorePages = this.currentPage + 1 < totalPages;

    if (hasMorePages) {
      loadMoreContainer.innerHTML = `
        <button id="load-more-news" class="load-more-btn group bg-alphaton-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-alphaton-primary/20 hover:border-alphaton-primary/40">
          <span class="flex items-center space-x-2">
            <span>Load More News</span>
            <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </span>
        </button>
      `;

      // Add event listener for load more button
      const loadMoreBtn = document.getElementById("load-more-news");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
          this.loadMore();
        });
      }
    } else {
      loadMoreContainer.innerHTML = `
        <div class="text-gray-400 text-sm">
          All news items loaded
        </div>
      `;
    }
  }

  loadMore() {
    this.currentPage++;
    this.renderItems();
    this.setupLoadMoreButton();
  }

  showLoading() {
    const container = document.getElementById("rss-feed-content");
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-8">
        <div class="alphaton-spinner"></div>
      </div>
    `;
  }

  hideLoading() {
    // Loading state is handled in renderItems
  }

  showError() {
    const container = document.getElementById("rss-feed-content");
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-8">
        <div class="text-red-400 mb-4">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Unable to Load News</h3>
        <p class="text-gray-400 mb-4">There was an error loading the latest news. Please try again later.</p>
        <button onclick="location.reload()" class="bg-alphaton-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
          Retry
        </button>
      </div>
    `;
  }

  showNoData() {
    const container = document.getElementById("rss-feed-content");
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-8">
        <div class="text-gray-400 mb-4">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">No News Available</h3>
        <p class="text-gray-400">No news items are currently available. Please check back later.</p>
      </div>
    `;
  }
}
