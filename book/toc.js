// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item expanded "><a href="why-use-a-proof-system.html"><strong aria-hidden="true">1.</strong> Why Use a Proof System?</a></li><li class="chapter-item expanded "><a href="why-stwo.html"><strong aria-hidden="true">2.</strong> Why Stwo?</a></li><li class="chapter-item expanded "><a href="air-development/index.html"><strong aria-hidden="true">3.</strong> AIR Development</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="air-development/writing-a-simple-air/index.html"><strong aria-hidden="true">3.1.</strong> Writing a Simple AIR</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="air-development/writing-a-simple-air/hello-zk-world.html"><strong aria-hidden="true">3.1.1.</strong> Hello (ZK) World</a></li><li class="chapter-item expanded "><a href="air-development/writing-a-simple-air/writing-a-spreadsheet.html"><strong aria-hidden="true">3.1.2.</strong> Writing a Spreadsheet</a></li><li class="chapter-item expanded "><a href="air-development/writing-a-simple-air/from-spreadsheet-to-trace-polynomials.html"><strong aria-hidden="true">3.1.3.</strong> From Spreadsheet to Trace Polynomials</a></li><li class="chapter-item expanded "><a href="air-development/writing-a-simple-air/committing-to-the-trace-polynomials.html"><strong aria-hidden="true">3.1.4.</strong> Committing to the Trace Polynomials</a></li><li class="chapter-item expanded "><a href="air-development/writing-a-simple-air/constraints-over-trace-polynomials.html"><strong aria-hidden="true">3.1.5.</strong> Evaluating Constraints Over Trace Polynomials</a></li><li class="chapter-item expanded "><a href="air-development/writing-a-simple-air/proving-an-air.html"><strong aria-hidden="true">3.1.6.</strong> Proving an AIR over the Trace</a></li></ol></li><li class="chapter-item expanded "><a href="air-development/preprocessed-trace/index.html"><strong aria-hidden="true">3.2.</strong> Preprocessed Trace</a></li><li class="chapter-item expanded "><a href="air-development/static-lookups/index.html"><strong aria-hidden="true">3.3.</strong> Static Lookups</a></li><li class="chapter-item expanded "><a href="air-development/dynamic-lookups/index.html"><strong aria-hidden="true">3.4.</strong> Dynamic Lookups</a></li><li class="chapter-item expanded "><a href="air-development/local-row-constraints/index.html"><strong aria-hidden="true">3.5.</strong> Local Row Constraints</a></li><li class="chapter-item expanded "><a href="air-development/components/index.html"><strong aria-hidden="true">3.6.</strong> Components</a></li><li class="chapter-item expanded "><a href="air-development/additional-examples/index.html"><strong aria-hidden="true">3.7.</strong> Additional Examples</a></li></ol></li><li class="chapter-item expanded "><a href="cairo/index.html"><strong aria-hidden="true">4.</strong> Cairo as a Stwo AIR</a></li><li class="chapter-item expanded "><a href="how-it-works/index.html"><strong aria-hidden="true">5.</strong> How Does It Work?</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="how-it-works/mersenne-prime.html"><strong aria-hidden="true">5.1.</strong> Mersenne Primes</a></li><li class="chapter-item expanded "><a href="how-it-works/lookups.html"><strong aria-hidden="true">5.2.</strong> Lookups</a></li></ol></li><li class="chapter-item expanded "><a href="users/index.html"><strong aria-hidden="true">6.</strong> Users of Stwo</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
