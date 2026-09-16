# EventHub Database Guide

This directory contains the SQL scripts to initialize and seed the **EventHub** database.

## Files
- `schema.sql`: Contains the complete relational schema with tables for `users`, `vendors`, `venues`, `vendor_services`, `events`, `event_vendors`, `bookings`, `payments`, `refunds`, and `reviews`.
- `seed.sql`: Realistic seed data featuring 16+ Tier-2 and Tier-3 vendors across Bihar (Patna, Gaya, Muzaffarpur, Bhagalpur, Begusarai, Nalanda, Sheikhpura) and demo accounts.

## Quick Setup (MySQL CLI)
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

## Note for Zero-Config Auto Setup
When running the Python Flask backend (`python app.py`), EventHub checks MySQL connection parameters from `.env`. If MySQL is running and configured, it executes against MySQL. If MySQL is not running or credentials are not supplied, it initializes SQLite with identical seed records automatically so that evaluators get an immediate 100% working demo out of the box!
