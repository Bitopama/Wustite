// Professional Presentation Navigation System

class PresentationController {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.currentSlideIndex = 0;
        
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentSlideSpan = document.getElementById('current-slide');
        this.totalSlidesSpan = document.getElementById('total-slides');
        
        this.init();
    }

    init() {
        // Set initial values
        this.totalSlidesSpan.textContent = this.totalSlides;
        this.updateSlideCounter();
        this.updateNavigation();
        this.createProgressBar();
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Presentation mode support
        this.addPresentationModeSupport();
        
        // Initialize with first slide
        this.updateProgressBar();
        
        console.log('🎯 Wüstite Reduction Kinetics Presentation Ready');
        console.log('💡 Press ? for keyboard shortcuts');
        console.log('⏱️ Press Ctrl/Cmd + T to start presentation timer');
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progress-bar';
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }

    updateProgressBar() {
        const progress = ((this.currentSlideIndex + 1) / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    updateSlideCounter() {
        this.currentSlideSpan.textContent = this.currentSlideIndex + 1;
    }

    updateNavigation() {
        // Update button states
        this.prevBtn.disabled = this.currentSlideIndex === 0;
        this.nextBtn.disabled = this.currentSlideIndex === this.totalSlides - 1;
        
        // Add visual feedback for disabled buttons
        if (this.prevBtn.disabled) {
            this.prevBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'not-allowed';
        } else {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'pointer';
        }
        
        if (this.nextBtn.disabled) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'not-allowed';
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
        }
    }

    showSlide(index) {
        // Validate index
        if (index < 0 || index >= this.totalSlides) {
            return;
        }
        
        // Hide current slide
        this.slides[this.currentSlideIndex].classList.remove('active');
        
        // Show new slide
        this.currentSlideIndex = index;
        this.slides[this.currentSlideIndex].classList.add('active');
        
        // Update UI
        this.updateSlideCounter();
        this.updateNavigation();
        this.updateProgressBar();
        
        // Announce slide change for accessibility
        this.announceSlideChange();
        
        // Auto-focus management for better UX
        this.manageFocus();
    }

    nextSlide() {
        if (this.currentSlideIndex < this.totalSlides - 1) {
            this.showSlide(this.currentSlideIndex + 1);
        }
    }

    previousSlide() {
        if (this.currentSlideIndex > 0) {
            this.showSlide(this.currentSlideIndex - 1);
        }
    }

    handleKeydown(e) {
        // Prevent default behavior for presentation keys
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.showSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.showSlide(this.totalSlides - 1);
                break;
            case 'Escape':
                e.preventDefault();
                this.exitFullscreen();
                break;
            case 'f':
            case 'F':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
                break;
        }
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const container = document.querySelector('.presentation-container');
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });
        
        this.handleSwipe = () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // Only process horizontal swipes that are longer than vertical swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide(); // Swipe right = previous slide
                } else {
                    this.nextSlide(); // Swipe left = next slide
                }
            }
        };
    }

    addPresentationModeSupport() {
        // Add fullscreen toggle functionality
        const container = document.querySelector('.presentation-container');
        
        // Double-click to toggle fullscreen
        container.addEventListener('dblclick', () => {
            this.toggleFullscreen();
        });
        
        // Handle fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            this.handleFullscreenChange();
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }

    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    handleFullscreenChange() {
        const isFullscreen = !!document.fullscreenElement;
        const container = document.querySelector('.presentation-container');
        
        if (isFullscreen) {
            container.classList.add('fullscreen-mode');
        } else {
            container.classList.remove('fullscreen-mode');
        }
    }

    announceSlideChange() {
        // Create or update aria-live region for screen readers
        let announcer = document.getElementById('slide-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'slide-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
        }
        
        const slideTitle = this.slides[this.currentSlideIndex].querySelector('.slide-title, .main-title');
        const title = slideTitle ? slideTitle.textContent : `Slide ${this.currentSlideIndex + 1}`;
        announcer.textContent = `${title}, slide ${this.currentSlideIndex + 1} of ${this.totalSlides}`;
    }

    manageFocus() {
        // Focus management for better accessibility
        const currentSlide = this.slides[this.currentSlideIndex];
        const focusableElement = currentSlide.querySelector('h1, h2, .slide-title, .main-title');
        
        if (focusableElement) {
            // Add tabindex to make it focusable, then focus
            focusableElement.setAttribute('tabindex', '-1');
            focusableElement.focus();
            
            // Remove tabindex after focus to keep natural tab order
            setTimeout(() => {
                focusableElement.removeAttribute('tabindex');
            }, 100);
        }
    }

    // Utility method to jump to specific slide (can be called externally)
    goToSlide(slideNumber) {
        const index = slideNumber - 1;
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }

    // Get current slide information
    getCurrentSlideInfo() {
        return {
            current: this.currentSlideIndex + 1,
            total: this.totalSlides,
            title: this.slides[this.currentSlideIndex].querySelector('.slide-title, .main-title')?.textContent || ''
        };
    }
}

// Enhanced presentation timer (useful for 20-minute presentation timing)
class PresentationTimer {
    constructor() {
        this.startTime = null;
        this.isRunning = false;
        this.targetDuration = 20 * 60; // 20 minutes in seconds
        
        this.createTimerDisplay();
    }

