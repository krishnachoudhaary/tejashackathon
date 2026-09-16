-- ============================================================
-- EventHub Seed Data (MySQL)
-- Realistic Tier-2 & Tier-3 City Vendors & Demo Accounts
-- ============================================================

USE eventhub_db;

-- 1. Demo Users (Password: Password123!)
-- Hash: scrypt:32768:8:1$HoQZr3lunIc3roOJ$538b05106a9b865ab8ca786c592ee5aa3991157fa2f0875aae1ba84a2df4c6bfaa70fa7f429f827941b08c0dbffeb86be1f062f96e3cbf108c46be8705a74423
INSERT INTO users (id, name, email, password_hash, phone, role, city) VALUES
(1, 'Aarav Sharma', 'demo@eventhub.com', 'scrypt:32768:8:1$HoQZr3lunIc3roOJ$538b05106a9b865ab8ca786c592ee5aa3991157fa2f0875aae1ba84a2df4c6bfaa70fa7f429f827941b08c0dbffeb86be1f062f96e3cbf108c46be8705a74423', '+91 9876543210', 'CUSTOMER', 'Patna'),
(2, 'Patliputra Grand Palace', 'vendor@eventhub.com', 'scrypt:32768:8:1$HoQZr3lunIc3roOJ$538b05106a9b865ab8ca786c592ee5aa3991157fa2f0875aae1ba84a2df4c6bfaa70fa7f429f827941b08c0dbffeb86be1f062f96e3cbf108c46be8705a74423', '+91 9123456780', 'VENDOR', 'Patna'),
(3, 'Priya Verma', 'priya.customer@eventhub.com', 'scrypt:32768:8:1$HoQZr3lunIc3roOJ$538b05106a9b865ab8ca786c592ee5aa3991157fa2f0875aae1ba84a2df4c6bfaa70fa7f429f827941b08c0dbffeb86be1f062f96e3cbf108c46be8705a74423', '+91 9876500001', 'CUSTOMER', 'Gaya'),
(4, 'Admin Manager', 'admin@eventhub.com', 'scrypt:32768:8:1$HoQZr3lunIc3roOJ$538b05106a9b865ab8ca786c592ee5aa3991157fa2f0875aae1ba84a2df4c6bfaa70fa7f429f827941b08c0dbffeb86be1f062f96e3cbf108c46be8705a74423', '+91 9999999999', 'ADMIN', 'Patna')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Vendors Data (15+ Vendors in Tier-2/Tier-3 Bihar regions)
INSERT INTO vendors (id, user_id, business_name, category, city, address, description, starting_price, price_unit, rating, review_count, is_verified, contact_phone, contact_email, supported_event_types) VALUES
(1, 2, 'Patliputra Grand Palace & Banquet', 'Venue', 'Patna', 'Bailey Road, Near Saguna More, Patna', 'Premier luxury banquet hall featuring grand chandeliers, lush green lawn, central air conditioning, and guest accommodations.', 70000.00, 'per day', 4.8, 42, TRUE, '+91 9835012345', 'info@patliputragrand.com', 'Wedding,Engagement,Corporate,Anniversary,Birthday'),
(2, NULL, 'Magadh Heritage Lawn & Resort', 'Venue', 'Gaya', 'Bodhgaya Road, Gaya', 'Eco-friendly heritage resort venue with spacious open lawns, modern banquet hall, and deluxe guest suites.', 65000.00, 'per day', 4.7, 31, TRUE, '+91 9431011223', 'contact@magadhheritage.com', 'Wedding,Engagement,Reception,Corporate'),
(3, NULL, 'Royal Mithila Celebrations', 'Venue', 'Muzaffarpur', 'Club Road, Mithanpura, Muzaffarpur', 'Spacious elegant venue with modular seating, bridal suites, dedicated dining hall, and ample secure parking.', 55000.00, 'per day', 4.6, 28, TRUE, '+91 9304055667', 'bookings@royalmithila.com', 'Wedding,Birthday,Anniversary,Engagement'),
(4, NULL, 'Silk City Heights Banquet', 'Venue', 'Bhagalpur', 'Tilkamanjhi Chowk, Bhagalpur', 'Modern multi-storey AC banquet hall offering state-of-the-art acoustics, stage decor compatibility, and guest rooms.', 50000.00, 'per day', 4.5, 19, TRUE, '+91 9122334455', 'events@silkcitybanquet.com', 'Wedding,Corporate,Birthday,Engagement'),
(5, NULL, 'Rasoi Ghar Gourmet Caterers', 'Catering', 'Patna', 'Boring Canal Road, Patna', 'Specialists in authentic North Indian, Maithili traditional delicacies, Mughlai dishes, live counters, and bespoke dessert spreads.', 90000.00, 'for 250 guests', 4.9, 64, TRUE, '+91 9835123499', 'rasoighar.bihar@gmail.com', 'Wedding,Engagement,Corporate,Birthday,Anniversary'),
(6, NULL, 'Bhojan Shala Royal Feast', 'Catering', 'Gaya', 'Civil Lines, Gaya', 'Pure vegetarian and multi-cuisine catering service with hygienic preparation, royal buffet setups, and live chaat counters.', 75000.00, 'for 200 guests', 4.7, 39, TRUE, '+91 9431876543', 'bhojanshala@gmail.com', 'Wedding,Anniversary,Birthday,Engagement'),
(7, NULL, 'Vaishali Royal Decorators', 'Decoration', 'Patna', 'Kankarbagh Main Road, Patna', 'Artistic thematic wedding stage design, floral mandap installations, LED tunnel entries, and elegant ambient mood lighting.', 40000.00, 'per event', 4.8, 51, TRUE, '+91 9835887766', 'vaishalidecor@gmail.com', 'Wedding,Engagement,Anniversary,Birthday'),
(8, NULL, 'Utsav Creation & Theme Decors', 'Decoration', 'Muzaffarpur', 'Aghoria Bazar, Muzaffarpur', 'Budget-friendly and premium floral decors, balloon installations for birthdays, and customized theme setups.', 30000.00, 'per event', 4.5, 23, TRUE, '+91 9304998877', 'utsavcreations@gmail.com', 'Wedding,Birthday,Engagement,Anniversary'),
(9, NULL, 'Drishti Cinematic Wedding Studio', 'Photography', 'Patna', 'Ashok Rajpath, Patna', 'Candid wedding photography, cinematic 4K drone cinematography, traditional video coverage, and customized luxury photobooks.', 35000.00, 'per 2-day event', 4.9, 58, TRUE, '+91 9835443322', 'drishticinema@gmail.com', 'Wedding,Engagement,Birthday,Corporate'),
(10, NULL, 'Moments Lens Photography', 'Photography', 'Bhagalpur', 'Zero Mile, Bhagalpur', 'Passionate photography crew capturing authentic smiles, candid rituals, pre-wedding couple shoots, and cinematic teasers.', 28000.00, 'per event', 4.6, 27, TRUE, '+91 9122556677', 'momentslens@gmail.com', 'Wedding,Engagement,Birthday,Anniversary'),
(11, NULL, 'BeatDrop Sound & DJ Crew', 'DJ', 'Patna', 'Exhibition Road, Patna', 'High-energy DJ setups with intelligent moving beam lights, smoke fog machines, LED dance floors, and versatile track mixing.', 25000.00, 'per night', 4.7, 46, TRUE, '+91 9835778899', 'beatdropdj.patna@gmail.com', 'Wedding,Sangeet,Birthday,Corporate,Anniversary'),
(12, NULL, 'Rhythm Beats DJ & Lighting', 'DJ', 'Gaya', 'GB Road, Gaya', 'Professional sound reinforcement, laser light shows, Punjabi dhol accompaniment, and Bollywood club mixes for sangeet & baraat.', 20000.00, 'per night', 4.5, 33, TRUE, '+91 9431445566', 'rhythmbeats.gaya@gmail.com', 'Wedding,Sangeet,Birthday'),
(13, NULL, 'Roopam Bridal Makeover Studio', 'Makeup', 'Patna', 'Boring Road, Patna', 'Certified celebrity makeup artists specializing in HD Bridal makeup, Airbrush techniques, saree draping, and pre-bridal grooming.', 18000.00, 'per bridal package', 4.8, 37, TRUE, '+91 9835221100', 'roopammakeover@gmail.com', 'Wedding,Engagement,Reception'),
(14, NULL, 'Begusarai Grand Celebration Hall', 'Venue', 'Begusarai', 'NH 31, Near Bus Stand, Begusarai', 'Spacious air-conditioned banquet hall with dedicated dining section, bridal suite, and generator power backup.', 45000.00, 'per day', 4.6, 17, TRUE, '+91 9430112233', 'begusaraigrand@gmail.com', 'Wedding,Engagement,Birthday,Corporate'),
(15, NULL, 'Nalanda Vihar Heritage Grounds', 'Venue', 'Nalanda', 'Rajgir Highway, Nalanda', 'Scenic outdoor garden lawn and banquet hall perfect for destination weddings, cultural functions, and family gatherings.', 48000.00, 'per day', 4.6, 14, TRUE, '+91 9304332211', 'nalandavihar@gmail.com', 'Wedding,Engagement,Reception,Anniversary'),
(16, NULL, 'Sheikhpura Royal Mandap', 'Venue', 'Sheikhpura', 'Station Road, Sheikhpura', 'Comfortable community celebration hall equipped with banquet facilities, rooms, and catering space for local events.', 35000.00, 'per day', 4.4, 11, TRUE, '+91 9122445588', 'sheikhpuramandap@gmail.com', 'Wedding,Birthday,Anniversary')
ON DUPLICATE KEY UPDATE business_name=VALUES(business_name);

