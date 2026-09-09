# FarmDirect Connect

ROLE / PERSONA

You are a senior full-stack software architect, mobile application developer, UI/UX designer, database architect, DevOps engineer, and product manager with 10+ years of experience building scalable agricultural, e-commerce, marketplace, and multilingual applications.

Your task is to design and develop a complete, production-ready mobile-first application that directly connects farmers with customers and bulk buyers, reducing unnecessary intermediaries and improving farmers' earnings while making agricultural products more accessible and affordable to customers.

Do not provide only theoretical explanations. Act as a professional development team and build the complete working application step-by-step.

The application must be simple enough for an uneducated or less digitally experienced farmer, and a busy or non-technical customer, to operate using voice guidance and a highly visual interface — on both sides of the marketplace.

PROJECT TITLE

FarmDirect – Direct Farmer-to-Customer Agricultural Marketplace

Alternative names can be suggested, but use "FarmDirect" as the working project name.

0. WHAT'S NEW IN THIS VERSION (Summary of Enhancements)

This version extends the original specification with:

Friendly, low-friction login/onboarding for both Farmers and Customers — OTP-first, PIN/biometric quick-login, guest browsing, and a "helper mode" for first-time users.

A full bidirectional Voice Assistant — previously voice guidance was farmer-only; it is now a first-class feature for customers too (voice search, voice ordering, voice complaint filing, voice help).

New interactive & engagement features: live price trends, weather-linked crop advisory, farmer trust score & badges, in-app chat/call, community farmer network, referral & loyalty program, subscription/recurring orders, crop calendar reminders, SOS/helpline button, AI FAQ chatbot, video crop verification, sustainability labels, and a "Learn" section with short farmer training videos.

Accessibility upgrades: adjustable font size, high-contrast/dark mode, one-hand mode, and a persistent floating mic button.

Everything below is written as one complete, self-contained build prompt you can hand to a development AI/team incrementally, step-by-step, exactly as before — nothing from the original scope was removed.

1. PROBLEM STATEMENT

Multiple intermediaries such as local traders, commission agents, wholesalers, and retailers often exist between farmers and final consumers.

Because of this:

Farmers receive a lower percentage of the final selling price.

Customers often pay higher prices.

Farmers may not know the actual market demand.

Farmers may not have easy access to customers.

Post-harvest damaged crops may go to waste even though they can still be useful for animal feed.

Customers may find it difficult to locate nearby farmers.

Farmers may not know about future bulk requirements.

There is limited transparency between farmers and customers.

Neither farmers nor customers may trust the platform enough to use it without hand-holding on their first few visits.

The proposed solution is a digital platform that directly connects:

FARMERS → CUSTOMERS

and also:

FARMERS → BULK BUYERS / FEED MILL OWNERS / POULTRY FARM OWNERS

The platform should allow farmers to register their crops and availability, while customers can discover crops, place orders, track nearby farmers, request bulk quantities, and report damaged/missing/misplaced deliveries — all guided, at every step, by voice and visual cues so no one feels lost.

2. CORE OBJECTIVE

Develop a mobile-friendly application that:

Allows farmers and customers to register easily with minimal friction.

Allows farmers to add available crops (by voice or form).

Records crop name, quantity, price, harvest period, availability date, location, etc.

Provides voice-assisted navigation for both farmers and customers.

Supports multiple Indian languages, spoken and written.

Allows customers to browse available crops, by touch or voice.

Allows customers to place orders, by touch or voice.

Allows customers to find nearby farmers using maps.

Supports bulk-order requests in advance.

Allows farmers to see future demand.

Provides a separate marketplace for damaged/post-harvest crops.

Allows feed mill owners and poultry farm owners to purchase suitable damaged crops.

Allows customers to report damaged/missing/wrong orders by uploading photographs (or describing the issue by voice).

Provides order tracking.

Provides notifications.

Provides an admin dashboard.

Stores data securely in the backend.

Has a very simple and accessible user interface, with adjustable text size and contrast.

Builds trust through visible badges, ratings, and transparent pricing.

Keeps both user types engaged through reminders, price alerts, and a light rewards system.

3. TARGET USERS

The application has four primary user types:

A. FARMER

Farmers can:

Register/login (voice-guided, OTP-based).

Select preferred language.

Add personal details.

Add farm location.

Add crops.

Specify quantity, price, harvest period, availability date.

Upload crop images or record a short crop video.

View customer demand.

Accept/reject orders.

Manage inventory.

View earnings and price trends for their crops.

Receive notifications and reminders.

Respond to bulk requests.

Chat or call a customer directly from an order.

View their trust score / badges and how to improve them.

Watch short "Learn" videos (best practices, using the app, post-harvest handling).

The farmer interface must be extremely simple. Avoid complicated forms wherever possible. Use large buttons, icons, voice instructions, minimal text, local language, audio confirmations, and image-based options.

B. CUSTOMER

