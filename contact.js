document.addEventListener("DOMContentLoaded", () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked button and corresponding content
        button.classList.add("active")
        const tabId = button.getAttribute("data-tab")
        document.getElementById(tabId).classList.add("active")
      })
    })
  
    // Contact form validation
    const contactForm = document.getElementById("contactForm")
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        let isValid = true
  
        // Validate name
        const fullName = document.getElementById("fullName")
        if (fullName.value.trim() === "") {
          showValidationError(fullName, "Name is required")
          isValid = false
        } else {
          clearValidationError(fullName)
        }
  
        // Validate email
        const email = document.getElementById("email")
        if (email.value.trim() === "") {
          showValidationError(email, "Email is required")
          isValid = false
        } else if (!isValidEmail(email.value)) {
          showValidationError(email, "Please enter a valid email")
          isValid = false
        } else {
          clearValidationError(email)
        }
  
        // Validate phone
        const phone = document.getElementById("phone")
        if (phone.value.trim() === "") {
          showValidationError(phone, "Phone number is required")
          isValid = false
        } else {
          clearValidationError(phone)
        }
  
        if (isValid) {
          // Simulate form submission
          alert("Thank you for your message! We will get back to you soon.")
          contactForm.reset()
        }
      })
    }
  
    // Appointment scheduler functionality
    const appointmentForm = document.getElementById("appointmentForm")
    if (appointmentForm) {
      // Initialize date picker
      const appointmentDate = document.getElementById("appointmentDate")
      if (appointmentDate) {
        flatpickr(appointmentDate, {
          minDate: "today",
          dateFormat: "Y-m-d",
          disable: [
            (date) => {
              // Disable weekends
              return date.getDay() === 0 || date.getDay() === 6
            },
          ],
        })
      }
  
      // Car selection
      const carOptions = document.querySelectorAll(".car-option")
      let selectedCar = ""
  
      carOptions.forEach((option) => {
        option.addEventListener("click", () => {
          carOptions.forEach((opt) => opt.classList.remove("selected"))
          option.classList.add("selected")
          selectedCar = option.getAttribute("data-car")
        })
      })
  
      // Step navigation
      const steps = document.querySelectorAll(".step")
      const stepContents = document.querySelectorAll(".step-content")
      const nextButtons = document.querySelectorAll(".next-step")
      const prevButtons = document.querySelectorAll(".prev-step")
      let currentStep = 1
  
      function goToStep(step) {
        // Hide all step contents
        stepContents.forEach((content) => content.classList.remove("active"))
  
        // Show the current step content
        document.querySelector(`.step-content[data-step="${step}"]`).classList.add("active")
  
        // Update step indicators
        steps.forEach((s) => {
          const stepNum = Number.parseInt(s.getAttribute("data-step"))
          s.classList.remove("active", "completed")
  
          if (stepNum === step) {
            s.classList.add("active")
          } else if (stepNum < step) {
            s.classList.add("completed")
          }
        })
  
        currentStep = step
  
        // Update confirmation details if on the last step
        if (step === 4) {
          updateConfirmationDetails()
        }
      }
  
      nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Validate current step
          if (validateStep(currentStep)) {
            goToStep(currentStep + 1)
          }
        })
      })
  
      prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
          goToStep(currentStep - 1)
        })
      })
  
      function validateStep(step) {
        switch (step) {
          case 1:
            // Validate car selection
            if (!selectedCar) {
              alert("Please select a car")
              return false
            }
            return true
  
          case 2:
            // Validate date and time
            const date = document.getElementById("appointmentDate").value
            const timeSlot = document.querySelector('input[name="timeSlot"]:checked')
  
            if (!date) {
              alert("Please select a date")
              return false
            }
  
            if (!timeSlot) {
              alert("Please select a time slot")
              return false
            }
  
            return true
  
          case 3:
            // Validate personal information
            const name = document.getElementById("appFullName").value
            const email = document.getElementById("appEmail").value
            const phone = document.getElementById("appPhone").value
  
            if (!name || !email || !phone) {
              alert("Please fill in all required fields")
              return false
            }
  
            if (!isValidEmail(email)) {
              alert("Please enter a valid email")
              return false
            }
  
            return true
  
          default:
            return true
        }
      }
  
      function updateConfirmationDetails() {
        // Get selected car
        document.getElementById("confirmCar").textContent = selectedCar || "Not selected"
  
        // Get appointment type
        const appointmentType = document.querySelector('input[name="appointmentType"]:checked').value
        let typeText = "Test Drive"
  
        if (appointmentType === "consultation") {
          typeText = "Consultation"
        } else if (appointmentType === "rental-pickup") {
          typeText = "Rental Pickup"
        }
  
        document.getElementById("confirmType").textContent = typeText
  
        // Get date and time
        const date = document.getElementById("appointmentDate").value
        document.getElementById("confirmDate").textContent = date || "Not selected"
  
        const timeSlot = document.querySelector('input[name="timeSlot"]:checked')
        document.getElementById("confirmTime").textContent = timeSlot ? timeSlot.value + " AM/PM" : "Not selected"
  
        // Get personal info
        const name = document.getElementById("appFullName").value
        document.getElementById("confirmName").textContent = name || "Not provided"
  
        const email = document.getElementById("appEmail").value
        const phone = document.getElementById("appPhone").value
        document.getElementById("confirmContact").textContent = email + " / " + phone
      }
  
      // Form submission
      appointmentForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        if (validateStep(currentStep)) {
          // Show success modal
          const modal = document.getElementById("successModal")
          modal.classList.add("show")
  
          // Update summary in modal
          document.getElementById("summaryCarModel").textContent = selectedCar
  
          const date = document.getElementById("appointmentDate").value
          const timeSlot = document.querySelector('input[name="timeSlot"]:checked').value
          document.getElementById("summaryDateTime").textContent = `${date} at ${timeSlot}`
  
          const appointmentType = document.querySelector('input[name="appointmentType"]:checked').value
          let typeText = "Test Drive"
  
          if (appointmentType === "consultation") {
            typeText = "Consultation"
          } else if (appointmentType === "rental-pickup") {
            typeText = "Rental Pickup"
          }
  
          document.getElementById("summaryType").textContent = typeText
  
          // Reset form
          setTimeout(() => {
            appointmentForm.reset()
            carOptions.forEach((opt) => opt.classList.remove("selected"))
            goToStep(1)
          }, 1000)
        }
      })
  
      // Close modal
      const closeModal = document.querySelector(".close-modal")
      const modalBtn = document.querySelector(".modal-btn")
  
      function hideModal() {
        const modal = document.getElementById("successModal")
        modal.classList.remove("show")
      }
  
      if (closeModal) {
        closeModal.addEventListener("click", hideModal)
      }
  
      if (modalBtn) {
        modalBtn.addEventListener("click", hideModal)
      }
    }
  
    // Helper functions
    function showValidationError(input, message) {
      const formGroup = input.parentElement
      const errorMessage = formGroup.querySelector(".validation-message")
      errorMessage.textContent = message
      input.classList.add("error")
    }
  
    function clearValidationError(input) {
      const formGroup = input.parentElement
      const errorMessage = formGroup.querySelector(".validation-message")
      errorMessage.textContent = ""
      input.classList.remove("error")
    }
  
    function isValidEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  })
  