-- 3. Venue Details (Capacities, Halls, Rooms)
INSERT INTO venues (vendor_id, max_capacity, main_hall_capacity, conference_hall_capacity, rooms_available, lawn_available, parking_capacity, catering_policy, ac_available, facilities) VALUES
(1, 400, 300, 100, 12, TRUE, 80, 'Both', TRUE, 'Centrally AC, 12 Luxury Rooms, 10000 sq.ft Lawn, Bridal Suite, Stage Setup, Valet Parking, Power Backup 24x7'),
(2, 350, 250, 80, 10, TRUE, 60, 'Both', TRUE, 'Eco-friendly open lawn, AC banquet hall, 10 Deluxe Cottages, Swimming pool deck for Haldi/Sangeet, Generator backup'),
(3, 300, 200, 60, 8, TRUE, 50, 'Outside Allowed', TRUE, 'AC Banquet, 8 AC Rooms, Mandap platform, Dedicated Buffet Area, CCTV Surveillance, Dedicated Staff'),
(4, 250, 180, 50, 6, FALSE, 35, 'Both', TRUE, 'Modern multi-storey AC hall, Elevator, 6 Guest Rooms, Inbuilt sound speakers, DJ lighting rig'),
(14, 280, 200, 50, 6, TRUE, 40, 'Both', TRUE, 'AC Banquet, Lawn, 6 AC Guest Rooms, Generator Backup, Changing Rooms'),
(15, 350, 220, 80, 8, TRUE, 70, 'Both', TRUE, 'Spacious Garden Lawn, Heritage Courtyard, 8 Luxury Rooms, Campfire area'),
(16, 200, 150, 30, 4, FALSE, 25, 'Outside Allowed', TRUE, 'AC Hall, 4 Rooms, Power Backup, Basic Stage, Kitchen area')
ON DUPLICATE KEY UPDATE max_capacity=VALUES(max_capacity);