Customers can now also:

Register/login with the same low-friction, OTP-first flow.

Browse and order entirely by voice if they choose ("Order 2 kg tomatoes from the nearest farmer").

Ask the voice assistant questions ("Is this maize fresh?", "When will my order arrive?").

File a complaint by describing the problem out loud instead of typing.

Subscribe to recurring deliveries (e.g., weekly vegetables) with one tap.

Set price-drop or availability alerts for a crop.

Rate and review a farmer, with a voice-to-text review option.

C. BULK BUYER / FEED MILL OWNER / POULTRY FARM OWNER

Same as original spec, plus: saved supplier lists, standing bulk requirement templates, and quality-inspection checklists before purchase.

D. ADMIN

Same as original spec, plus: moderation queue for AI-flagged suspicious listings, and a view of voice-assistant transcripts for debugging failed intents (anonymized, opt-in only).

4. FRIENDLY LOGIN & ONBOARDING (Farmer + Customer) — NEW / EXPANDED

Login must feel effortless for both a semi-literate farmer and a busy, impatient customer. No screen should require typing more than a phone number.

4.1 Unified First Screen

When anyone opens the app for the first time:

Large, illustrated screen: "Who are you?" with two big tappable cards — 🧑‍🌾 "I am a Farmer" and 🛒 "I am a Customer / Buyer".

A persistent floating 🎤 mic button in the corner reads the screen aloud and lets the user say "Farmer" or "Customer" instead of tapping.

4.2 Language Selection

Immediately after role selection: "Select Your Language" with large flag/script buttons (Telugu, Hindi, English, Tamil, Kannada, Marathi, Bengali, Malayalam, +more later).

Voice greets the user in the selected language right away, confirming: "You have selected Telugu. Is this correct?"

4.3 Phone + OTP Login (Primary Method — Both Roles)

Single field: phone number, large numeric keypad.

"Send Code" button (also voice-triggerable: "send my code").

6-digit OTP auto-read from SMS where platform permits (Android SMS autofill), reducing manual typing.

Voice reads back: "Please enter the 6-digit code we sent you."

On success: "Welcome back!" spoken aloud + confetti/checkmark animation.

4.4 Fast Repeat Login

After first successful login, offer: 4-digit PIN or fingerprint/face unlock for return visits, so the farmer/customer doesn't need OTP every time.

Always allow falling back to OTP if PIN/biometric fails.

4.5 Guest Browsing (Customer Only)

Customers may browse crops and nearby farmers without logging in.

Login/OTP is only required at checkout, bulk-requirement submission, or filing a complaint — this reduces drop-off and lets people "window shop" first.

4.6 First-Time Helper Mode

On a user's first 2–3 sessions, show a subtle "Tap here" pulsing hint on the next likely action, and let the voice assistant proactively offer: "Would you like me to guide you through adding your first crop?" This can be permanently dismissed with a "Don't show this again" toggle.

4.7 Registration Details (kept minimal)

Farmer: name, phone, language, farm location (auto-detected + adjustable pin), optional photo. Customer: name, phone, language, delivery/pickup location.

No password is required by default (OTP/PIN/biometric only). If the platform later requires passwords for web/admin, use standard secure hashing (bcrypt/argon2) — never plaintext.

4.8 Security Notes

Rate-limit OTP requests per phone number/IP.

Expire OTPs after a short window (e.g., 5–10 minutes).

JWT (short-lived access token + refresh token) issued after successful OTP/PIN verification.

Biometric/PIN unlock only unlocks a locally stored refresh token — it never bypasses server-side auth.

5. UNIVERSAL VOICE ASSISTANT (Farmer AND Customer) — EXPANDED

Voice guidance is no longer farmer-exclusive. Both roles get a consistent assistant, adapted to their tasks. The assistant supplements the UI — it never fully replaces visible buttons and text, per Rule #2 in Section 54.

5.1 Farmer Voice Flows (as before, retained)

Initial screen guidance

"Welcome. Please select what you want to do." → Add Crop / View Orders / View Demand / My Crops / Help — options are read aloud, large icons shown simultaneously.

Voice-Assisted Crop Entry (example flow)

Voice: "Which crop do you want to sell?" → Farmer: "Maize" → System: Crop = Maize Voice: "How much maize is available?" → Farmer: "500 kilograms" → Quantity = 500 kg Voice: "What is your price per kilogram?" → Farmer: "Twenty rupees" → Price = ₹20/kg Voice: "When will the crop be available?" → Farmer: "September 20" → Availability date recorded Voice: "Do you want to post this crop?" → Buttons: YES / NO → Voice: "Your maize has been successfully posted."

Additional farmer voice intents (new)

"How much did I earn this month?" → reads back earnings summary.

"Read my new orders." → reads pending order list aloud.

"Repeat that." / "Say it again." → repeats last spoken message.

