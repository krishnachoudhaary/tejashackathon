const { query } = require('../config/db');
const { calculateSmartMatchScore } = require('../services/smartMatchService');

const getAllVendors = async (req, res, next) => {
  try {
    const {
      category,
      city,
      keyword,
      minPrice,
      maxPrice,
      rating,
      capacity,
      sortBy = 'rating',
      eventType,
      guestCount,
      targetBudget
    } = req.query;

    const [allVendors] = await query('SELECT * FROM vendors');
    let filtered = [...allVendors];

    // 1. Filter by Category
    if (category && category !== 'All') {
      filtered = filtered.filter(v => v.category.toLowerCase() === category.toLowerCase());
    }

    // 2. Filter by City
    if (city && city !== 'All') {
      filtered = filtered.filter(v => v.city.toLowerCase() === city.toLowerCase());
    }

    // 3. Keyword Search
    if (keyword && keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      filtered = filtered.filter(v =>
        v.business_name.toLowerCase().includes(kw) ||
        (v.description && v.description.toLowerCase().includes(kw)) ||
        (v.address && v.address.toLowerCase().includes(kw)) ||
        (v.facilities && v.facilities.toLowerCase().includes(kw))
      );
    }

    // 4. Price range filter
    if (minPrice) {
      filtered = filtered.filter(v => Number(v.starting_price) >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(v => Number(v.starting_price) <= Number(maxPrice));
    }

    // 5. Rating filter
    if (rating) {
      filtered = filtered.filter(v => Number(v.rating) >= Number(rating));
    }

    // 6. Venue Capacity filter
    if (capacity) {
      filtered = filtered.filter(v => !v.max_capacity || Number(v.max_capacity) >= Number(capacity));
    }

    // Attach Smart Match scores if event context is supplied
    const eventContext = {
      eventType: eventType || 'Wedding',
      city: city || 'Patna',
      guestCount: Number(guestCount) || 200,
      targetBudget: Number(targetBudget) || 70000
    };

    filtered = filtered.map(v => {
      const match = calculateSmartMatchScore(v, eventContext);
      return {
        ...v,
        matchScore: match.score,
        matchReasons: match.reasons
      };
    });

    // Sorting
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => Number(a.starting_price) - Number(b.starting_price));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => Number(b.starting_price) - Number(a.starting_price));
    } else if (sortBy === 'match_score') {
      filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else {
      // Default: Highest Rating
      filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    res.json({
      success: true,
      count: filtered.length,
      vendors: filtered
    });
  } catch (err) {
    next(err);
  }
};

const getVendorById = async (req, res, next) => {
  try {
    const vendorId = Number(req.params.id);
    const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [vendorId]);

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.'
      });
    }

    const vendor = vendors[0];

    // Fetch vendor reviews
    const [reviews] = await query('SELECT * FROM reviews WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);

    // Optional smart match calculation
    const { eventType, city, guestCount, targetBudget } = req.query;
    let matchInfo = null;
    if (eventType || targetBudget) {
      matchInfo = calculateSmartMatchScore(vendor, {
        eventType: eventType || 'Wedding',
        city: city || vendor.city,
        guestCount: Number(guestCount) || 200,
        targetBudget: Number(targetBudget) || Number(vendor.starting_price)
      });
    }

    res.json({
      success: true,
      vendor: {
        ...vendor,
        reviews: reviews || [],
        matchScore: matchInfo ? matchInfo.score : undefined,
        matchReasons: matchInfo ? matchInfo.reasons : undefined
      }
    });
  } catch (err) {
    next(err);
  }
};

const getVendorForCurrentUser = async (req, res, next) => {
  try {
    const [vendors] = await query('SELECT * FROM vendors WHERE user_id = ?', [req.user.id]);
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No vendor profile associated with this account.'
      });
    }
    const vendor = vendors[0];
    const [reviews] = await query('SELECT * FROM reviews WHERE vendor_id = ?', [vendor.id]);
    res.json({
      success: true,
      vendor: {
        ...vendor,
        reviews: reviews || []
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateVendorProfile = async (req, res, next) => {
  try {
    const vendorId = Number(req.params.id);
    const {
      business_name,
      starting_price,
      price_unit,
      description,
      facilities,
      max_capacity,
      halls_info,
      rooms_count,
      address,
      city
    } = req.body;

    const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [vendorId]);
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    const vendor = vendors[0];
    if (vendor.user_id && vendor.user_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this vendor.' });
    }

    // In-memory or MySQL update
    vendor.business_name = business_name || vendor.business_name;
    vendor.starting_price = starting_price ? Number(starting_price) : vendor.starting_price;
    vendor.price_unit = price_unit || vendor.price_unit;
    vendor.description = description || vendor.description;
    vendor.facilities = facilities || vendor.facilities;
    vendor.max_capacity = max_capacity ? Number(max_capacity) : vendor.max_capacity;
    vendor.halls_info = halls_info || vendor.halls_info;
    vendor.rooms_count = rooms_count !== undefined ? Number(rooms_count) : vendor.rooms_count;
    vendor.address = address || vendor.address;
    vendor.city = city || vendor.city;

    res.json({
      success: true,
      message: 'Vendor profile updated successfully.',
      vendor
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  getVendorForCurrentUser,
  updateVendorProfile
};