-- 4. Vendor Services / Packages
INSERT INTO vendor_services (vendor_id, service_name, description, price, price_type, is_popular) VALUES
(1, 'Full Grand Royal Venue Package', 'Access to Main Hall, Lawn, 12 AC Rooms, Stage & Chairs setup for 24 hours', 70000.00, 'fixed', TRUE),
(1, 'Half Day / Sangeet Package', 'Access to Banquet Hall and 4 Rooms for 8 hours', 45000.00, 'fixed', FALSE),
(2, 'Heritage Destination Wedding Package', 'Complete resort with lawn, banquet, and 10 deluxe suites for 24 hours', 65000.00, 'fixed', TRUE),
(3, 'Royal Mithila Classic Package', 'Main Hall, 8 AC rooms, and dining area with basic lighting', 55000.00, 'fixed', TRUE),
(4, 'Silk City Standard Hall Package', 'AC Banquet Hall with 6 guest rooms and stage lighting', 50000.00, 'fixed', TRUE),
(5, 'Royal Bihari & Mughlai Gold Buffet', 'Welcome drinks, 4 Starters, 6 Main courses (incl. Paneer Lababdar, Dal Makhani, Litti Chokha special), 3 Desserts for 250 pax', 90000.00, 'package', TRUE),
(5, 'Silver Classic Buffet', 'Welcome drink, 2 Starters, 4 Main courses, 2 Desserts for 200 pax', 70000.00, 'package', FALSE),
(6, 'Magadh Pure Veg Royal Thali Buffet', 'Authentic vegetarian culinary feast with 5 live counters and Rajasthani/Bihari sweets for 200 pax', 75000.00, 'package', TRUE),
(7, 'Grand Floral & Royal Mandap Theme', 'Exotic flower stage backdrop, crystal entryway arch, LED mood lights, and floral sofa set', 40000.00, 'fixed', TRUE),
(7, 'Contemporary Pastel Theme Decor', 'Geometric arch, fairy light curtain, pastel draping, and selfie photo-booth', 32000.00, 'fixed', FALSE),
(8, 'Utsav Signature Stage & Entry Decor', 'Customizable flower stage, carpet walkway, entrance gate with lighting', 30000.00, 'fixed', TRUE),
(9, 'Cinematic 4K Wedding & Pre-wedding Package', '2 Candid photographers, 2 Cinematographers, Drone camera, Teaser video, Full length film, Premium 50-page Photo Album', 35000.00, 'fixed', TRUE),
(10, 'Moments Classic Photo & Video Package', '1 Candid photographer, 1 Traditional videographer, High-res digital gallery, Photo Album', 28000.00, 'fixed', TRUE),
(11, 'Full Night DJ & Laser Truss Setup', 'High-wattage JBL sound, Moving heads, Fog machine, DJ console, LED dance floor, Bollywood DJ artist', 25000.00, 'fixed', TRUE),
(12, 'Sangeet Party DJ Setup', 'Professional sound system, LED par cans, Wireless mics, Popular dance playlist curation', 20000.00, 'fixed', TRUE),
(13, 'HD Airbrush Bridal Glamour Package', 'Airbrush makeup, Hair styling, Draping, Eyelashes, Pre-bridal facial consultation', 18000.00, 'fixed', TRUE),
(14, 'Begusarai Grand Venue Day Rental', 'Complete banquet and 6 rooms for 24 hours', 45000.00, 'fixed', TRUE),
(15, 'Nalanda Vihar Destination Grounds', 'Lawn, Courtyard, and 8 rooms for wedding celebrations', 48000.00, 'fixed', TRUE),
(16, 'Sheikhpura Celebration Hall Day Pass', 'Banquet hall and 4 rooms for full day', 35000.00, 'fixed', TRUE)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- 5. Sample Reviews
INSERT INTO reviews (vendor_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Hosted my sister’s wedding at Patliputra Grand Palace. The hall is royal, spacious, and the 12 rooms were very convenient for outstation guests!'),
(5, 1, 5, 'Rasoi Ghar catered for 250 guests. The live chaat counter and Litti Chokha stall were the highlights. Everyone praised the food quality!'),
(7, 3, 5, 'Vaishali Decorators made our stage look like a fairytale setup. Highly recommended in Patna!'),
(9, 3, 5, 'The cinematic drone video from Drishti Studio was breathtaking. Very polite and creative team.'),
(11, 1, 4, 'BeatDrop DJ kept the crowd dancing till 1 AM. Fantastic energy and sound quality!'),
(2, 3, 5, 'Magadh Heritage in Gaya is scenic and peaceful. The lawn is huge and well maintained.');