"Change my price for tomatoes to twenty-five rupees." → direct voice-edit of an existing listing (with a spoken confirmation before saving).

5.2 Customer Voice Flows — NEW

Voice search & browse

Customer taps the mic and says: "Show me maize near me." Assistant: "I found 4 maize listings within 10 kilometers. The nearest is Ramesh, 4.2 kilometers away, ₹20 per kilogram. Do you want to see more, or open this one?"

Voice ordering

Customer: "Order 2 kilograms of tomatoes from Suresh." Assistant: "2 kilograms of tomatoes from Suresh costs 80 rupees. Should I add this to your cart?" → Customer: "Yes." → "Added. Would you like to check out now or keep shopping?"

Voice order status

Customer: "Where is my order?" Assistant: "Your order number 1025 was accepted by the farmer and is being prepared. Estimated delivery: tomorrow."

Voice complaint filing

Customer: "My tomatoes arrived damaged." Assistant: "I'm sorry to hear that. Which order was this — should I open your most recent order, number 1025?" → Customer: "Yes." → Assistant: "Please choose the problem type, or just tell me what happened." → Customer describes it → Assistant: "Would you like to take a photo now to attach to this complaint?" → guides to camera → "Your complaint has been submitted. You'll get updates in your language."

Voice bulk requirement

Customer: "I need 2000 kilograms of tomatoes on October 15th in Hyderabad." Assistant parses crop, quantity, date, location, reads it back for confirmation, then submits.

General help intents (both roles)

"Help" / "I'm stuck" → assistant explains the current screen in plain language.

"Call support" → opens the SOS/Helpline flow (Section 6.9).

"Switch to Hindi" → changes language mid-session without losing context.

5.3 Voice Architecture Notes

Use device-native speech recognition where possible, falling back to a cloud Speech-to-Text service (Google Cloud Speech, Azure Speech, or similar) matched to the selected language.

Text-to-Speech responses generated per-language; cache common phrases locally for offline/low-connectivity playback.

Every voice action shows a visual transcript + confirmation button — the user can always correct it by tapping instead of repeating themselves.

Voice recognition failures always fall back to visible buttons/forms; never leave the user stuck with only a retry option.

Store voice transcripts only as long as needed to resolve the request, and make transcript retention/opt-out settings visible to the user in Privacy Settings.

6. NEW INTERACTIVE & ENGAGEMENT FEATURES

These are additive features on top of the original marketplace, aimed at making the app feel alive, useful day-to-day, and worth opening even when the user isn't actively buying/selling.

6.1 Live Price Trends

Simple line/bar chart per crop showing recent average price in the customer's/farmer's region (e.g., "Tomato prices: 7-day trend").

Farmers see this before setting a price ("Most nearby farmers are selling maize at ₹18–22/kg").

Customers see it before buying, to judge fairness.

6.2 Weather-Linked Crop Advisory

Pull local weather (via a weather API) for the farmer's registered location.

Simple daily voice tip: "Rain expected tomorrow — consider delaying tomato harvest," or "Good weather for delivery today."

Not medical/financial advice — always phrased as general, non-binding guidance with a "consult local agri office for confirmation" note for anything high-stakes.

6.3 Farmer Trust Score & Badges

Score built from: on-time fulfillment rate, complaint rate, verification status, account age.

Badges: "Verified Farmer," "Fast Responder," "Top Rated," "5+ Successful Bulk Orders."

Shown on crop cards and farmer profile, visible to customers before ordering.

6.4 In-App Chat & Call

Lightweight text chat thread attached to each order (translated on the fly if farmer/customer use different languages, where a translation service is available).

"Call Farmer" / "Call Customer" button that uses a masked/proxy number where possible, so personal numbers aren't exposed directly.

6.5 Referral & Loyalty Program

"Invite a farmer/customer" with a shareable code; small non-cash reward (e.g., visibility boost for farmers, discount coupon for customers) for the first successful transaction after referral.

Simple points system for repeat customers, redeemable as small delivery-fee discounts — kept simple, not a full loyalty-wallet system in the MVP.

6.6 Subscriptions / Recurring Orders

Customers can set up "Every week, 2 kg tomatoes + 1 kg onions" and approve/skip each cycle with a single tap or voice command ("Skip this week").

Farmer sees recurring demand in their dashboard, helping with planning.

6.7 Price / Availability Alerts

Customer taps 🔔 on a crop: "Notify me when tomato price drops below ₹15/kg" or "Notify me when maize is available again."

6.8 Crop Calendar & Reminders

Farmer sets an expected harvest date; app sends a reminder a few days before: "Your tomatoes should be ready soon — do you want to list them now?"

6.9 SOS / Helpline Button

Always-visible small "Need Help?" button that connects to: FAQ chatbot → then, if unresolved, a request for a human support callback. Critical for building trust with first-time farmers.

6.10 AI FAQ Chatbot (Text + Voice)

