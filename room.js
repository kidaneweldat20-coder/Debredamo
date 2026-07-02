// ==========================================================================
// Debredamo Hotel - Core Booking Engine with Imgbb & Live Availability
// ==========================================================================

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTVD4E-dN533dEEmtgKqDm3ONjNrPP0BihONjQ0ektcx-iBZzBtxBmp0hio9Qkcpzpwg/exec"; 

const ROOM_PRICES = {
  "Single Room": 1250,
  "Double Room": 3000,
  "VIP Suite": 10000
};

// Active Runtime State
let selectedRoomType = "";
let currentCalculatedTotal = 0;
let isRoomAvailableGlobal = false; 
let alertTimeout; 

// Flatpickr Instances Global Reference
let checkInPickerInstance = null;
let checkOutPickerInstance = null;

const translations = {
  en: {
    welcome_badge: "✨ እንቋዕ ደሓን መፃእኹም | Welcome",
    rooms_hero_title: "Secure Your Luxury Stay",
    rooms_hero_desc: "Select a room tier below to calculate your invoice and submit your reservation",
    choose_stay_btn: "Choose Your Stay",
    rooms_title: "Choose Your Stay",
    read_instructions: "Read Instructions Before Booking",
    instr_title: 'Booking Instructions',
    instr_step_1: "1. Check Availability: First, select your dates and click the 'Check Availability' button.",
    instr_step_2: "2. Payment: Transfer the exact amount to the bank accounts shown in the form.",
    instr_step_3: "3. Screenshot: Take a clear screenshot of your payment receipt.",
    instr_step_4: "4. Confirm: Upload the receipt and click 'Confirm Booking'. We will verify and email you.",
    instr_back_btn: 'Back to Rooms',
    room_1_type: "Single Room | በዓል ሓደ",
    room_1_desc: "Perfect for solo travelers with all modern amenities.",
    room_2_type: "Double Room | በዓል ሓደ ዓራት",
    room_2_desc: "Spacious rooms designed for couples or friends.",
    room_3_type: "VIP Suite | ቪኣይፒ",
    room_3_desc: "The ultimate luxury experience with premium views.",
    book_this_room: "Book This Room",
    full_name: "Full Name",
    email_address: "Email Address",
    phone_number: "Phone Number",
    guest_count: "Number of Guests",
    guest_1: "1 Guest",
    guest_2: "2 Guests",
    guest_3: "3 Guests",
    guest_4: "4+ Guests",
    check_in: "Check-in",
    check_out: "Check-out",
    check_availability: "Check Availability",
    invoice_details: "Invoice Details",
    total_days: "Total Days:",
    days_unit: "Days",
    rate_per_night: "Room Price:",
    total_payment: "Total Payment:",
    payment_method: "Select Payment Method",
    pay_instruct: "Payment Info",
    pay_description: "Please complete your payment using the following account details.",
    account_name_label: "Account Name:",
    upload_label: "Upload Receipt",
    upload_msg: "Click to browse or drag receipt image here",
    confirm_booking: "Confirm Booking",
    cancel_btn: "Cancel",
    continue_btn: "Continue",
    confirm_and_pay: "Confirm & Pay",
    processing: "Processing...",
    uploading_image: "Uploading receipt...",
    date_required_alert: "Please choose dates first!",
    date_invalid_alert: "Check-out date must be after Check-in date!",
    phone_invalid_alert: "⚠️ Phone number must be exactly 10 digits (e.g., 09xxxxxxxx)!", 
    room_available_status: "✓ Room is Available!",
    booking_success_alert: "Your booking request has been sent successfully!",
    booking_error_alert: "Error saving transaction data. Please check your network connection or try again later.",
    image_error_alert: "Failed to upload receipt to Imgbb. Please try again.",
    policy_title: 'Important Booking Rules',
    rule_1: '1. Check-in/out: Check-in from 12:00 PM; Check-out before 12:00 PM.',
    rule_2: '2. Occupancy: Maximum of 2 people per single room.',
    rule_3: '3. Identification: Guests must present a valid ID card or Passport.',
    footer_location: "Mekelle, Ethiopia"
  },
  ti: {
    welcome_badge: "✨ እንቋዕ ደሓን መፃእኹም | Welcome",
    rooms_hero_title: "ቅሳነት ዘለዎ ናይ ምቾት መዕርፎ",
    rooms_hero_desc: "ካብቶም ኣብ ታሕቲ ዘለዉ ክፍልታት ብምምራጽ ዝርዝር ሒሳብኩም Calculate ብምግባር ምዝገባኹም ፈጽሙ",
    choose_stay_btn: "ዝደለይዎ ክፍሊ ይምረጹ",
    rooms_title: "ዝደለይዎ ክፍሊ ይምረጹ",
    read_instructions: "ቅድሚ ምምምዝጋብኩም መምርሒ ኣንብቡ",
    instr_title: 'ናይ ኣመዛጋግባ መምርሒ',
    instr_step_1: "1. ትርፊ ምዃኑ ምርግጋጽ፦ መጀመርታ ዕለታት ምረጹ እሞ 'ክፉት ምዃኑ ኣረጋግፅ' ዝብል ጠውቁ።",
    instr_step_2: "2. ክፍሊት፦ ነቲ ዝግባእ ክፍሊት ናብቶም ዝተጠቐሱ ሒሳብ ቁጽሪታት ኣእትዉ።",
    instr_step_3: "3. ሪሲት፦ ናይቲ ዝኸፈልኩሙሉ ሪሲት ጽሩይ ስእሊ (Screenshot) ኣልዕሉ።",
    instr_step_4: "4. ምርግጋጽ፦ ነቲ ስእሊ ኣእቲኹም 'ምዝገባ ኣረጋግፅ' ጠውቁ። መርሚርና ብኢመይል ክንሕብረኩም ኢና።",
    instr_back_btn: 'ናብ ክፍልታት ተመለስ',
    room_1_type: "Single Room | በዓል ሓደ ክፍሊ",
    room_1_desc: "ንበይንኹም ንእትገሹ ኩሉ ዘመናዊ መገልገያታት ዘለዎ።",
    room_2_type: "Double Room | በዓል ሓደ ዓራት",
    room_2_desc: "ንሰብ ሓዳር ወይ ንኣዕሩኽ ዝኸውን ሰፊሕ ክፍሊ。",
    room_3_type: "VIP Suite | ቪኣይፒ ፍሉይ ክፍሊ",
    room_3_desc: "ምልኩዑን ምቾትን ዘለዎ ናይ ላዕለዋይ ደረጃ መዕረፊ。",
    book_this_room: "እዚ ክፍሊ ኣጽንሕ",
    full_name: "ሙሉእ ስም",
    email_address: "ኢመይል",
    phone_number: "ቁጽሪ ስልኪ",
    guest_count: "በዝሒ ጋይሽ",
    guest_1: "1 ጋይሽ (በዓል ሓደ)",
    guest_2: "2 ኣጋይሽ (በዓል ክልተ)",
    guest_3: "3 ኣጋይሽ",
    guest_4: "4+ ኣጋይሽ (ካብ 4 ንላዕሊ)",
    check_in: "መእተዊ ዕለት",
    check_out: "መውጽኢ ዕለት",
    check_availability: "ክፉት ምዃኑ ኣረጋግፅ",
    invoice_details: "ዝርዝር ሒሳብ",
    total_days: "በዝሒ መዓልቲ:", 
    days_unit: "መዓልታት",
    rate_per_night: "ዋጋ ዓራት:", 
    total_payment: "ጠቕላላ ክፍሊት:", 
    payment_method: "ናይ ክፍሊት መገዲ ይምረጹ",
    pay_instruct: "መምርሒ ክፍሊት",
    pay_description: "በጃኹም በዚ ዝስዕብ ሒሳብ ቁጽሪ ክፍሊትኩም ፈጽሙ。",
    account_name_label: "ሽም ሒሳብ:",
    upload_label: "ናይ ክፍሊት ሪሲት ኣእትዉ",
    upload_msg: "ክሊክ ብምግባር ወይ ድራግ ብምግባር ናይ ሪሲት ምስሊ የእትዉ",
    confirm_booking: "ምዝገባ ኣረጋግፅ",
    cancel_btn: "ሰርዝ",
    continue_btn: "ቀፅል", 
    confirm_and_pay: "ምዝገባ ኣረጋግፅን ክፈልን",
    processing: "ይሰርሕ ኣሎ...",
    uploading_image: "ሪሲት ይስቀል ኣሎ...",
    date_required_alert: "በጃኹም ቅድም ዕለት መርፁ!",
    date_invalid_alert: "ናይ መውጽኢ ዕለት ከም ብሓድሽ ይፈትሹ!",
    phone_invalid_alert: "⚠️ ቁፅሪ ስልኪ ልክዕ 10 ኣሃዛት ክኸውን ኣለዎ (ንኣብነት፡ 09xxxxxxxx)!", 
    room_available_status: "✓ እዚ ክፍሊ ትርፊ እዩ!",
    booking_success_alert: "ምዝገባኹም ብትኽክል ተላኢኹ ኣሎ!",
    booking_error_alert: "ዳታ ኣብ ምስናድ ጌጋ ኣጋጢሙ መስመር ኢንተርኔትኩም ኣረጋግጹ",
    image_error_alert: "ነቲ ሪሲት ናብ Imgbb ክንሰቕሎ ኣይተኻእለን። በጃኹም ደጊምኩም ፈትኑ",
    policy_title: 'ኣገደስቲ ሕግታት ሆቴል',
    rule_1: '1. መእተውን መውጽእን፦ መእተዊ ካብ ሰዓት 6:00 (ቀትሪ)፤ መውጽኢ ቅድሚ ሰዓት 6:00 (ቀትሪ)。',
    rule_2: '2. በዝሒ ሰብ፦ ኣብ በዓል ሓደ ክፍሊ ካብ 2 ሰብ ንላዕሊ ኣይፍቀድን。',
    rule_3: '3. መለለዪ፦ ኣጋይሽ ሕጋዊ መለለዪ ወረቐት ወይ ፓስፖርት ከቕርብ ኣለዎ?።',
    footer_location: "መቐለ፣ ኢትዮጵያ"
  }
};

