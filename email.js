/* email.js — robust EmailJS integration for your contact modal
   Keys provided by you are already inserted below.
*/

(function () {
    // --- Config (inserted from user's message) ---
    const EMAILJS_PUBLIC_KEY = "emi5MWiwuR-Jonc9_";
    const EMAILJS_SERVICE_ID = "service_t3cdylk";
    const EMAILJS_TEMPLATE_ID = "template_oab257m";
    // -------------------------------------------------
  
    // Initialize EmailJS (guarded)
    if (window.emailjs && typeof emailjs.init === "function") {
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        // console.log("EmailJS initialized");
      } catch (err) {
        console.error("EmailJS init error:", err);
      }
    } else {
      console.warn("EmailJS SDK not loaded. Ensure the SDK script is included before email.js");
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      // Element references (matching IDs in your HTML)
      const contactForm = document.getElementById("contact-form");
      const firstNameInput = document.getElementById("contact-first-name");
      const lastNameInput = document.getElementById("contact-last-name");
      const emailInput = document.getElementById("contact-email");
      const messageInput = document.getElementById("contact-message");
      const formMessage = contactForm ? contactForm.querySelector(".form-message") : null;
      const submitButton = contactForm ? contactForm.querySelector(".submit-btn") : null;
      const body = document.body;
  
      if (!contactForm || !firstNameInput || !lastNameInput || !emailInput || !messageInput || !formMessage || !submitButton) {
        console.error("Contact form elements missing. Verify these IDs: contact-form, contact-first-name, contact-last-name, contact-email, contact-message, .form-message, .submit-btn");
        return;
      }
  
      // Prevent attaching multiple handlers
      if (contactForm.__emailHandlerAttached) {
        console.warn("Submit handler already attached — skipping re-attach.");
        return;
      }
      contactForm.__emailHandlerAttached = true;
  
      // Permissive email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        // Read values from inputs (explicit IDs)
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
  
        // Debug: open DevTools Console to inspect these logs if needed
        console.groupCollapsed("Contact form submit debug");
        console.log("firstName:", JSON.stringify(firstName));
        console.log("lastName :", JSON.stringify(lastName));
        console.log("email    :", JSON.stringify(email));
        console.log("message  :", JSON.stringify(message));
        console.groupEnd();
  
        // Validation
        if (!firstName || !lastName || !email || !message) {
          formMessage.style.color = "#d93025";
          formMessage.textContent = "Please fill out all fields.";
          submitButton.style.backgroundColor = "var(--accent-color)";
          submitButton.style.boxShadow = "0 10px 30px rgba(255, 180, 0, 0.7)";
          return;
        }
  
        if (!emailRegex.test(email)) {
          formMessage.style.color = "#d93025";
          formMessage.textContent = "Please enter a valid email address.";
          submitButton.style.backgroundColor = "var(--accent-color)";
          submitButton.style.boxShadow = "0 10px 30px rgba(255, 180, 0, 0.7)";
          return;
        }
  
        // Sending UI
        formMessage.style.color = body.classList.contains("dark") ? "var(--accent-color)" : "var(--blue-dark)";
        formMessage.textContent = "Sending message...";
        submitButton.disabled = true;
        submitButton.dataset.origText = submitButton.textContent;
        submitButton.textContent = "Sending...";
        submitButton.style.transform = "scale(0.99)";
  
        const templateParams = {
          firstName,
          lastName,
          email,
          message,
          submittedAt: new Date().toISOString()
        };
  
        try {
          if (!window.emailjs || !emailjs.send) {
            throw new Error("EmailJS SDK not available (emailjs.send missing).");
          }
  
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
  
          // Success UI
          formMessage.style.color = body.classList.contains("dark") ? "var(--accent-color)" : "var(--blue-dark)";
          formMessage.textContent = `Thank you, ${firstName}! Your message has been received.`;
  
          submitButton.style.backgroundColor = "var(--blue-dark)";
          submitButton.style.boxShadow = "0 10px 30px rgba(13, 71, 161, 0.7)";
          submitButton.textContent = "Sent!";
  
          setTimeout(() => {
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = submitButton.dataset.origText || "Send Message";
            submitButton.style.transform = "";
          }, 1400);
  
        } catch (err) {
          console.error("Send error:", err);
          formMessage.style.color = "#d93025";
          formMessage.textContent = "Failed to send message. Please try again later.";
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.origText || "Send Message";
          submitButton.style.backgroundColor = "var(--accent-color)";
          submitButton.style.boxShadow = "0 10px 30px rgba(255, 180, 0, 0.7)";
        }
      });
    });
  })();
  