Handles common questions ("How do I get paid?", "How do I cancel an order?", "Is my data safe?") using a scripted/decision-tree base with an LLM fallback for open-ended phrasing — clearly labeled as an assistant, not a human.

6.11 Video Crop Verification (Optional, Phase 3)

Farmer can record a short (10–15 sec) video alongside photos for higher-value or bulk listings, increasing buyer confidence.

6.12 Sustainability / Practice Labels

Optional self-declared tags farmers can add: "Organic (self-declared)," "No pesticide (self-declared)," "Traditional method." Clearly marked as self-declared unless a certification is uploaded and admin-verified, to avoid misleading claims.

6.13 "Learn" Section

Short, simple videos/audio clips for farmers: how to photograph a crop well, how post-harvest handling reduces damage, how the payment/order cycle works. Available offline once downloaded.

6.14 Ratings & Reviews (Voice-Enabled)

After order completion, customer is prompted: "How was your experience? You can say it out loud or tap a star rating." Voice reviews are transcribed and (optionally) translated for the farmer.

6.15 Accessibility Settings Panel

Font size slider, high-contrast/dark mode toggle, one-hand reachability mode (moves key actions to thumb zone), and a "always show captions for voice replies" toggle for hearing-impaired users.

7. HOME SCREEN

Farmer Home

🌾 Add Crop 📦 My Crops 🛒 Orders 📢 Customer Demand 📊 My Earnings & Price Trends 📍 My Location 🌦️ Weather Tip 🏅 My Trust Score 🎓 Learn 🔔 Notifications ❓ Help / SOS

Customer Home

🎤 Voice Search (persistent) 🔎 Search Crops 🌾 Available Crops 📍 Nearby Farmers 🛒 My Cart 📦 My Orders 🔁 My Subscriptions 📢 Bulk Requirement ⭐ Rate a Farmer ⚠️ Report Problem 🔔 Notifications ❓ Help / SOS

8. CROP MARKETPLACE

Each crop card should contain: image, crop name, farmer name + trust badge, available quantity, price (with a small "vs. area average" indicator), location, harvest date, distance from customer, availability status.

Example:

MAIZE  🏅 Verified Farmer

Available: 500 kg

Price: ₹20/kg  (area average: ₹21/kg)

Farmer: Ramesh

Distance: 4.2 km

Harvest: September 2026

[BUY NOW]   [🎤 Ask about this crop]

9. NEARBY FARMER FEATURE

Integrate Google Maps. Customer sees nearby farmers as markers; tapping shows name, crops, quantity, price, distance, and a chat/call option. Use geolocation carefully — never expose a farmer's exact private home location unnecessarily; prefer an approximate farm/business location, adjustable by the farmer.

10. LOCATION-BASED CROP SEARCH

Text or voice search: "Maize near me," "Tomatoes within 10 km." Filters: distance, price, crop, quantity, availability, harvest date. Sort by: nearest, lowest price, highest availability, recently added, highest rated farmer.

11. DAMAGED / POST-HARVEST CROP MARKETPLACE

Separate "Post-Harvest / Secondary Market" section for feed mill owners, poultry farm owners, livestock farms, and other permitted agricultural buyers.

DAMAGED MAIZE

Quantity: 1000 kg

Condition: Post-harvest damaged

Intended use: Animal feed

Price: ₹8/kg

Location: 5 km away

[CONTACT / BUY]

Safety for Damaged Crops

Condition categories: Minor damage, Moisture damage, Broken grains, Quality downgrade, Not suitable for human consumption, Requires inspection. Add warnings; allow buyer inspection/approval; prevent obviously unsafe/contaminated products from being marketed as animal feed; admin moderation queue for flagged listings.

12. BULK ORDER / FUTURE DEMAND FEATURE

Customers/businesses announce requirements ahead of time (crop, quantity, required date, location, purpose). Visible to suitable farmers, who can Accept / Express Interest / Contact / Estimate Availability. Statuses: Requirement Posted → Farmer Interested → Supply Confirmed → Order Confirmed. Never promise supply unless actually confirmed.

Short-Term Crop Planning

For short-cycle crops, show potential demand to farmers without promising a guaranteed order.

13. ORDER MANAGEMENT

States: Order Placed → Payment Pending → Payment Confirmed → Farmer Accepted → Preparing → Ready for Pickup/Delivery → Out for Delivery → Delivered → Completed. Cancellation: Cancellation Requested → Cancelled → Refund Initiated → Refund Completed.

14. DAMAGED / WRONG / MISSING ORDER REPORTING

"Report a Problem" flow: select order → problem type (damaged/wrong/missing/misplaced/poor quality/other) → photo upload (or voice-guided camera prompt) → description (typed or spoken) → submit → Complaint ID generated → admin review → farmer notified where appropriate → resolution → customer notified.

15. IMAGE & VIDEO UPLOAD

Crop images, optional short crop videos, farm images, delivery-issue images. Validate file type/size/dimensions; compress before upload; use cloud/object storage.

