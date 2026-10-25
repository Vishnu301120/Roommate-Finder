require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Listing = require('./models/Listing');
const MatchRequest = require('./models/MatchRequest');
const Message = require('./models/Message');
const Review = require('./models/Review');
const Report = require('./models/Report');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roommate_finder');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Listing.deleteMany();
    await MatchRequest.deleteMany();
    await Message.deleteMany();
    await Review.deleteMany();
    await Report.deleteMany();
    console.log('Cleaned old database collections.');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordUser = await bcrypt.hash('Password@123', salt);
    const hashedPasswordAdmin = await bcrypt.hash('Admin@12345', salt);

    const usersToCreate = [
      {
        name: 'Super Admin',
        email: 'admin@roommatefinder.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        gender: 'Male',
        age: 32,
        occupation: 'Working Professional',
        city: 'Chennai',
        locality: 'Guindy',
        budgetMin: 15000,
        budgetMax: 35000,
        phone: '+91 9876543210',
        bio: 'Platform Administrator & Community Manager for Tamil Nadu Flatmates.',
        isVerified: true,
      },
      {
        name: 'Rahul Sharma',
        email: 'demo@roommatefinder.com',
        password: hashedPasswordUser,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        gender: 'Male',
        age: 25,
        occupation: 'Working Professional',
        city: 'Chennai',
        locality: 'Velachery',
        budgetMin: 8000,
        budgetMax: 18000,
        phone: '+91 9811223344',
        bio: 'Full Stack Engineer working in OMR IT corridor. Looking for a neat, chilled-out flatmate in Velachery or Thoraipakkam. Love tech, movies, and filter coffee!',
        lookingFor: 'both',
        lifestyle: {
          smoking: 'No',
          drinking: 'Socially',
          foodDiet: 'Non-Vegetarian',
          sleepSchedule: 'Flexible',
          pets: 'Pet Friendly',
          partyHabits: 'Weekends Only',
        },
        isVerified: true,
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        gender: 'Female',
        age: 24,
        occupation: 'Working Professional',
        city: 'Coimbatore',
        locality: 'Peelamedu',
        budgetMin: 8000,
        budgetMax: 18000,
        phone: '+91 9822334455',
        bio: 'UI/UX Designer working remotely. Clean freak, loves plants, books, and peaceful mornings. Looking for a female roommate or shared flat in Peelamedu or RS Puram.',
        lookingFor: 'both',
        lifestyle: {
          smoking: 'No',
          drinking: 'No',
          foodDiet: 'Vegetarian',
          sleepSchedule: 'Early Bird',
          pets: 'Dog Lover',
          partyHabits: 'Quiet & Calm',
        },
        isVerified: true,
      },
      {
        name: 'Ananya Roy',
        email: 'ananya.roy@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        gender: 'Female',
        age: 26,
        occupation: 'Working Professional',
        city: 'Chennai',
        locality: 'OMR - Thoraipakkam',
        budgetMin: 10000,
        budgetMax: 22000,
        phone: '+91 9833445566',
        bio: 'Senior Product Manager in Sholinganallur SEZ. Outgoing, fitness enthusiast, loves weekend badminton. Looking for flatmates who respect personal space.',
        lookingFor: 'roommate',
        lifestyle: {
          smoking: 'No',
          drinking: 'Socially',
          foodDiet: 'Eggetarian',
          sleepSchedule: 'Flexible',
          pets: 'Cat Lover',
          partyHabits: 'Social & Fun',
        },
        isVerified: true,
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan.mehta@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        gender: 'Male',
        age: 27,
        occupation: 'Working Professional',
        city: 'Madurai',
        locality: 'KK Nagar',
        budgetMin: 5000,
        budgetMax: 12000,
        phone: '+91 9844556677',
        bio: 'Bank Officer in Madurai. Quiet during weekdays, loves South Indian food and exploring temples on weekends. Looking for a private room in a 2 or 3BHK flat.',
        lookingFor: 'room',
        lifestyle: {
          smoking: 'Occasionally',
          drinking: 'Socially',
          foodDiet: 'Non-Vegetarian',
          sleepSchedule: 'Night Owl',
          pets: 'Pet Friendly',
          partyHabits: 'Weekends Only',
        },
        isVerified: true,
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        gender: 'Male',
        age: 28,
        occupation: 'Working Professional',
        city: 'Coimbatore',
        locality: 'Saravanampatti',
        budgetMin: 9000,
        budgetMax: 20000,
        phone: '+91 9855667788',
        bio: 'Tech Lead in a fintech enterprise at CHIL SEZ IT Park, Saravanampatti. Non-smoker, early morning runner. Looking for a neat flatmate to share a flat.',
        lookingFor: 'roommate',
        lifestyle: {
          smoking: 'No',
          drinking: 'No',
          foodDiet: 'Vegetarian',
          sleepSchedule: 'Early Bird',
          pets: 'No Pets',
          partyHabits: 'Quiet & Calm',
        },
        isVerified: true,
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        gender: 'Female',
        age: 23,
        occupation: 'Student',
        city: 'Tiruchirappalli',
        locality: 'Thillai Nagar',
        budgetMin: 5000,
        budgetMax: 11000,
        phone: '+91 9866778899',
        bio: 'PG student at NIT Trichy. Studious, peaceful, fond of painting and coffee. Looking for a female roommate near Thillai Nagar or Cantonment.',
        lookingFor: 'both',
        lifestyle: {
          smoking: 'No',
          drinking: 'No',
          foodDiet: 'Vegetarian',
          sleepSchedule: 'Night Owl',
          pets: 'Pet Friendly',
          partyHabits: 'Quiet & Calm',
        },
        isVerified: true,
      },
      {
        name: 'Karan Verma',
        email: 'karan.verma@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        gender: 'Male',
        age: 22,
        occupation: 'Student',
        city: 'Salem',
        locality: 'Fairlands',
        budgetMin: 5000,
        budgetMax: 10000,
        phone: '+91 9877889900',
        bio: 'Final year engineering student & design intern in Salem. Budget-conscious, love sports and music. Friendly and easygoing.',
        lookingFor: 'roommate',
        lifestyle: {
          smoking: 'No',
          drinking: 'Socially',
          foodDiet: 'Non-Vegetarian',
          sleepSchedule: 'Flexible',
          pets: 'Dog Lover',
          partyHabits: 'Social & Fun',
        },
        isVerified: false,
      },
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`Created ${createdUsers.length} users.`);

    const admin = createdUsers[0];
    const rahul = createdUsers[1];
    const priya = createdUsers[2];
    const ananya = createdUsers[3];
    const rohan = createdUsers[4];
    const vikram = createdUsers[5];
    const sneha = createdUsers[6];
    const karan = createdUsers[7];

    // 2. Create Accommodation Listings across Tamil Nadu
    const sampleListings = [
      {
        user: ananya._id,
        title: 'Spacious Master Bedroom with Attached Balcony in OMR IT Corridor',
        description:
          'A luxury master bedroom available in a modern 3BHK gated society in Thoraipakkam, OMR. Comes with private attached bathroom, huge wardrobe, workstation, and sunny balcony. 10 mins to Tidal Park & Sholinganallur SEZ. Looking for a chilled female flatmate.',
        propertyType: 'Apartment',
        roomType: 'Single Private Room',
        rent: 13500,
        deposit: 30000,
        city: 'Chennai',
        locality: 'OMR - Thoraipakkam',
        address: 'Appaswamy Platina, Rajiv Gandhi Salai, OMR, Chennai',
        furnishingStatus: 'Fully Furnished',
        amenities: [
          'High Speed Wifi',
          'AC',
          'Attached Washroom',
          'Modular Kitchen',
          'Power Backup',
          'Washing Machine',
          'Gym',
          'Swimming Pool',
          '24/7 Security',
          'Balcony',
        ],
        preferredGender: 'Female',
        preferredOccupation: 'Working Professional',
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
        ],
        rules: ['Quiet hours after 11 PM', 'No smoking indoors', 'Keep common areas tidy'],
        views: 184,
      },
      {
        user: rahul._id,
        title: 'Furnished Private Room in 2BHK near Velachery MRTS',
        description:
          '1 private room available in a lovely 2BHK flat in Velachery. Walking distance to Phoenix Marketcity, MRTS station, and IT parks. Modern setup with 300 Mbps wifi, fully equipped kitchen, and daily housekeeping.',
        propertyType: 'Apartment',
        roomType: 'Single Private Room',
        rent: 11000,
        deposit: 22000,
        city: 'Chennai',
        locality: 'Velachery Bypass Road',
        address: 'Ceebros Boulevard, Bypass Road, Velachery, Chennai',
        furnishingStatus: 'Fully Furnished',
        amenities: [
          'High Speed Wifi',
          'Modular Kitchen',
          'Power Backup',
          'Washing Machine',
          'Refrigerator',
          'Cook/Maid Available',
          'Parking',
          'Balcony',
        ],
        preferredGender: 'Male',
        preferredOccupation: 'Working Professional',
        photos: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80',
        ],
        rules: ['Respect work-from-home focus', 'Friends welcome on weekends'],
        views: 142,
      },
      {
        user: priya._id,
        title: 'Chic Garden-Facing Room in Peelamedu, Coimbatore',
        description:
          'Sunny bedroom with aesthetic interiors, wooden flooring, and high ceilings. Situated in peaceful Peelamedu near Avinashi Road and colleges. Perfect for artists, designers, or working professionals.',
        propertyType: 'Apartment',
        roomType: 'Single Private Room',
        rent: 9000,
        deposit: 20000,
        city: 'Coimbatore',
        locality: 'Peelamedu',
        address: 'Avinashi Road, Near PSG Tech, Peelamedu, Coimbatore',
        furnishingStatus: 'Fully Furnished',
        amenities: [
          'High Speed Wifi',
          'AC',
          'Modular Kitchen',
          'Balcony',
          '24/7 Security',
          'Washing Machine',
        ],
        preferredGender: 'Female',
        preferredOccupation: 'Any',
        photos: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        ],
        rules: ['Vegetarian preferred', 'No smoking', 'Plant-friendly roommate'],
        views: 210,
      },
      {
        user: vikram._id,
        title: 'Executive Room in Gated IT Hub Society with Pool & Gym',
        description:
          'Executive master bedroom in Saravanampatti IT corridor. Society includes club house, gym, Olympic pool, tennis courts. High-speed elevators and 100% power backup. 5 min to CHIL SEZ IT Park.',
        propertyType: 'Gated Community',
        roomType: 'Single Private Room',
        rent: 10500,
        deposit: 25000,
        city: 'Coimbatore',
        locality: 'Saravanampatti',
        address: 'Sreevatsa Global Village, Saravanampatti, Coimbatore',
        furnishingStatus: 'Fully Furnished',
        amenities: [
          'High Speed Wifi',
          'AC',
          'Attached Washroom',
          'Gym',
          'Swimming Pool',
          'Power Backup',
          '24/7 Security',
          'Parking',
        ],
        preferredGender: 'Male',
        preferredOccupation: 'Working Professional',
        photos: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
        ],
        rules: ['No loud parties on weekdays', 'Keep common kitchen clean'],
        views: 125,
      },
      {
        user: rohan._id,
        title: 'Cozy Shared Room in Peaceful Society in KK Nagar, Madurai',
        description:
          '1 bed vacancy in a spacious 2-sharing room in KK Nagar. Ideal for working professionals or bank officers. Clean, gated campus near restaurants and Mattuthavani.',
        propertyType: 'Apartment',
        roomType: 'Shared Room',
        rent: 6000,
        deposit: 12000,
        city: 'Madurai',
        locality: 'KK Nagar',
        address: '80 Feet Road, Near Apollo Hospital, KK Nagar, Madurai',
        furnishingStatus: 'Semi-Furnished',
        amenities: [
          'High Speed Wifi',
          'Refrigerator',
          'Washing Machine',
          '24/7 Security',
          'Gym',
          'Parking',
        ],
        preferredGender: 'Male',
        preferredOccupation: 'Working Professional',
        photos: [
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
        ],
        rules: ['Split utilities equally', 'Non-smoking preferred'],
        views: 93,
      },
      {
        user: sneha._id,
        title: 'Quiet Budget Room for Female Student/Professional in Trichy',
        description:
          'Furnished room in a quiet residential building in Thillai Nagar. 10 minutes from Central Bus Stand and Railway Junction. Includes bed, study desk, ergonomic chair, and wardrobe.',
        propertyType: 'Apartment',
        roomType: 'Single Private Room',
        rent: 6500,
        deposit: 15000,
        city: 'Tiruchirappalli',
        locality: 'Thillai Nagar',
        address: '11th Cross, Thillai Nagar East, Tiruchirappalli',
        furnishingStatus: 'Fully Furnished',
        amenities: [
          'High Speed Wifi',
          'Modular Kitchen',
          'Power Backup',
          '24/7 Security',
          'Washing Machine',
        ],
        preferredGender: 'Female',
        preferredOccupation: 'Any',
        photos: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        ],
        rules: ['Female occupants only', 'Quiet study hours'],
        views: 88,
      },
      {
        user: karan._id,
        title: 'Modern Independent Studio Apartment in Fairlands, Salem',
        description:
          'Entire self-contained Studio Apartment with kitchenette and private washroom. Prime location in Fairlands with rooftop cafe access and 24-hr security. Near modern cafes and shopping hubs.',
        propertyType: 'Apartment',
        roomType: 'Studio',
        rent: 8500,
        deposit: 18000,
        city: 'Salem',
        locality: 'Fairlands',
        address: 'Brindavan Road, Fairlands, Salem',
        furnishingStatus: 'Fully Furnished',
        amenities: [
          'High Speed Wifi',
          'AC',
          'Attached Washroom',
          'Modular Kitchen',
          'Power Backup',
          'Parking',
          '24/7 Security',
        ],
        preferredGender: 'Any',
        preferredOccupation: 'Any',
        photos: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
        ],
        rules: ['No loud music after midnight', 'Pet friendly'],
        views: 175,
      },
    ];

    const createdListings = await Listing.insertMany(sampleListings);
    console.log(`Created ${createdListings.length} listings.`);

    // 3. Create Sample Match Requests
    // Rahul connects with Ananya (Accepted)
    const match1 = await MatchRequest.create({
      sender: rahul._id,
      receiver: ananya._id,
      listing: createdListings[0]._id,
      message: 'Hi Ananya! I work as a software engineer in OMR nearby and love the Thoraipakkam location. Would love to connect and chat!',
      status: 'accepted',
    });

    // Rohan requests Rahul (Pending)
    const match2 = await MatchRequest.create({
      sender: rohan._id,
      receiver: rahul._id,
      listing: createdListings[1]._id,
      message: 'Hey Rahul, I might be moving to Chennai for my new project and looking at Velachery flats. Let me know if the room is still open!',
      status: 'pending',
    });

    // Sneha requests Priya (Accepted)
    const match3 = await MatchRequest.create({
      sender: sneha._id,
      receiver: priya._id,
      listing: createdListings[2]._id,
      message: 'Hi Priya, your design work and peaceful Coimbatore flat aesthetic are amazing. Let’s connect!',
      status: 'accepted',
    });

    console.log('Created sample match requests.');

    // 4. Create Sample Messages between Rahul and Ananya
    const convId = Message.getConversationId(rahul._id, ananya._id);
    await Message.create([
      {
        conversationId: convId,
        sender: rahul._id,
        receiver: ananya._id,
        content: 'Hi Ananya! Thanks for accepting my connection request.',
        createdAt: new Date(Date.now() - 3600000 * 4),
      },
      {
        conversationId: convId,
        sender: ananya._id,
        receiver: rahul._id,
        content: 'Hey Rahul! Happy to connect. Your tech background sounds cool. Are you looking to move in by this month end?',
        createdAt: new Date(Date.now() - 3600000 * 3),
      },
      {
        conversationId: convId,
        sender: rahul._id,
        receiver: ananya._id,
        content: 'Yes, exactly around the 1st of next month! Does the apartment have high-speed broadband and power backup for WFH?',
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        conversationId: convId,
        sender: ananya._id,
        receiver: rahul._id,
        content: 'Yes! We have 300 Mbps ACT Fibernet plus full society power backup. You can drop by this weekend to check out the room in person if you like.',
        createdAt: new Date(Date.now() - 3600000 * 1),
      },
    ]);
    console.log('Created sample chat messages.');

    // 5. Create Sample Reviews
    await Review.create([
      {
        reviewer: rahul._id,
        targetListing: createdListings[0]._id,
        rating: 5,
        comment: 'Stunning apartment with amazing natural light and top-notch society amenities in OMR. Host Ananya is very cooperative!',
      },
      {
        reviewer: priya._id,
        targetUser: rahul._id,
        rating: 5,
        comment: 'Very polite, communicative, and respectful flatmate. Keeps the common area spotlessly clean.',
      },
      {
        reviewer: vikram._id,
        targetListing: createdListings[1]._id,
        rating: 4,
        comment: 'Great location in Velachery! Very central with Phoenix Mall and MRTS accessible within 5 minutes.',
      },
    ]);
    console.log('Created sample reviews.');

    // 6. Create Sample Report for Admin Moderation Demo
    await Report.create({
      reporter: priya._id,
      targetType: 'listing',
      targetListing: createdListings[6]._id,
      reason: 'Incorrect Pricing or Location',
      description: 'The rent quoted seems lower than the market rate in Fairlands Salem, please verify owner ownership documents.',
      status: 'pending',
    });
    console.log('Created sample safety report.');

    console.log('\n=========================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Admin Account: admin@roommatefinder.com | Admin@12345');
    console.log('Demo User:     demo@roommatefinder.com  | Password@123');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
};

seedData();
