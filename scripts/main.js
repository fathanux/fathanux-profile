/**
 * Portfolio - Main JavaScript
 * Handles navigation, smooth scroll, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // ========== Navbar Scroll Effect ==========
    let lastScrollY = window.scrollY;

    // ========== Form Redirect Fix ==========
    // Ensures reliable redirect to thank-you.html after submission
    const nextInput = document.querySelector('input[name="_next"]');
    if (nextInput) {
        nextInput.value = new URL('thank-you.html', window.location.href).href;
    }

    const handleNavbarScroll = () => {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ========== Mobile Menu Toggle ==========
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');

            // Update aria-expanded
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ========== Active Navigation Link ==========
    const sections = document.querySelectorAll('section[id]');

    const highlightNavLink = () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ========== Smooth Scroll for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== Intersection Observer for Animations ==========
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    document.querySelectorAll('.project-card, .skill-item').forEach(el => {
        animateOnScroll.observe(el);
    });

    // ========== Console Easter Egg ==========
    console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold;');
    console.log('%cThanks for checking out my portfolio.', 'font-size: 14px;');
    console.log('%cBuilt with ❤️ using HTML, Tailwind CSS, and vanilla JS.', 'font-size: 12px; color: #737373;');
});

// ========== Certificate Modal Functions ==========

function openCertificateModal(imageSrc, imageAlt) {
    const certificateModal = document.getElementById('certificate-modal');
    const modalCertificateImg = document.getElementById('modal-certificate-img');
    const modalCertificateTitle = document.getElementById('modal-certificate-title');

    console.log('Opening certificate modal with:', imageSrc, imageAlt); // Debug

    if (certificateModal && modalCertificateImg && modalCertificateTitle) {
        // Set the image source directly
        modalCertificateImg.src = imageSrc;
        modalCertificateImg.alt = imageAlt;
        modalCertificateTitle.textContent = imageAlt;

        certificateModal.classList.remove('hidden');
        certificateModal.classList.add('show');

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal elements not found!');
    }
}

function closeCertificateModal() {
    const certificateModal = document.getElementById('certificate-modal');
    if (certificateModal) {
        const modalContent = certificateModal.querySelector('.animate-modal-in');
        if (modalContent) {
            modalContent.classList.remove('animate-modal-in');
            modalContent.classList.add('animate-modal-out');
        }

        setTimeout(() => {
            certificateModal.classList.add('hidden');
            certificateModal.classList.remove('show');
            if (modalContent) {
                modalContent.classList.remove('animate-modal-out');
                modalContent.classList.add('animate-modal-in');
            }
            // Restore body scroll
            document.body.style.overflow = '';
        }, 200);
    }
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCertificateModal();
            }
        });
    }

    // Project modal click outside to close
    const projectModal = document.getElementById('project-modal');
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }

    // Certificate clickable elements - using event delegation for better mobile support
    document.querySelectorAll('.certificate-clickable').forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const certSrc = this.getAttribute('data-cert-src');
            const certAlt = this.getAttribute('data-cert-alt');
            if (certSrc && certAlt) {
                openCertificateModal(certSrc, certAlt);
            }
        });

        // Also handle touch events for mobile
        el.addEventListener('touchend', function (e) {
            e.preventDefault();
            const certSrc = this.getAttribute('data-cert-src');
            const certAlt = this.getAttribute('data-cert-alt');
            if (certSrc && certAlt) {
                openCertificateModal(certSrc, certAlt);
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('show')) {
                closeCertificateModal();
            }
            if (projectModal && projectModal.classList.contains('show')) {
                closeProjectModal();
            }
        }
    });
});

// ========== Project Modal Functions ==========
let currentProjectLink = '';

function openProjectModal(imageSrc, title, description, link, tags) {
    const modal = document.getElementById('project-modal');
    const img = document.getElementById('modal-project-img');
    const titleEl = document.getElementById('modal-project-title');
    const descEl = document.getElementById('modal-project-desc');
    const tagsEl = document.getElementById('modal-project-tags');
    const linkEl = document.getElementById('modal-project-link');

    if (modal && img && titleEl && descEl && tagsEl && linkEl) {
        // Get the full URL for the image 
        let fullImageSrc = imageSrc;

        // If imageSrc is relative, convert to absolute
        if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
            const tempLink = document.createElement('a');
            tempLink.href = imageSrc;
            fullImageSrc = tempLink.href;
        }

        // Set image with a small delay to ensure DOM is ready
        img.src = '';
        setTimeout(() => {
            img.src = fullImageSrc;
            img.alt = title;
        }, 10);

        titleEl.textContent = title;
        descEl.textContent = description;
        currentProjectLink = link; // Store the link

        // Clear and add tags
        tagsEl.innerHTML = '';
        tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'px-3 py-1 bg-bg-tertiary rounded-full text-sm text-text-secondary';
            tagSpan.textContent = tag;
            tagsEl.appendChild(tagSpan);
        });

        modal.classList.remove('hidden');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function visitProjectLink() {
    if (currentProjectLink && currentProjectLink !== '#') {
        window.open(currentProjectLink, '_blank');
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalContent = modal.querySelector('.animate-modal-in');
        if (modalContent) {
            modalContent.classList.remove('animate-modal-in');
            modalContent.classList.add('animate-modal-out');
        }

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('show');
            if (modalContent) {
                modalContent.classList.remove('animate-modal-out');
                modalContent.classList.add('animate-modal-in');
            }
            document.body.style.overflow = '';
        }, 200);
    }
}