16. ORDER TRACKING

Customer sees a simple checklist: Farmer accepted ✓ → Preparing ✓ → Ready ✓ → Out for delivery ✓ → Delivered ✓. Show delivery location only when appropriate, with privacy controls.

17. INVENTORY MANAGEMENT

Simple per-crop stock view; auto-decrements on purchase; backend is authoritative — prevent overselling unless a listing is explicitly marked pre-order/future supply.

18. PRICE MANAGEMENT

Support units: kg, gram, quintal, tonne, litre, piece, basket, crate — normalized internally for calculations and for the price-trend charts (Section 6.1).

19. PAYMENTS

Razorpay/UPI or another legally supported Indian gateway. Support UPI, cards, net banking, wallets. Never store raw card data; use gateway tokens; payment status confirmed server-side via webhook, never trusted from the client.

20. NOTIFICATIONS

Farmer: new order, bulk demand, order accepted/cancelled, payment received, customer complaint, crop-availability/harvest reminder, weather tip, price-trend alert, trust-score update. Customer: order confirmed/accepted/dispatched/delivered/completed, complaint update, bulk-request response, subscription reminder, price/availability alert.

21. MULTILINGUAL SUPPORT

i18n from day one — no hard-coded UI strings. Translation files per language (en.json, te.json, hi.json, ta.json, kn.json, mr.json, bn.json, ml.json), architecture open to adding more languages later, including for voice-assistant prompts and TTS responses.

22. ACCESSIBILITY

Large touch targets, simple icons, high contrast/dark mode, adjustable font size, minimal text, voice instructions with captions, confirmation messages, one-hand mode, one primary action per screen, no overloaded menus.

23. DATABASE DESIGN

Entities: User, FarmerProfile, CustomerProfile, Crop, CropInventory, Order, OrderItem, Payment, BulkRequirement, BulkResponse, Complaint, ComplaintImage, Notification, Location, Language, Review, Category, DamagedCropListing, Delivery, AuditLog, TrustScore, Badge, Subscription, PriceHistory, Alert, VoiceTranscriptLog (opt-in, anonymized), SupportTicket.

Relationships flow: User → Farmer/CustomerProfile → Crop → CropInventory → Order → OrderItem, with side relations to Payment, Complaint, BulkRequirement, Subscription, and TrustScore/Badge.

24. USER ROLES

FARMER, CUSTOMER, BULK_BUYER, FEED_MILL_OWNER, POULTRY_FARM_OWNER, ADMIN, SUPPORT_AGENT (new — handles SOS/helpline escalations). Role-based permissions throughout.

25. AUTHENTICATION

Phone number + OTP as primary; PIN/biometric quick-login as secondary (Section 4); JWT access + refresh tokens; secure password hashing only if a password path is added for web/admin; login, registration, OTP verification, logout, session/token management, password reset (admin/web only).

26. ADMIN DASHBOARD

View/verify users, manage crops/categories, monitor orders/complaints, manage damaged-crop listings and bulk requirements, view transactions/analytics, suspend fraudulent accounts, moderate listings, review AI-flagged content, manage support tickets, review anonymized voice-assistant failure logs to improve intent recognition.

27. ANALYTICS

Totals for farmers, customers, crops, orders (completed/cancelled), transaction value; most sold/demanded crops; average price; bulk-requirement counts; complaint stats; farmer participation; customer activity; voice-assistant usage rate; subscription retention; referral conversion. Use charts where appropriate.

28. SECURITY REQUIREMENTS

HTTPS, secure auth, authorization, input validation, rate limiting, API validation, secure file upload, injection protection, XSS protection, CORS configuration, environment variables, secure API keys, server-side payment verification, audit logs, RBAC. Never expose DB credentials, API secrets, payment secrets, or JWT secrets in frontend code. Voice transcripts treated as sensitive data with clear retention/opt-out.

29. RECOMMENDED TECHNOLOGY STACK

Frontend (mobile): React Native with Expo (preferred) or Flutter if justified. TypeScript, React Navigation, Camera, Location, Notifications, Speech services. Backend: Node.js, Express.js, TypeScript, REST API. Database: MongoDB with Mongoose. Auth: JWT + OTP-based, PIN/biometric for quick login. Maps: Google Maps API/SDK — geolocation, markers, nearby search, distance calc. Storage: Cloudinary / AWS S3 / Firebase Storage (pick one, explain why). Voice: Native Android speech recognition + Google Cloud Speech / Azure Speech for language coverage; matching TTS service. Weather: A general-purpose weather API (e.g., OpenWeatherMap) for the advisory feature. Notifications: Firebase Cloud Messaging. Payments: Razorpay or another appropriate Indian gateway. Chat: Lightweight in-house chat over WebSockets, or a managed chat SDK if preferred. Deployment: Expo/EAS (mobile), Render/Railway/AWS/Azure (backend), MongoDB Atlas (database).