    createTimerDisplay() {
        const timerDiv = document.createElement('div');
        timerDiv.id = 'presentation-timer';
        timerDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(31, 73, 125, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: var(--font-family-mono);
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            display: none;
            min-width: 100px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(timerDiv);
        this.timerElement = timerDiv;
    }

    start() {
        this.startTime = Date.now();
        this.isRunning = true;
        this.timerElement.style.display = 'block';
        this.updateTimer();
    }

    stop() {
        this.isRunning = false;
        this.timerElement.style.display = 'none';
    }

    reset() {
        this.startTime = null;
        this.isRunning = false;
        this.timerElement.style.display = 'none';
    }

    updateTimer() {
        if (!this.isRunning || !this.startTime) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const remaining = Math.max(0, this.targetDuration - elapsed);
        
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const color = remaining < 120 ? '#ef4444' : remaining < 300 ? '#f59e0b' : 'white';
        
        this.timerElement.textContent = timeString;
        this.timerElement.style.color = color;
        
        // Add warning indicators
        if (remaining < 60) {
            this.timerElement.style.animation = 'pulse 1s infinite';
        } else {
            this.timerElement.style.animation = 'none';
        }
        
        if (this.isRunning) {
            requestAnimationFrame(() => this.updateTimer());
        }
    }

    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Help System
class HelpSystem {
    constructor() {
        this.helpOverlay = null;
    }

    show() {
        if (this.helpOverlay) {
            this.hide();
            return;
        }
        
        this.helpOverlay = document.createElement('div');
        this.helpOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-family-base);
            backdrop-filter: blur(4px);
        `;
        
        this.helpOverlay.innerHTML = `
            <div style="background: #1F497D; padding: 40px; border-radius: 12px; max-width: 600px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);">
                <h3 style="margin-top: 0; color: white; text-align: center; font-size: 24px; margin-bottom: 32px;">Presentation Controls</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px; font-size: 16px; line-height: 1.5;">
                    <strong style="color: #e2e8f0;">→ / Space / Page Down</strong><span>Next slide</span>
                    <strong style="color: #e2e8f0;">← / Page Up</strong><span>Previous slide</span>
                    <strong style="color: #e2e8f0;">Home</strong><span>First slide</span>
                    <strong style="color: #e2e8f0;">End</strong><span>Last slide</span>
                    <strong style="color: #e2e8f0;">Ctrl/Cmd + F</strong><span>Toggle fullscreen</span>
                    <strong style="color: #e2e8f0;">Ctrl/Cmd + T</strong><span>Toggle timer</span>
                    <strong style="color: #e2e8f0;">Ctrl/Cmd + 1-9</strong><span>Go to slide number</span>
                    <strong style="color: #e2e8f0;">Double-click</strong><span>Toggle fullscreen</span>
                    <strong style="color: #e2e8f0;">Escape</strong><span>Exit fullscreen</span>
                    <strong style="color: #e2e8f0;">?</strong><span>Show/hide this help</span>
                </div>
                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                    <h4 style="color: #cbd5e1; font-size: 18px; margin-bottom: 16px;">Mobile Controls</h4>
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px; font-size: 14px;">
                        <strong style="color: #e2e8f0;">Swipe Left</strong><span>Next slide</span>
                        <strong style="color: #e2e8f0;">Swipe Right</strong><span>Previous slide</span>
                        <strong style="color: #e2e8f0;">Tap Buttons</strong><span>Navigate slides</span>
                    </div>
                </div>
                <p style="text-align: center; margin-bottom: 0; margin-top: 32px; font-size: 14px; opacity: 0.8; color: #cbd5e1;">
                    Click anywhere or press ? to close
                </p>
            </div>
        `;
        
        this.helpOverlay.addEventListener('click', () => {
            this.hide();
        });
        
        document.body.appendChild(this.helpOverlay);
    }

    hide() {
        if (this.helpOverlay) {
            this.helpOverlay.remove();
            this.helpOverlay = null;
        }
    }

    toggle() {
        if (this.helpOverlay) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation controller
    window.presentation = new PresentationController();
    
    // Initialize timer (optional feature)
    window.timer = new PresentationTimer();
    
    // Initialize help system
    window.help = new HelpSystem();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .fullscreen-mode .navigation-controls {
            bottom: 40px;
        }
        
        .fullscreen-mode .slide-counter {
            top: 30px;
            right: 30px;
        }
    `;
    document.head.appendChild(style);
    
    // Add timer toggle with 'T' key
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 't' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            window.timer.toggle();
        }
    });
    
    // Add slide navigation shortcuts (for advanced users)
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '9' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const slideNumber = parseInt(e.key);
            if (slideNumber <= window.presentation.totalSlides) {
                window.presentation.goToSlide(slideNumber);
            }
        }
    });
    
    // Add help overlay toggle
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
            e.preventDefault();
            window.help.toggle();
        }
    });
    
    // Print functionality
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p' && (e.ctrlKey || e.metaKey)) {
            // Let browser handle print, but show all slides
            setTimeout(() => {
                const slides = document.querySelectorAll('.slide');
                slides.forEach(slide => slide.classList.add('active'));
            }, 100);
        }
    });
    
    // Add presentation status to page title
    const updateTitle = () => {
        const info = window.presentation.getCurrentSlideInfo();
        document.title = `Slide ${info.current}/${info.total} - Wüstite Reduction Kinetics`;
    };
    
    // Update title on slide change
    const originalShowSlide = window.presentation.showSlide;
    window.presentation.showSlide = function(index) {
        originalShowSlide.call(this, index);
        updateTitle();
    };
    
    // Initial title update
    updateTitle();
});