// ==========================================
// 2. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  changeLanguage("ti"); 
  
  const bookingForm = document.getElementById("bookingForm");
  if(bookingForm) { 
    bookingForm.removeAttribute("onsubmit"); 
    bookingForm.addEventListener("submit", submitBooking); 
  }

  const guestCountInput = document.getElementById("guestCount");
  if (guestCountInput) { guestCountInput.addEventListener("change", validateGuestCount); }

  const openBtn = document.getElementById("open-instructions-btn");
  const closeBtn = document.getElementById("close-instructions-btn");
  const modal = document.getElementById("instructions-modal");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("active"); modal.style.display = "flex";   
      document.body.style.overflow = "hidden";
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active"); modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }
});

// ==========================================
// 3. API COMMUNICATION (FETCH)
// ==========================================
async function checkRoomAvailability() {
  const checkInVal = document.getElementById("checkIn").value;
  const checkOutVal = document.getElementById("checkOut").value;
  const statusLabel = document.getElementById("availabilityStatus");
  const lang = getCurrentLang();
  
  if (!checkInVal || !checkOutVal) {
    if (statusLabel) {
      statusLabel.innerText = translations[lang].date_required_alert;
      statusLabel.style.color = "red";
    }
    showCustomAlert(translations[lang].date_required_alert, "error");
    return;
  }
  
  const totalDays = calculateInvoiceSilent();
  if (totalDays <= 0) {
    const invalidMsg = translations[lang].date_invalid_alert;
    if (statusLabel) { statusLabel.innerText = invalidMsg; statusLabel.style.color = "red"; }
    showCustomAlert(invalidMsg, "error");
    return;
  }

  if (statusLabel) {
    statusLabel.innerText = lang === "ti" ? "🔄 ካብ ሰርቨር ይጻረ ዘሎ..." : "🔄 Checking Server...";
    statusLabel.style.color = "orange";
  }

  try {
    const params = new URLSearchParams();
    params.append("action", "checkDatesAvailability");
    params.append("roomType", selectedRoomType);
    params.append("checkIn", checkInVal);
    params.append("checkOut", checkOutVal);

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: params
    });

    const data = await response.json();
    handleAvailabilityResponse(data);

  } catch (error) {
    console.error("Availability check failure:", error);
    if (statusLabel) {
      statusLabel.innerText = "⚠️ Connection Error!";
      statusLabel.style.color = "red";
    }
    showCustomAlert("Network communication failure. Please try again.", "error");
  }
}