30. APPLICATION ARCHITECTURE

Mobile Application

        |

        v

     API Layer

        |

        v

Authentication Middleware

        |

        v

   Business Logic

        |

        ├── User Service

        ├── Farmer Service

        ├── Crop Service

        ├── Order Service

        ├── Bulk Demand Service

        ├── Complaint Service

        ├── Payment Service

        ├── Notification Service

        ├── Location Service

        ├── Voice Intent Service      (NEW)

        ├── Trust/Badge Service       (NEW)

        ├── Subscription Service      (NEW)

        ├── Price-Trend Service       (NEW)

        └── Support/SOS Service       (NEW)

        |

        v

     MongoDB

        |

        ├── Users, Farmers, Crops, Orders, Payments,

        ├── Complaints, BulkRequirements,

        └── TrustScores, Subscriptions, PriceHistory, SupportTickets

External Services: Google Maps, Speech-to-Text, Text-to-Speech,

Weather API, Cloud Storage, Payment Gateway, Firebase Notifications

31. UI/UX DESIGN

Clean agricultural theme: friendly, simple, trustworthy, rural-friendly, modern, accessible — never resembling a complicated banking app. Persistent floating mic button on every screen for both roles.

Farmer bottom navigation: Home | My Crops | Orders | Demand | Profile Customer bottom navigation: Home | Search | Cart | Orders | Profile

32. ONBOARDING FLOW (Updated)

Farmer

Open app → "Who are you?" (Farmer) → Select Language → Voice introduction → Phone number → OTP → Name → Farm location → Optional profile photo → Set PIN/biometric (optional) → Main dashboard (with first-time helper offer).

Customer

Open app → "Who are you?" (Customer) → Select Language → Browse as guest (optional) → Phone number → OTP (only required at checkout/complaint/bulk-request) → Name → Location → Set PIN/biometric (optional) → Main dashboard.

33. CROP POSTING FLOW

Farmer Home → Add Crop → Select/Speak Crop → Quantity → Price (with area-average shown) → Harvest period → Availability date → Crop image/video → Location → Review → Confirm → Crop published → Customer marketplace updated → Farmer notified of price-trend context.

34. CUSTOMER PURCHASE FLOW

Customer Home → Available Crops (or Voice Search) → Select Crop → View Details/Trust Badge → Select Quantity → Add to Cart → Address/Pickup → Payment → Order Confirmed → Farmer Notified → Farmer Accepts → Preparation → Delivery/Pickup → Customer Receives → Rate & Review (voice-enabled) → Order Completed.

35. BULK REQUIREMENT FLOW

Customer/Business Buyer → Bulk Requirement (voice or form) → Select Crop → Enter Quantity → Required Date → Location → Submit → Suitable Farmers Notified → Farmers Express Interest → Customer Reviews Farmers (with trust badges) → Supply Confirmed → Order Created.

36. DAMAGED CROP FLOW

Farmer → My Crops → Mark as Post-Harvest/Damaged → Select Condition → Upload Image → Enter Quantity/Price → Specify Intended Use → Submit → Admin/quality moderation if required → Secondary Marketplace → Feed/Poultry Buyer Views → Buyer Orders.

37. COMPLAINT FLOW

Customer → My Orders → Select Order → Report Problem (typed or spoken) → Choose Problem Type → Upload Photograph → Description → Submit → Complaint ID Generated → Admin Review → Farmer/Bearer Notified → Resolution → Customer Notified.

38. API DESIGN

POST   /api/auth/register

POST   /api/auth/login

POST   /api/auth/verify-otp

POST   /api/auth/pin-login

GET    /api/crops

POST   /api/crops

GET    /api/crops/:id

PUT    /api/crops/:id

DELETE /api/crops/:id

GET    /api/crops/nearby

GET    /api/crops/price-trend/:cropName

POST   /api/orders

GET    /api/orders

GET    /api/orders/:id

PUT    /api/orders/:id/status

POST   /api/bulk-requirements

GET    /api/bulk-requirements

POST   /api/bulk-requirements/:id/respond

POST   /api/complaints

GET    /api/complaints

POST   /api/uploads

GET    /api/farmers/nearby

GET    /api/farmers/:id/trust-score

GET    /api/notifications

POST   /api/payments/create

POST   /api/payments/webhook

POST   /api/voice/intent

POST   /api/subscriptions

GET    /api/subscriptions

POST   /api/alerts

GET    /api/weather/advisory

POST   /api/support/ticket

Design the final API structure properly rather than blindly copying this list.

39. VALIDATION

Crop name cannot be empty. Quantity/price must be positive. Availability/required dates must be valid. Customers cannot order more than available inventory. Farmers cannot edit another farmer's crop. Customers cannot access another customer's private order information. Only authorized users can submit complaints for their own orders. Voice-parsed values must pass the same validation as typed values before saving.

