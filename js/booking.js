class PsycheTechBooking {
    constructor() {
        this.currentStep = 1;
        this.selectedSpecialist = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.generateDates();
        this.generateTimeSlots();
    }

    bindEvents() {
        // Specialist selection
        document.querySelectorAll('.select-specialist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.specialist-card');
                this.selectSpecialist(card.dataset.specialist);
            });
        });

        // Date selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.date-cell') && !e.target.closest('.date-cell.disabled')) {
                const dateCell = e.target.closest('.date-cell');
                this.selectDate(dateCell.dataset.date);
            }
        });

        // Time slot selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.time-slot') && !e.target.closest('.time-slot.disabled')) {
                const timeSlot = e.target.closest('.time-slot');
                this.selectTime(timeSlot.dataset.time);
            }
        });

        // Step navigation
        document.getElementById('confirmTime').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('completeBooking').addEventListener('click', () => {
            this.completeBooking();
        });

        // Close modal
        document.querySelector('.btn-close-modal').addEventListener('click', () => {
            this.closeModal();
        });
    }

    selectSpecialist(specialistId) {
        this.selectedSpecialist = specialistId;
        
        // Update UI
        document.querySelectorAll('.specialist-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-specialist="${specialistId}"]`).classList.add('selected');
        
        // Move to next step after a brief delay
        setTimeout(() => {
            this.nextStep();
        }, 500);
    }

    generateDates() {
        const dateGrid = document.getElementById('dateGrid');
        const today = new Date();
        const dates = [];
        
        // Generate next 14 days
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        dateGrid.innerHTML = dates.map(date => {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = dayNames[date.getDay()];
            const dayNumber = date.getDate();
            const dateString = date.toISOString().split('T')[0];
            const isToday = i === 0;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            return `
                <div class="date-cell" data-date="${dateString}">
                    <div class="day">${isToday ? 'Today' : dayName}</div>
                    <div class="number">${dayNumber}</div>
                </div>
            `;
        }).join('');
    }

    generateTimeSlots() {
        const slotsGrid = document.getElementById('slotsGrid');
        const timeSlots = [
            '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', 
            '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
        ];
        
        slotsGrid.innerHTML = timeSlots.map(time => {
            // Simulate availability (in real app, this would come from API)
            const isAvailable = Math.random() > 0.3;
            
            return `
                <div class="time-slot ${isAvailable ? '' : 'disabled'}" data-time="${time}">
                    <div class="time">${time}</div>
                    <div class="availability">${isAvailable ? 'Available' : 'Booked'}</div>
                </div>
            `;
        }).join('');
    }

    selectDate(dateString) {
        this.selectedDate = dateString;
        
        // Update UI
        document.querySelectorAll('.date-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        document.querySelector(`[data-date="${dateString}"]`).classList.add('selected');
        
        // Enable time selection
        this.updateTimeSlots();
    }

    selectTime(timeString) {
        this.selectedTime = timeString;
        
        // Update UI
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        document.querySelector(`[data-time="${timeString}"]`).classList.add('selected');
        
        // Enable confirm button
        document.getElementById('confirmTime').disabled = false;
    }

    updateTimeSlots() {
        // In a real app, this would fetch available slots from API
        // For now, we'll just re-enable all slots
        document.querySelectorAll('.time-slot').forEach(slot => {
            if (!slot.classList.contains('disabled')) {
                slot.style.display = 'block';
            }
        });
    }

    nextStep() {
        if (this.currentStep < 3) {
            // Validate current step
            if (this.currentStep === 1 && !this.selectedSpecialist) {
                alert('Please select a counsellor before proceeding.');
                return;
            }
            
            if (this.currentStep === 2 && (!this.selectedDate || !this.selectedTime)) {
                alert('Please select a date and time before proceeding.');
                return;
            }
            
            // Hide current step
            document.getElementById(`step${this.currentStep}`).classList.remove('active');
            
            // Update step indicator
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.remove('active');
            
            // Move to next step
            this.currentStep++;
            
            // Show next step
            document.getElementById(`step${this.currentStep}`).classList.add('active');
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
            
            // Update summary if on final step
            if (this.currentStep === 3) {
                this.updateBookingSummary();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            // Hide current step
            document.getElementById(`step${this.currentStep}`).classList.remove('active');
            
            // Update step indicator
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.remove('active');
            
            // Move to previous step
            this.currentStep--;
            
            // Show previous step
            document.getElementById(`step${this.currentStep}`).classList.add('active');
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
        }
    }

    updateBookingSummary() {
        const specialistName = this.getSpecialistName(this.selectedSpecialist);
        const dateTime = this.formatDateTime(this.selectedDate, this.selectedTime);
        
        document.getElementById('summarySpecialist').textContent = specialistName;
        document.getElementById('summaryDateTime').textContent = dateTime;
        document.getElementById('summaryDuration').textContent = this.getSessionDuration();
        
        // Update confirmation modal
        document.getElementById('confirmSpecialist').textContent = specialistName;
        document.getElementById('confirmDateTime').textContent = dateTime;
    }

    getSpecialistName(specialistId) {
        const names = {
            'dr-smith': 'Dr. Sarah Smith',
            'dr-johnson': 'Dr. Michael Johnson',
            'ms-garcia': 'Ms. Maria Garcia'
        };
        return names[specialistId] || 'Selected Counsellor';
    }

    formatDateTime(dateString, timeString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return `${date.toLocaleDateString('en-US', options)} at ${timeString}`;
    }

    getSessionDuration() {
        const durations = {
            'dr-smith': '50 minutes',
            'dr-johnson': '45 minutes',
            'ms-garcia': '60 minutes'
        };
        return durations[this.selectedSpecialist] || '50 minutes';
    }

    completeBooking() {
        // Simulate API call to book session
        const bookingData = {
            specialist: this.selectedSpecialist,
            date: this.selectedDate,
            time: this.selectedTime,
            duration: this.getSessionDuration(),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (in real app, this would go to backend)
        const bookings = JSON.parse(localStorage.getItem('psychetech_bookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('psychetech_bookings', JSON.stringify(bookings));
        
        // Show success modal
        this.showSuccessModal();
    }

    showSuccessModal() {
        document.getElementById('successModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('successModal').classList.remove('show');
    }
}

// Initialize booking when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.booking = new PsycheTechBooking();
    
    // Close modal when clicking outside
    document.getElementById('successModal').addEventListener('click', (e) => {
        if (e.target.id === 'successModal') {
            window.booking.closeModal();
        }
    });
});