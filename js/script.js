
/* =========================================
   Me & My Future
   JavaScript Interactions
   Author: 赖志恒
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. 打字机动画
    // =====================================

    const typingElement = document.getElementById("typing-text");

    const texts = [
        "Software Engineering Student",
        "Web Development Explorer",
        "AI Enthusiast",
        "Always Learning, Always Building"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer;

    function typeText() {
        if (!typingElement) return;

        const currentText = texts[textIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingElement.textContent =
            currentText.substring(0, charIndex);

        let delay = isDeleting ? 45 : 95;

        if (!isDeleting && charIndex === currentText.length) {
            delay = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 450;
        }

        typingTimer = setTimeout(typeText, delay);
    }

    if (typingElement) {
        typeText();
    }

    // =====================================
    // 2. 滚动淡入动画
    // =====================================

    const revealElements = document.querySelectorAll(".reveal");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reducedMotion && "IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -20px 0px"
            }
        );

        revealElements.forEach(element => {
            // 先检查元素是否已经进入视口
            const rect = element.getBoundingClientRect();

            if (rect.top < window.innerHeight &&
                rect.bottom > 0) {
                element.classList.add("visible");
            } else {
                revealObserver.observe(element);
            }
        });

        document.documentElement.classList.add("js-animations");
    }

    // =====================================
    // 3. 可交互未来时间轴
    // =====================================

    const timelineItems =
        document.querySelectorAll(".timeline-item");

    timelineItems.forEach(item => {
        const trigger = item.querySelector(".timeline-trigger");
        const content = item.querySelector(".timeline-content");

        if (!trigger || !content) return;

        trigger.addEventListener("click", () => {

            const isExpanded =
                trigger.getAttribute("aria-expanded") === "true";

            // 先关闭其他年份
            timelineItems.forEach(otherItem => {
                const otherTrigger =
                    otherItem.querySelector(".timeline-trigger");

                const otherContent =
                    otherItem.querySelector(".timeline-content");

                if (otherTrigger && otherContent) {
                    otherTrigger.setAttribute(
                        "aria-expanded", "false"
                    );
                    otherContent.hidden = true;
                }
            });

            // 如果原本关闭，则展开当前年份
            if (!isExpanded) {
                trigger.setAttribute("aria-expanded", "true");
                content.hidden = false;
            }
        });
    });

    // =====================================
    // 4. 导航栏当前板块高亮
    // =====================================

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 160;

        let currentSection = "home";

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            const isActive =
                link.getAttribute("href") === "#" + currentSection;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    let scrollTicking = false;

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    updateActiveNav();

    // =====================================
    // 5. 页面离开时清理定时器
    // =====================================

    window.addEventListener("pagehide", () => {
        clearTimeout(typingTimer);
    });

});