40. ERROR HANDLING

Never show raw technical errors ("MongoServerError"). Show friendly messages instead ("Something went wrong. Please try again."). Provide voice error messages where possible, e.g., "We could not understand the crop name. Please try again," with an immediate visible fallback (list of common crops to tap).

41. OFFLINE / LOW CONNECTIVITY SUPPORT

Cache language resources, basic UI, and common voice-assistant phrases. Save unfinished crop entries locally; retry failed uploads; show connection status; sync when internet returns. Never claim a crop is published, an order is placed, or a complaint is submitted until the backend confirms it.

42. PERFORMANCE

Fast startup, compressed images, lazy loading, pagination, API caching, efficient map loading, minimal unnecessary animation, avoid huge bundles — optimized for low-end Android devices.

43. TRUST AND TRANSPARENCY

Farmer/customer verification badges, trust score, ratings/reviews, order history, transparent pricing with area-average comparison, clear quantity/unit info, clear delivery charges, complaint mechanism, self-declared sustainability labels clearly marked as such unless admin-verified.

44. FUTURE AI FEATURES

Architected for later addition: crop disease detection from image, crop quality classification, price prediction, demand prediction, an expanded voice chatbot, crop recommendation, harvest prediction, personalized recommendations. Do not implement unnecessary AI features in the MVP unless they add clear value.

45. MVP PRIORITY

Phase 1 – Essential

Farmer & customer registration (friendly login, Section 4), language selection, dashboards, crop posting, marketplace, search, orders, inventory, basic location, basic notifications.

Phase 2

Voice-assisted interface for both roles, multilingual voice, Google Maps, nearby farmers, bulk requirements, damaged crop marketplace, complaint/photo reporting, trust score/badges, price trends, in-app chat.

Phase 3

Payments, advanced analytics, ratings, delivery tracking, subscriptions, alerts, weather advisory, referral/loyalty, video crop verification, AI features, advanced recommendations.

Do not attempt to build every advanced feature before the basic marketplace works.

46. PROJECT FOLDER STRUCTURE

farmdirect/

│

├── mobile/

│   ├── app/

│   ├── components/

│   ├── screens/

│   ├── navigation/

│   ├── services/

│   ├── hooks/

│   ├── context/

│   ├── assets/

│   ├── i18n/

│   ├── voice/          (NEW: intent parsing, TTS/STT helpers)

│   ├── utils/

│   └── types/

│

├── server/

│   ├── src/

│   │   ├── controllers/

│   │   ├── models/

│   │   ├── routes/

│   │   ├── middleware/

│   │   ├── services/

│   │   │   ├── voiceIntentService.ts   (NEW)

│   │   │   ├── trustScoreService.ts    (NEW)

│   │   │   ├── subscriptionService.ts  (NEW)

│   │   │   ├── priceTrendService.ts    (NEW)

│   │   │   └── weatherService.ts       (NEW)

│   │   ├── utils/

│   │   ├── config/

│   │   └── app.ts

│   │

│   └── package.json

│

├── admin/

│   ├── src/

│   └── package.json

│

├── README.md

└── .env.example

47. ENVIRONMENT VARIABLES

MONGODB_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

GOOGLE_MAPS_API_KEY=

CLOUD_STORAGE_KEY=

PAYMENT_KEY=

PAYMENT_SECRET=

FIREBASE_CONFIG=

SPEECH_TO_TEXT_KEY=

TEXT_TO_SPEECH_KEY=

WEATHER_API_KEY=

Never hard-code secrets.

48. TESTING

Authentication: registration, login, OTP, PIN/biometric login. Crops: add/edit/delete/search, inventory, price-trend calculation. Orders: place/accept/reject/cancel/complete. Bulk orders: create requirement, farmer response. Complaints: create, upload image, admin resolution, voice-filed complaint. Voice: intent parsing accuracy per language, fallback-to-visual behavior on recognition failure. Subscriptions/Alerts: create, trigger, skip a cycle. Security: unauthorized API access, invalid input, role restrictions.

49. IMPORTANT PRODUCT RULES

Never assume every farmer — or every customer — is technologically experienced.

Voice assistance supplements the UI; it never fully replaces it.

Every important voice action must have a visual confirmation.

Never expose sensitive farmer or customer information.

Never expose exact private addresses unnecessarily.

Never trust client-side payment confirmation.

Never allow customers to purchase unavailable inventory.

Never advertise unsafe damaged crops as animal feed.

Do not promise future crop supply unless it is actually confirmed.

Keep both the farmer and customer workflows extremely simple.

Use local languages throughout, including voice.

Design primarily for Android/mobile devices.

Make the backend authoritative for inventory and order state.

Validate every user input, including voice-parsed input.

Handle poor internet connectivity gracefully.

Login must never require more than a phone number to get started.

Any AI/voice/chatbot feature must be clearly labeled as automated, not a human.

