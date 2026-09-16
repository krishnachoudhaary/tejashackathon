import os
import sys
from werkzeug.security import generate_password_hash

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.db_config import engine, Base, SessionLocal
from models.models import User, Vendor, Venue, VendorService, Event, EventVendor, Booking, Payment, Refund, Review

def init_database():
    """Initializes the database schema and populates with seed data if not present."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if users already exist
        if db.query(User).first():
            print("[Database] Data already seeded. Skipping initial seed.")
            return

        print("[Database] Seeding initial EventHub demo data...")
        
        password_hash = generate_password_hash('Password123!')

        # 1. Users
        demo_customer = User(
            id=1,
            name='Aarav Sharma',
            email='demo@eventhub.com',
            password_hash=password_hash,
            phone='+91 9876543210',
            role='CUSTOMER',
            city='Patna'
        )
        demo_vendor_user = User(
            id=2,
            name='Patliputra Grand Palace',
            email='vendor@eventhub.com',
            password_hash=password_hash,
            phone='+91 9123456780',
            role='VENDOR',
            city='Patna'
        )
        customer2 = User(
            id=3,
            name='Priya Verma',
            email='priya.customer@eventhub.com',
            password_hash=password_hash,
            phone='+91 9876500001',
            role='CUSTOMER',
            city='Gaya'
        )
        admin_user = User(
            id=4,
            name='Admin Manager',
            email='admin@eventhub.com',
            password_hash=password_hash,
            phone='+91 9999999999',
            role='ADMIN',
            city='Patna'
        )
        db.add_all([demo_customer, demo_vendor_user, customer2, admin_user])
        db.commit()

        # 2. Vendors
        vendors_data = [
            Vendor(
                id=1, user_id=2, business_name='Patliputra Grand Palace & Banquet',
                category='Venue', city='Patna', address='Bailey Road, Near Saguna More, Patna',
                description='Premier luxury banquet hall featuring grand chandeliers, lush green lawn, central air conditioning, and guest accommodations.',
                starting_price=70000.00, price_unit='per day', rating=4.8, review_count=42, is_verified=True,
                contact_phone='+91 9835012345', contact_email='info@patliputragrand.com',
                supported_event_types='Wedding,Engagement,Corporate,Anniversary,Birthday'
            ),
            Vendor(
                id=2, user_id=None, business_name='Magadh Heritage Lawn & Resort',
                category='Venue', city='Gaya', address='Bodhgaya Road, Gaya',
                description='Eco-friendly heritage resort venue with spacious open lawns, modern banquet hall, and deluxe guest suites.',
                starting_price=65000.00, price_unit='per day', rating=4.7, review_count=31, is_verified=True,
                contact_phone='+91 9431011223', contact_email='contact@magadhheritage.com',
                supported_event_types='Wedding,Engagement,Reception,Corporate'
            ),
            Vendor(
                id=3, user_id=None, business_name='Royal Mithila Celebrations',
                category='Venue', city='Muzaffarpur', address='Club Road, Mithanpura, Muzaffarpur',
                description='Spacious elegant venue with modular seating, bridal suites, dedicated dining hall, and ample secure parking.',
                starting_price=55000.00, price_unit='per day', rating=4.6, review_count=28, is_verified=True,
                contact_phone='+91 9304055667', contact_email='bookings@royalmithila.com',
                supported_event_types='Wedding,Birthday,Anniversary,Engagement'
            ),
            Vendor(
                id=4, user_id=None, business_name='Silk City Heights Banquet',
                category='Venue', city='Bhagalpur', address='Tilkamanjhi Chowk, Bhagalpur',
                description='Modern multi-storey AC banquet hall offering state-of-the-art acoustics, stage decor compatibility, and guest rooms.',
                starting_price=50000.00, price_unit='per day', rating=4.5, review_count=19, is_verified=True,
                contact_phone='+91 9122334455', contact_email='events@silkcitybanquet.com',
                supported_event_types='Wedding,Corporate,Birthday,Engagement'
            ),
            Vendor(
                id=5, user_id=None, business_name='Rasoi Ghar Gourmet Caterers',
                category='Catering', city='Patna', address='Boring Canal Road, Patna',
                description='Specialists in authentic North Indian, Maithili traditional delicacies, Mughlai dishes, live counters, and bespoke dessert spreads.',
                starting_price=90000.00, price_unit='for 250 guests', rating=4.9, review_count=64, is_verified=True,
                contact_phone='+91 9835123499', contact_email='rasoighar.bihar@gmail.com',
                supported_event_types='Wedding,Engagement,Corporate,Birthday,Anniversary'
            ),
            Vendor(
                id=6, user_id=None, business_name='Bhojan Shala Royal Feast',
                category='Catering', city='Gaya', address='Civil Lines, Gaya',
                description='Pure vegetarian and multi-cuisine catering service with hygienic preparation, royal buffet setups, and live chaat counters.',
                starting_price=75000.00, price_unit='for 200 guests', rating=4.7, review_count=39, is_verified=True,
                contact_phone='+91 9431876543', contact_email='bhojanshala@gmail.com',
                supported_event_types='Wedding,Anniversary,Birthday,Engagement'
            ),
            Vendor(
                id=7, user_id=None, business_name='Vaishali Royal Decorators',
                category='Decoration', city='Patna', address='Kankarbagh Main Road, Patna',
                description='Artistic thematic wedding stage design, floral mandap installations, LED tunnel entries, and elegant ambient mood lighting.',
                starting_price=40000.00, price_unit='per event', rating=4.8, review_count=51, is_verified=True,
                contact_phone='+91 9835887766', contact_email='vaishalidecor@gmail.com',
                supported_event_types='Wedding,Engagement,Anniversary,Birthday'
            ),
            Vendor(
                id=8, user_id=None, business_name='Utsav Creation & Theme Decors',
                category='Decoration', city='Muzaffarpur', address='Aghoria Bazar, Muzaffarpur',
                description='Budget-friendly and premium floral decors, balloon installations for birthdays, and customized theme setups.',
                starting_price=30000.00, price_unit='per event', rating=4.5, review_count=23, is_verified=True,
                contact_phone='+91 9304998877', contact_email='utsavcreations@gmail.com',
                supported_event_types='Wedding,Birthday,Engagement,Anniversary'
            ),
            Vendor(
                id=9, user_id=None, business_name='Drishti Cinematic Wedding Studio',
                category='Photography', city='Patna', address='Ashok Rajpath, Patna',
                description='Candid wedding photography, cinematic 4K drone cinematography, traditional video coverage, and customized luxury photobooks.',
                starting_price=35000.00, price_unit='per 2-day event', rating=4.9, review_count=58, is_verified=True,
                contact_phone='+91 9835443322', contact_email='drishticinema@gmail.com',
                supported_event_types='Wedding,Engagement,Birthday,Corporate'
            ),
            Vendor(
                id=10, user_id=None, business_name='Moments Lens Photography',
                category='Photography', city='Bhagalpur', address='Zero Mile, Bhagalpur',
                description='Passionate photography crew capturing authentic smiles, candid rituals, pre-wedding couple shoots, and cinematic teasers.',
                starting_price=28000.00, price_unit='per event', rating=4.6, review_count=27, is_verified=True,
                contact_phone='+91 9122556677', contact_email='momentslens@gmail.com',
                supported_event_types='Wedding,Engagement,Birthday,Anniversary'
            ),
            Vendor(
                id=11, user_id=None, business_name='BeatDrop Sound & DJ Crew',
                category='DJ', city='Patna', address='Exhibition Road, Patna',
                description='High-energy DJ setups with intelligent moving beam lights, smoke fog machines, LED dance floors, and versatile track mixing.',
                starting_price=25000.00, price_unit='per night', rating=4.7, review_count=46, is_verified=True,
                contact_phone='+91 9835778899', contact_email='beatdropdj.patna@gmail.com',
                supported_event_types='Wedding,Sangeet,Birthday,Corporate,Anniversary'
            ),
            Vendor(
                id=12, user_id=None, business_name='Rhythm Beats DJ & Lighting',
                category='DJ', city='Gaya', address='GB Road, Gaya',
                description='Professional sound reinforcement, laser light shows, Punjabi dhol accompaniment, and Bollywood club mixes for sangeet & baraat.',
                starting_price=20000.00, price_unit='per night', rating=4.5, review_count=33, is_verified=True,
                contact_phone='+91 9431445566', contact_email='rhythmbeats.gaya@gmail.com',
                supported_event_types='Wedding,Sangeet,Birthday'
            ),
            Vendor(
                id=13, user_id=None, business_name='Roopam Bridal Makeover Studio',
                category='Makeup', city='Patna', address='Boring Road, Patna',
                description='Certified celebrity makeup artists specializing in HD Bridal makeup, Airbrush techniques, saree draping, and pre-bridal grooming.',
                starting_price=18000.00, price_unit='per bridal package', rating=4.8, review_count=37, is_verified=True,
                contact_phone='+91 9835221100', contact_email='roopammakeover@gmail.com',
                supported_event_types='Wedding,Engagement,Reception'
            ),
            Vendor(
                id=14, user_id=None, business_name='Begusarai Grand Celebration Hall',
                category='Venue', city='Begusarai', address='NH 31, Near Bus Stand, Begusarai',
                description='Spacious air-conditioned banquet hall with dedicated dining section, bridal suite, and generator power backup.',
                starting_price=45000.00, price_unit='per day', rating=4.6, review_count=17, is_verified=True,
                contact_phone='+91 9430112233', contact_email='begusaraigrand@gmail.com',
                supported_event_types='Wedding,Engagement,Birthday,Corporate'
            ),
            Vendor(
                id=15, user_id=None, business_name='Nalanda Vihar Heritage Grounds',
                category='Venue', city='Nalanda', address='Rajgir Highway, Nalanda',
                description='Scenic outdoor garden lawn and banquet hall perfect for destination weddings, cultural functions, and family gatherings.',
                starting_price=48000.00, price_unit='per day', rating=4.6, review_count=14, is_verified=True,
                contact_phone='+91 9304332211', contact_email='nalandavihar@gmail.com',
                supported_event_types='Wedding,Engagement,Reception,Anniversary'
            ),
            Vendor(
                id=16, user_id=None, business_name='Sheikhpura Royal Mandap',
                category='Venue', city='Sheikhpura', address='Station Road, Sheikhpura',
                description='Comfortable community celebration hall equipped with banquet facilities, rooms, and catering space for local events.',
                starting_price=35000.00, price_unit='per day', rating=4.4, review_count=11, is_verified=True,
                contact_phone='+91 9122445588', contact_email='sheikhpuramandap@gmail.com',
                supported_event_types='Wedding,Birthday,Anniversary'
            )
        ]
        db.add_all(vendors_data)
        db.commit()

        # 3. Venues Specific Info
        venues_info = [
            Venue(vendor_id=1, max_capacity=400, main_hall_capacity=300, conference_hall_capacity=100, rooms_available=12, lawn_available=True, parking_capacity=80, catering_policy='Both', ac_available=True, facilities='Centrally AC, 12 Luxury Rooms, 10000 sq.ft Lawn, Bridal Suite, Stage Setup, Valet Parking, Power Backup 24x7'),
            Venue(vendor_id=2, max_capacity=350, main_hall_capacity=250, conference_hall_capacity=80, rooms_available=10, lawn_available=True, parking_capacity=60, catering_policy='Both', ac_available=True, facilities='Eco-friendly open lawn, AC banquet hall, 10 Deluxe Cottages, Swimming pool deck for Haldi/Sangeet, Generator backup'),
            Venue(vendor_id=3, max_capacity=300, main_hall_capacity=200, conference_hall_capacity=60, rooms_available=8, lawn_available=True, parking_capacity=50, catering_policy='Outside Allowed', ac_available=True, facilities='AC Banquet, 8 AC Rooms, Mandap platform, Dedicated Buffet Area, CCTV Surveillance, Dedicated Staff'),
            Venue(vendor_id=4, max_capacity=250, main_hall_capacity=180, conference_hall_capacity=50, rooms_available=6, lawn_available=False, parking_capacity=35, catering_policy='Both', ac_available=True, facilities='Modern multi-storey AC hall, Elevator, 6 Guest Rooms, Inbuilt sound speakers, DJ lighting rig'),
            Venue(vendor_id=14, max_capacity=280, main_hall_capacity=200, conference_hall_capacity=50, rooms_available=6, lawn_available=True, parking_capacity=40, catering_policy='Both', ac_available=True, facilities='AC Banquet, Lawn, 6 AC Guest Rooms, Generator Backup, Changing Rooms'),
            Venue(vendor_id=15, max_capacity=350, main_hall_capacity=220, conference_hall_capacity=80, rooms_available=8, lawn_available=True, parking_capacity=70, catering_policy='Both', ac_available=True, facilities='Spacious Garden Lawn, Heritage Courtyard, 8 Luxury Rooms, Campfire area'),
            Venue(vendor_id=16, max_capacity=200, main_hall_capacity=150, conference_hall_capacity=30, rooms_available=4, lawn_available=False, parking_capacity=25, catering_policy='Outside Allowed', ac_available=True, facilities='AC Hall, 4 Rooms, Power Backup, Basic Stage, Kitchen area')
        ]
        db.add_all(venues_info)
        db.commit()

        # 4. Vendor Services / Packages
        packages = [
            VendorService(vendor_id=1, service_name='Full Grand Royal Venue Package', description='Access to Main Hall, Lawn, 12 AC Rooms, Stage & Chairs setup for 24 hours', price=70000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=1, service_name='Half Day / Sangeet Package', description='Access to Banquet Hall and 4 Rooms for 8 hours', price=45000.00, price_type='fixed', is_popular=False),
            VendorService(vendor_id=2, service_name='Heritage Destination Wedding Package', description='Complete resort with lawn, banquet, and 10 deluxe suites for 24 hours', price=65000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=3, service_name='Royal Mithila Classic Package', description='Main Hall, 8 AC rooms, and dining area with basic lighting', price=55000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=4, service_name='Silk City Standard Hall Package', description='AC Banquet Hall with 6 guest rooms and stage lighting', price=50000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=5, service_name='Royal Bihari & Mughlai Gold Buffet', description='Welcome drinks, 4 Starters, 6 Main courses (incl. Paneer Lababdar, Dal Makhani, Litti Chokha special), 3 Desserts for 250 pax', price=90000.00, price_type='package', is_popular=True),
            VendorService(vendor_id=5, service_name='Silver Classic Buffet', description='Welcome drink, 2 Starters, 4 Main courses, 2 Desserts for 200 pax', price=70000.00, price_type='package', is_popular=False),
            VendorService(vendor_id=6, service_name='Magadh Pure Veg Royal Thali Buffet', description='Authentic vegetarian culinary feast with 5 live counters and Rajasthani/Bihari sweets for 200 pax', price=75000.00, price_type='package', is_popular=True),
            VendorService(vendor_id=7, service_name='Grand Floral & Royal Mandap Theme', description='Exotic flower stage backdrop, crystal entryway arch, LED mood lights, and floral sofa set', price=40000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=7, service_name='Contemporary Pastel Theme Decor', description='Geometric arch, fairy light curtain, pastel draping, and selfie photo-booth', price=32000.00, price_type='fixed', is_popular=False),
            VendorService(vendor_id=8, service_name='Utsav Signature Stage & Entry Decor', description='Customizable flower stage, carpet walkway, entrance gate with lighting', price=30000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=9, service_name='Cinematic 4K Wedding & Pre-wedding Package', description='2 Candid photographers, 2 Cinematographers, Drone camera, Teaser video, Full length film, Premium 50-page Photo Album', price=35000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=10, service_name='Moments Classic Photo & Video Package', description='1 Candid photographer, 1 Traditional videographer, High-res digital gallery, Photo Album', price=28000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=11, service_name='Full Night DJ & Laser Truss Setup', description='High-wattage JBL sound, Moving heads, Fog machine, DJ console, LED dance floor, Bollywood DJ artist', price=25000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=12, service_name='Sangeet Party DJ Setup', description='Professional sound system, LED par cans, Wireless mics, Popular dance playlist curation', price=20000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=13, service_name='HD Airbrush Bridal Glamour Package', description='Airbrush makeup, Hair styling, Draping, Eyelashes, Pre-bridal facial consultation', price=18000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=14, service_name='Begusarai Grand Venue Day Rental', description='Complete banquet and 6 rooms for 24 hours', price=45000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=15, service_name='Nalanda Vihar Destination Grounds', description='Lawn, Courtyard, and 8 rooms for wedding celebrations', price=48000.00, price_type='fixed', is_popular=True),
            VendorService(vendor_id=16, service_name='Sheikhpura Celebration Hall Day Pass', description='Banquet hall and 4 rooms for full day', price=35000.00, price_type='fixed', is_popular=True)
        ]
        db.add_all(packages)
        db.commit()

        # 5. Reviews
        reviews_data = [
            Review(vendor_id=1, user_id=1, rating=5, comment='Hosted my sister’s wedding at Patliputra Grand Palace. The hall is royal, spacious, and the 12 rooms were very convenient for outstation guests!'),
            Review(vendor_id=5, user_id=1, rating=5, comment='Rasoi Ghar catered for 250 guests. The live chaat counter and Litti Chokha stall were the highlights. Everyone praised the food quality!'),
            Review(vendor_id=7, user_id=3, rating=5, comment='Vaishali Decorators made our stage look like a fairytale setup. Highly recommended in Patna!'),
            Review(vendor_id=9, user_id=3, rating=5, comment='The cinematic drone video from Drishti Studio was breathtaking. Very polite and creative team.'),
            Review(vendor_id=11, user_id=1, rating=4, comment='BeatDrop DJ kept the crowd dancing till 1 AM. Fantastic energy and sound quality!'),
            Review(vendor_id=2, user_id=3, rating=5, comment='Magadh Heritage in Gaya is scenic and peaceful. The lawn is huge and well maintained.')
        ]
        db.add_all(reviews_data)
        db.commit()

        print("[Database] Successfully initialized schema and seeded demo dataset.")

    except Exception as e:
        db.rollback()
        print(f"[Database] Error during initialization/seeding: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    init_database()