async function submitBooking(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const lang = getCurrentLang();

  if (!isRoomAvailableGlobal) {
    showCustomAlert(lang === "ti" ? "⚠️ በጃኹም ቅድም ክፍሊ ክፉት ምዃኑ ኣረጋግጹ!" : "⚠️ Please check room availability first!", "error");
    return false;
  }
  
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");
  const receiptFileInput = document.getElementById("receiptImage");
  const phoneInput = document.getElementById("phoneNumber"); 

  if (phoneInput) {
    const cleanedPhone = phoneInput.value.replace(/\D/g, ""); 
    if (cleanedPhone.length !== 10) {
      showCustomAlert(translations[lang].phone_invalid_alert, "error");
      phoneInput.focus();
      return false; 
    }
  }

  if (currentCalculatedTotal <= 0) {
    calculateInvoiceSilent();
    if (currentCalculatedTotal <= 0) {
      showCustomAlert(translations[lang].date_required_alert, "error");
      return false;
    }
  }
  
  if(submitBtn) submitBtn.disabled = true;
  if(btnText) btnText.innerText = translations[lang].uploading_image; 
  if(spinner) spinner.style.display = "inline-block";
  
  try {
    const formData = new URLSearchParams();
    formData.append("action", "createNewBooking");
    formData.append("fullName", document.getElementById("name").value);
    formData.append("email", document.getElementById("customerEmail").value);
    formData.append("phone", document.getElementById("phoneNumber").value);
    formData.append("roomType", selectedRoomType);
    formData.append("guests", document.getElementById("guestCount").value);
    formData.append("checkIn", document.getElementById("checkIn").value);
    formData.append("checkOut", document.getElementById("checkOut").value);
    formData.append("totalPayment", currentCalculatedTotal + " ETB");

    if (receiptFileInput && receiptFileInput.files.length > 0) {
      const file = receiptFileInput.files[0];
      const base64FileString = await convertFileToBase64(file);
      formData.append("receiptBase64", base64FileString);
    }

    if(btnText) btnText.innerText = translations[lang].processing; 

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    handleBookingSubmitResponse(result);

  } catch (error) {
    console.error("Transmission failure:", error);
    showCustomAlert(translations[lang].booking_error_alert, "error");
    if(submitBtn) submitBtn.disabled = false;
    if(spinner) spinner.style.display = "none";
    if(btnText) btnText.innerText = translations[lang].confirm_booking;
  }

  return false;
}