50. DEVELOPMENT INSTRUCTIONS

Do NOT generate the entire project as one enormous response. Build incrementally, in this order:

Complete architecture

Database schema/models

Backend project setup

Authentication (OTP + PIN/biometric)

Farmer APIs

Crop marketplace

Customer APIs

Order management

Inventory

Maps/location

Bulk requirements

Damaged crop marketplace

Complaint/photo reporting

Multilingual system

Voice interaction (farmer + customer)

Trust score, badges, price trends, weather advisory

Notifications

Subscriptions, alerts, referral/loyalty

Payments

Admin dashboard

Testing

Deployment

After each step: explain what was implemented, provide complete code with clear file paths, explain how it works, give installation commands and testing instructions, identify required environment variables, include all necessary imports, ensure the code is executable, and keep prior architecture consistent.

51. CODE QUALITY RULES

Use TypeScript, proper types/interfaces, modular architecture, reusable components, environment configuration, validation, error handling, auth/authorization middleware, logging, clean naming, and comments only where useful. Avoid duplicate code, hard-coded secrets, huge components, unnecessary dependencies, fake API responses, or placeholder functions presented as complete. If an external API requires credentials, clearly mark where they must be added.

52. DEMO MODE

Farmers: Ramesh – Maize, Suresh – Tomatoes, Lakshmi – Rice. Customers: Customer 1, Customer 2. Bulk buyer: ABC Poultry Farm.

Include realistic sample crop listings, a sample price-trend history, a sample trust-score/badge set, and a sample subscription. Clearly separate seed/demo data from production data.

53. FINAL EXPECTED USER EXPERIENCE

Scenario 1: A farmer opens the app, picks "I am a Farmer," selects Telugu, and the app speaks instructions in Telugu. He taps "Add Crop," says "Maize," gives quantity and price by voice, confirms, and the crop is stored. A customer opens the app, browses as a guest, searches "maize near me" by voice, sees nearby farmers ranked by distance and trust badge, orders 50 kg, logs in via OTP only at checkout, pays, and tracks the order. If it arrives damaged, she says "my tomatoes arrived damaged" to the voice assistant, which guides her through filing a complaint with a photo. Admin reviews it.

Scenario 2: A farmer lists damaged post-harvest maize under the Secondary/Feed Market; a feed mill buyer finds and purchases it, and the farmer earns value instead of wasting the crop.

Scenario 3: A customer needs 2,000 kg of a short-duration crop after 30 days; she creates a bulk requirement by voice; nearby farmers are notified, express interest, and once confirmed, the platform creates the corresponding order/commitment.

Scenario 4 (new): A returning customer opens the app, unlocks with a fingerprint instead of OTP, sees a price-drop alert for tomatoes she'd flagged earlier, and reorders her weekly vegetable subscription with one tap.

54. IMPORTANT DEVELOPMENT APPROACH

Think like a real startup development team, not a screens-only exercise. The application must have Frontend + Backend + Database + Authentication + APIs + Business logic + Maps + Voice (both roles) + Image/video uploads + Notifications + Orders + Inventory + Bulk requirements + Complaints + Trust/engagement features + Admin management — all major features must actually communicate with the backend. Do not create fake buttons that do nothing.

55. RESPONSE FORMAT

For every development step, use this format:

STEP X – [FEATURE NAME]

Objective

Architecture

Files

Code

Installation

Configuration

Database

API

Testing

Expected Result

Next Step

56. FIRST RESPONSE REQUIREMENT

Do NOT immediately dump thousands of lines of code. First provide:

Final system architecture

Technology stack

Database ER/data model

User roles

Complete feature/module list (including all engagement features in Section 6)

Application navigation structure

API architecture

Voice architecture (farmer + customer)

Map architecture

Security architecture

Development phases

Project folder structure

Then ask the development process to proceed with:

"STEP 1 – Backend + Database Foundation"

When proceeding to each step, provide working code that can be copied directly into the project.

FINAL GOAL

Build a complete, mobile-first agricultural marketplace that connects farmers directly with customers and bulk buyers:

REDUCE UNNECESSARY INTERMEDIARIES → IMPROVE FARMER EARNINGS → PROVIDE FAIRER PRICES TO CUSTOMERS → REDUCE POST-HARVEST WASTE → CONNECT LOCAL SUPPLY WITH LOCAL DEMAND → BUILD TRUST AND KEEP BOTH SIDES ENGAGED THROUGH SIMPLE, VOICE-GUIDED, ACCESSIBLE DESIGN

The application must be practical, scalable, secure, multilingual, voice-assisted (for both farmers and customers), location-aware, engaging, and simple enough for users with limited digital literacy to use confidently from their very first login.

Treat this as a real-world startup/product development project rather than a simple college demo. Begin with the complete architecture and database design, then proceed incrementally through the implementation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d97a6dd6-373c-4dd7-afb9-a05eb3095c7c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