function handleAvailabilityResponse(response) {
  const statusLabel = document.getElementById("availabilityStatus");
  const submitBtn = document.getElementById("submitBtn");
  const lang = getCurrentLang();

  const isAvailable = response && (response.status === "available" || (response.status === "success" && response.available === true) || response.available === true);

  if (isAvailable) {
    isRoomAvailableGlobal = true;
    if (submitBtn) submitBtn.disabled = false; 
    if (statusLabel) {
      statusLabel.innerText = translations[lang].room_available_status;
      statusLabel.style.color = "green";
    }

    const totalDays = calculateInvoiceSilent();
    const ratePerNight = ROOM_PRICES[selectedRoomType] || 0;

    document.getElementById('lblTotalDays').innerText = translations[lang].total_days;
    document.getElementById('lblRoomPrice').innerText = translations[lang].rate_per_night;
    document.getElementById('lblTotalPayment').innerText = translations[lang].total_payment;
    document.getElementById('lblInvoiceTitle').innerHTML = `<i class="fas fa-file-invoice-dollar"></i> ${translations[lang].invoice_details}`;

    document.getElementById('invTotalDays').innerText = `${totalDays} ${translations[lang].days_unit}`;
    document.getElementById('invRoomPrice').innerText = `${ratePerNight.toFixed(2)} ETB`;
    document.getElementById('invTotalPayment').innerText = `${currentCalculatedTotal.toFixed(2)} ETB`;

    document.getElementById('modalConfirmBtn').innerText = translations[lang].continue_btn;
    document.getElementById('modalCancelBtn').innerText = translations[lang].cancel_btn;

    const btnText = document.getElementById('btnText');
    if (btnText) {
      btnText.innerText = `${translations[lang].confirm_and_pay} (${currentCalculatedTotal.toFixed(2)} ETB)`;
    }

    const invoiceModal = document.getElementById('invoiceModal');
    if (invoiceModal) invoiceModal.style.display = 'block';

  } else {
    isRoomAvailableGlobal = false;
    if (submitBtn) submitBtn.disabled = true; 

    let serverMsg = "";
    if (response) {
      serverMsg = lang === "ti" ? (response.message_ti || response.message) : (response.message_en || response.message);
    }
    if (!serverMsg) {
      serverMsg = lang === "ti" ? "❌ እዚ ክፍሊ በዘን መዓልታት ተታሒዙ እዩ!" : "❌ Sorry, this room is already occupied during these dates!";
    }
    
    if (statusLabel) {
      statusLabel.innerText = serverMsg;
      statusLabel.style.color = "red";
    }
    showCustomAlert(serverMsg, "error");
  }
}

function handleBookingSubmitResponse(res) {
  const lang = getCurrentLang();
  const submitBtn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");
  const btnText = document.getElementById("btnText");
  const bookingForm = document.getElementById("bookingForm");

  if(spinner) spinner.style.display = "none";
  if(submitBtn) submitBtn.disabled = false;

  if(res && res.status === "success") {
    showCustomAlert(translations[lang].booking_success_alert, "success");
    closeBox();
    if(bookingForm) bookingForm.reset();
    isRoomAvailableGlobal = false; 
  } else {
    showCustomAlert(translations[lang].booking_error_alert, "error");
  }
  
  if(btnText) {
    btnText.innerText = translations[lang].confirm_booking;
  }
}
window.handleBookingSubmitResponse = handleBookingSubmitResponse;

// ==========================================
// 4. DATE CONSTRAINTS & CALCULATIONS (FLATPICKR)
// ==========================================
function initDateConstraints() {
  const checkInElem = document.getElementById("checkIn");
  const checkOutElem = document.getElementById("checkOut");

  if (!checkInElem || !checkOutElem) {
    console.error("Flatpickr Error: checkIn or checkOut input fields not found in HTML!");
    return;
  }

  // Destroy if already exists
  if (checkInPickerInstance) checkInPickerInstance.destroy();
  if (checkOutPickerInstance) checkOutPickerInstance.destroy();

  // Initialize Check-Out
  checkOutPickerInstance = flatpickr(checkOutElem, {
    dateFormat: "Y-m-d",
    minDate: "today"
  });

  // Initialize Check-In
  checkInPickerInstance = flatpickr(checkInElem, {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: function(selectedDates) {
      if (selectedDates.length > 0) {
        let nextDay = new Date(selectedDates[0]);
        nextDay.setDate(nextDay.getDate() + 1);
        
        // Update Checkout minDate
        checkOutPickerInstance.set("minDate", nextDay);
        
        // Auto-open Checkout
        setTimeout(() => checkOutPickerInstance.open(), 100);
      }
      handleCheckOutOrInReset();
    }
  });
}

function handleCheckOutOrInReset() {
  isRoomAvailableGlobal = false;
  const submitBtn = document.getElementById("submitBtn");
  if(submitBtn) submitBtn.disabled = true;
  
  const statusLabel = document.getElementById("availabilityStatus");
  if (statusLabel) { statusLabel.innerText = ""; }

  calculateInvoiceSilent();
}

function calculateInvoiceSilent() {
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");
  if (!checkInInput || !checkOutInput) return 0;

  const checkInVal = checkInInput.value;
  const checkOutVal = checkOutInput.value;
  if (!checkInVal || !checkOutVal || !selectedRoomType) return 0;
  
  const p1 = checkInVal.split('-');
  const p2 = checkOutVal.split('-');
  
  const d1 = new Date(parseInt(p1[0]), parseInt(p1[1]) - 1, parseInt(p1[2]));
  const d2 = new Date(parseInt(p2[0]), parseInt(p2[1]) - 1, parseInt(p2[2]));
  
  const timeDiff = d2.getTime() - d1.getTime();
  const totalDays = Math.round(timeDiff / (1000 * 3600 * 24)); 
  
  const priceBox = document.getElementById("priceSummaryBox");
  const dispDays = document.getElementById("displayDays");
  const dispRate = document.getElementById("displayRate");
  const dispTotal = document.getElementById("displayTotal");

  if (totalDays > 0) {
    const rate = ROOM_PRICES[selectedRoomType] || 0;
    currentCalculatedTotal = totalDays * rate;
    if (priceBox) priceBox.style.display = "block";
    if (dispDays) dispDays.innerText = totalDays;
    if (dispRate) dispRate.innerText = rate;
    if (dispTotal) dispTotal.innerText = currentCalculatedTotal;
    return totalDays;
  } else {
    currentCalculatedTotal = 0;
    if (priceBox) priceBox.style.display = "none";
    return 0;
  }
}

function validateGuestCount() {
  const guestCountInput = document.getElementById("guestCount");
  if (!guestCountInput) return;
  const guestCount = parseInt(guestCountInput.value);
  const lang = getCurrentLang();

  if ((selectedRoomType.includes("Single") || selectedRoomType === "Single Room") && guestCount >= 3) {
    const alertMsg = lang === "ti" 
      ? "⚠️ ኣብ በዓል ሓደ ክፍሊ (Single Room) ካብ 2 ሰብ ንላዕሊ ኣይፍቀድን!" 
      : "⚠️ Maximum of 2 people allowed per single room!";
    showCustomAlert(alertMsg, "error");
    closeBox(); 
    const policySec = document.getElementById("policy-section");
    if(policySec) policySec.scrollIntoView({ behavior: "smooth", block: "center" });
    guestCountInput.value = "2";
  }
}

// ==========================================
// 5. UI, MODALS & HELPERS
// ==========================================
function bookRoom(roomType) {
  selectedRoomType = roomType;
  currentCalculatedTotal = 0;
  isRoomAvailableGlobal = false; 
  
  const submitBtn = document.getElementById("submitBtn");
  if(submitBtn) submitBtn.disabled = true;

  const roomTitleElem = document.getElementById("roomTitle");
  if (roomTitleElem) roomTitleElem.innerText = roomType;
  
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) bookingForm.reset();
  
  const priceBox = document.getElementById("priceSummaryBox");
  if(priceBox) priceBox.style.display = "none";
  
  const statusLabel = document.getElementById("availabilityStatus");
  if (statusLabel) {
    statusLabel.innerText = "";
    statusLabel.className = "";
  }
  
  initDateConstraints();
  
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.classList.add("active");
}

function closeBox() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.classList.remove("active");
}

// Global scope links
window.bookRoom = bookRoom;
window.closeBox = closeBox;
window.checkRoomAvailability = checkRoomAvailability;

function closeInvoiceModal() {
  const invoiceModal = document.getElementById('invoiceModal');
  if (invoiceModal) invoiceModal.style.display = 'none';
}
window.closeInvoiceModal = closeInvoiceModal;

function continueToForm() {
  closeInvoiceModal(); 
  const nameInput = document.getElementById('name');
  if (nameInput) nameInput.focus();
}
window.continueToForm = continueToForm;

function showCustomAlert(message, type) {
  const alertBox = document.getElementById('clientAlert');
  const alertMessage = document.getElementById('clientAlertMessage');
  const alertIcon = document.getElementById('clientAlertIcon');
  
  if(!alertBox || !alertMessage) { alert(message); return; }

  clearTimeout(alertTimeout);
  alertMessage.innerText = message;
  alertBox.classList.remove('hidden');
  alertBox.style.display = "flex"; 

  if (type === "error") {
    if(alertIcon) {
      alertIcon.className = "fas fa-exclamation-triangle client-alert-icon";
      alertIcon.style.color = "#ef4444"; 
    }
  } else {
    if(alertIcon) {
      alertIcon.className = "fas fa-check-circle client-alert-icon";
      alertIcon.style.color = "#10b981"; 
    }
  }
  alertTimeout = setTimeout(() => { closeClientAlert(); }, 5000);
}

function closeClientAlert() {
  const alertBox = document.getElementById('clientAlert');
  if(alertBox) { alertBox.classList.add('hidden'); alertBox.style.display = "none"; }
}
window.closeClientAlert = closeClientAlert;

function copyAccountNumber(textToCopy, elementRef) {
  navigator.clipboard.writeText(textToCopy).then(() => {
    const accountBox = (typeof elementRef === 'string') ? document.getElementById(elementRef) : elementRef;
    if (!accountBox) return;
    const icon = accountBox.querySelector('.copy-icon');
    accountBox.classList.add('copied');
    if(icon) icon.className = "fas fa-check-circle copy-icon"; 
    setTimeout(() => {
      accountBox.classList.remove('copied');
      if(icon) icon.className = "far fa-copy copy-icon";
    }, 2000);
  }).catch(err => console.error('Failed to copy: ', err));
}
window.copyAccountNumber = copyAccountNumber;

function togglePaymentDetails() {
  const checkedRadio = document.querySelector('input[name="payment_method"]:checked');
  if(!checkedRadio) return;
  const paymentMethod = checkedRadio.value;
  const cbeDetails = document.getElementById('cbeDetails');
  const telebirrDetails = document.getElementById('telebirrDetails');

  if (paymentMethod === 'cbe') {
    if(cbeDetails) cbeDetails.classList.add('active');
    if(telebirrDetails) telebirrDetails.classList.remove('active');
  } else if (paymentMethod === 'telebirr') {
    if(telebirrDetails) telebirrDetails.classList.add('active');
    if(cbeDetails) cbeDetails.classList.remove('active');
  }
}
window.togglePaymentDetails = togglePaymentDetails;

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
  });
}

// ==========================================
// 6. LOCALIZATION / LANGUAGE HANDLING
// ==========================================
function changeLanguage(lang) {
  document.documentElement.lang = lang;
  const elements = document.querySelectorAll("[data-key]");
  elements.forEach(elem => {
    const key = elem.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      if (elem.tagName === "INPUT" && elem.hasAttribute("placeholder")) {
        elem.placeholder = translations[lang][key];
      } else {
        elem.innerText = translations[lang][key];
      }
    }
  });
}
window.changeLanguage = changeLanguage;

function getCurrentLang() {
  return document.documentElement.lang || "ti";
}
