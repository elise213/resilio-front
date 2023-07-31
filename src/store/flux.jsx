

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      current_front_url: import.meta.env.VITE_FRONTEND_URL,
      current_back_url: import.meta.env.VITE_BACKEND_URL,
      latitude: null,
      longitude: null,
      token: null,
      is_org: null,
      name: null,
      avatarID: null,
      avatarImages: [
        "fas fa-robot",
        "fas fa-user-astronaut",
        "fas fa-user-ninja",
        "fas fa-snowman",
        "fas fa-user-secret",
        "fas fa-hippo",
      ],
      favorites: [],
      favoriteOfferings: [],
      searchResults: [],
      offerings: [],
      checked: false,
      commentsList: [],
      categorySEarch: [],
      when: [],
      dummydata: [
        {
          "id": 1,
          "name": "Urban Partners",
          "address": "2936 W. 8th Street Los Angeles, CA 90005",
          "phone": "213-401-1191",
          "category": "food",
          "website": "urbanpartnersla.org",
          "description": "Urban Partners' “Groceries for our Neighbors” food distribution program provides essential weekly groceries to thousands of low-income, homeless, and senior Los Angeles community members. People stand in line starting at 6 a.m., so, we recommend arriving early.",
          "latitude": "34.05762167501406",
          "longitude": "-118.2901160595026",
          "image": "https://d2g8igdw686xgo.cloudfront.net/69633123_1669942924486635_r.",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 2,
          "name": "Glendale Public Health Center",
          "address": "501 N. Glendale Avenue Glendale, CA 91206",
          "phone": "555-777-6666",
          "category": "health",
          "website": "www.com",
          "description": "bla bla bla",
          "latitude": "34.15354480776716",
          "longitude": "-118.24421153066476",
          "image": "https://www.freeclinics.com/gallery/23930_ca_91206_glendale-health-center_otw.jpg",
          "image2": "https://scontent.fbcn7-2.fna.fbcdn.net/v/t39.30808-6/333572053_1606789609734823_57409042605646238_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=730e14&_nc_ohc=RFMj7rARPAwAX_EkOmq&_nc_ht=scontent.fbcn7-2.fna&oh=00_AfCSkS1R6ngIx9Lk69M0_hTf2MkYZEHtDcR8CVEMIdHCsQ&oe=64214E14",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 3,
          "name": "The Source: Emergency Shelter Services",
          "address": "7140 W. Sunset Boulevard, Los Angeles, CA 90046",
          "phone": "555-222-7677",
          "category": "shelter",
          "website": "www.com",
          "description": "bla bla",
          "latitude": "34.09421597539273",
          "longitude": "-118.37656743066601",
          "image": "https://www.discoverlosangeles.com/sites/default/files/styles/hero/public/images/2019-04/Central%20Library%20DTLA%20exterior.jpg?itok=I2Wu4doQ",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 4,
          "name": "Hollywood Food Coalition",
          "address": " 5939 Hollywood Blvd, Los Angeles, CA 90028",
          "phone": "555-222-6777",
          "category": "food",
          "website": "https://hofoco.org/",
          "description": "Offering take-away hot meals",
          "latitude": "34.102274945815694",
          "longitude": "-118.31914988850855",
          "image": "https://letsvolunteerla.org/wp-content/uploads/2020/11/6Qsk4igwI.jpeg",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 5,
          "name": "Simms/Mann Public Health Center",
          "address": "2509 Pico Boulevard, Room 325 Santa Monica, CA 90405",
          "phone": "555-222-7772",
          "category": "health",
          "website": "http://publichealth.lacounty.gov/",
          "description": "County-operated, offering free and low-cost STD services. ",
          "latitude": "34.01070373746804",
          "longitude": "-118.48621208650503",
          "image": "https://www.uclahealth.org/sites/default/files/styles/portrait_3x4_016000_480x640/public/images/LOC0000053116-20617.jpg?h=309e12e8&f=a993a75e&itok=3XGtVdSr",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 6,
          "name": "Hawkes Residence",
          "address": "1640 Rockwood St. Los Angeles, CA. 90026",
          "phone": "555-222-7327",
          "category": "shelter",
          "website": "http://gschomeless.org/hawkes-residence/",
          "description": "Interim Housing for women and children. No Walk-ins. Call for availability. Intake: 24 hours; as arranged. Shared Rooms. LAHSA Funded. ",
          "latitude": "34.06525654838558",
          "longitude": "-118.26431770384954",
          "image": "https://gschomeless.org/wp-content/uploads/2015/05/women-talking-at-shelter.jpg",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 7,
          "name": "LAHSA Showers - North East Region",
          "address": "2032 Marengo St. Los Angeles, CA. 90033",
          "phone": "555-222-7773",
          "category": "hygiene",
          "website": "https://www.lahsa.org/documents?id=4340-handwashing-station-list",
          "description": "Free showers.",
          "latitude": "34.0565620205152",
          "longitude": "-118.20759174433456",
          "image": "https://i0.wp.com/newspack-berkeleyside-cityside.s3.amazonaws.com/wp-content/uploads/2019/09/Guests-using-Lava-Mae-in-San-Francisco-2-e1569628209606.jpg?resize=1200%2C700&ssl=1",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 8,
          "name": "Food on Foot",
          "address": "1625 N. Schrader Blvd., Hollywood, CA 90028",
          "phone": "555-222-3477",
          "category": "food",
          "website": "https://www.foodonfoot.org",
          "description": "Food on Foot is a non-profit organization dedicated to assisting the poor and homeless of Los Angeles through programs that provide nutritious meals, clothing, work opportunities and ultimately the transition to full-time employment and life off the streets.",
          "latitude": "34.100756213851746",
          "longitude": "-118.33274303083851",
          "image": "https://letsvolunteerla.org/wp-content/uploads/2020/04/Screen-Shot-2020-04-18-at-5.36.41-PM.png",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 9,
          "name": "Homeless Healthcare Los Angeles",
          "address": "512 East 4th St. Los Angeles, CA 90013",
          "phone": "555-332-7777",
          "category": "health",
          "website": "https://www.hhcla.org/we-can-help-you",
          "description": "Healthcare and drug detox for the homeless and uninsured.",
          "latitude": "34.04465326933619",
          "longitude": "-118.24115808666475",
          "image": "https://shoutoutla.com/wp-content/uploads/2020/07/2330_facade_3_1592261167872.jpg",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 10,
          "name": "My Friend's Place",
          "address": "5850 Hollywood Blvd., Los Angeles, CA 90028",
          "phone": "555-222-7447",
          "category": "shelter",
          "website": "https://www.myfriendsplace.org/for-youth",
          "description": "Resources include shelter for people ages 12-24, as well as their children and pets, a mobile clinic,HIV testing, food and limited clothing..",
          "latitude": "34.10157094392631",
          "longitude": "-118.31717060193576",
          "image": "https://pbs.twimg.com/media/EqN4PCqVoAAgXsY?format=jpg&name=large",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 11,
          "name": "LAHSA Showers - Westlake/MacArthur Park Region",
          "address": "2230 W. 6th St. Los Angeles, CA. 90057",
          "phone": "555-222-7788",
          "category": "hygiene",
          "website": "https://www.lahsa.org/documents?id=4340-handwashing-station-list",
          "description": "Free showers",
          "latitude": "34.06031211146901",
          "longitude": "-118.2781471750145",
          "image": "https://knockla.wpengine.com/wp-content/uploads/2021/03/1nS6_togHjuYm-cFj-7l6w.jpeg",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 12,
          "name": "LAHSA Showers - South LA",
          "address": "1973 W. 54th St. Los Angeles, CA. 90062 ",
          "phone": "555-222-7977",
          "category": "hygiene",
          "website": "https://www.lahsa.org/documents?id=4340-handwashing-station-list",
          "description": "Free showers",
          "latitude": "33.993761571876085",
          "longitude": "-118.31344108666573",
          "image": "https://d2g8igdw686xgo.cloudfront.net/69633123_1669942924486635_r.",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        },
        {
          "id": 13,
          "name": "LA Food Bank @ St. Athanasius",
          "address": "840 Echo Park Avenue, Los Angeles, CA 90026",
          "phone": "559-222-7777",
          "category": "food",
          "website": "https://saintala.org/community/",
          "description": "Non-profit dedicated to assisting the poor and homeless of Los Angeles through programs that provide nutritious meals, clothing, work opportunities and ultimately the transition to full-time employment and life off the streets.",
          "latitude": "34.07361871862697",
          "longitude": "-118.25912398850926",
          "image": "https://www.lafoodbank.org/wp-content/uploads/hunger-heroes-francisco-la-food-bank-stories-featured-im-la-food-bank-stories-1.jpg",
          "image2": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335829704_156744580600489_5350414182886325858_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=2w11bjHSWZ0AX-mzJ3B&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCIU95Wtei6B75LD7KRshlC7-XOE44x4rbzgdEGDiiRmg&oe=641F3D5D",
          "logo": "https://scontent.fbcn7-3.fna.fbcdn.net/v/t39.30808-6/335609015_536587201699253_6907215227417856075_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=Li5jA9WkX5gAX9Ubs3F&_nc_ht=scontent.fbcn7-3.fna&oh=00_AfCTfuo26ozP5mTY8WoMR0kwyHpLF3NXm8-LfwhIXDFfqA&oe=641660CA"
        }
      ]
      ,
      schedule: [
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 1
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 2
        },
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 3
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 4
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 5
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 6
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 7
        },
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 8
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 9
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 10
        },
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 11
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 12
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 13
        }
      ]
    },
    actions: {
      // ________________________________________________________________LOGIN/TOKEN
      login: async (email, password) => {
        const current_back_url = getStore().current_back_url;
        const opts = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        };
        try {
          const response = await fetch(current_back_url + "/api/login", opts);
          if (response.status !== 200) {
            alert("There has been an error");
            return false;
          }
          const data = await response.json();
          // console.log("Yooooooo data =", data);
          sessionStorage.setItem("token", data.access_token);
          sessionStorage.setItem("is_org", data.is_org);
          sessionStorage.setItem("name", data.name);
          sessionStorage.setItem("avatar", parseInt(data.avatar));
          // console.log("DATA FAVES", data.favorites)
          console.log("HEYOOOO OFFERINGS", data.favoriteOffers, data.favoriteOfferings)
          setStore({
            token: data.access_token,
            is_org: data.is_org,
            avatarID: data.avatar,
            name: data.name,
            favorites: data.favorites,
            favoriteOfferings: data.favoriteOfferings,
          });
          return true;
        } catch (error) {
          console.error(error);
        }
      },
      createUser: async (is_org, name, email, password, userAvatar) => {
        const current_back_url = getStore().current_back_url;
        const opts = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            is_org: is_org,
            name: name,
            email: email,
            password: password,
            userAvatar: userAvatar,
          }),
        };
        try {
          const response = await fetch(
            current_back_url + "/api/createUser",
            opts
          );
          if (response.status >= 400) {
            alert("There has been an error");
            return false;
          }
          const data = await response.json();
          if (data.status == "true") {
          }
          return true;
        } catch (error) {
          console.error(error);
        }
      },
      logout: () => {
        const current_front_url = getStore().current_front_url;
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("is_org");
        sessionStorage.removeItem("name");
        setStore({ token: null, is_org: null, name: null });
        window.location.href = current_front_url + "/";
      },

      // ________________________________________________________________RESOURCES
      createResource: async (
        name,
        address,
        phone,
        resourceType,
        website,
        description,
        latitude,
        longitude,
        picture,
        picture2,
        mondayStart,
        mondayEnd,
        tuesdayStart,
        tuesdayEnd,
        wednesdayStart,
        wednesdayEnd,
        thursdayStart,
        thursdayEnd,
        fridayStart,
        fridayEnd,
        saturdayStart,
        saturdayEnd,
        sundayStart,
        sundayEnd
      ) => {
        const current_back_url = getStore().current_back_url;
        const current_front_url = getStore().current_front_url;
        const token = sessionStorage.getItem("token");
        const opts = {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            name: name,
            address: address,
            phone: phone,
            category: resourceType,
            website: website,
            description: description,
            latitude: latitude,
            longitude: longitude,
            picture: picture,
            picture2: picture2,
            mondayStart: mondayStart,
            mondayEnd: mondayEnd,
            tuesdayStart: tuesdayStart,
            tuesdayEnd: tuesdayEnd,
            wednesdayStart: wednesdayStart,
            wednesdayEnd: wednesdayEnd,
            thursdayStart: thursdayStart,
            thursdayEnd: thursdayEnd,
            fridayStart: fridayStart,
            fridayEnd: fridayEnd,
            saturdayStart: saturdayStart,
            saturdayEnd: saturdayEnd,
            sundayStart: sundayStart,
            sundayEnd: sundayEnd,
          }),
        };
        try {
          const response = await fetch(
            current_back_url + "/api/createResource",
            opts
          );
          if (response.status >= 400) {
            alert("There has been an error");
            return false;
          }
          const data = await response.json();
          if (data.status == "true") {
            window.location.href = current_front_url + "/";
          }
          return true;
        } catch (error) {
          console.error(error);
        }
      },

      addFavorite: (resourceName) => {
        const current_back_url = getStore().current_back_url;
        const favorites = getStore().favorites;
        const token = sessionStorage.getItem("token");
        if (token) {
          const opts = {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              name: resourceName,
            }),
          };
          fetch(current_back_url + "/api/addFavorite", opts)
            .then((response) => response.json())
            .then((data) => {
              if (data.message == "okay") {
                favorites.push(data.favorite);
                // console.log("favorites from addfavorite", favorites);
                setStore({ favorites: favorites });
              }
            });
        }
      },
      popFavorites: (faveList, faveOffers) => {
        if (faveList.length) {
          setStore({ favorites: faveList })
        }
        if (faveOffers.length) {
          setStore({ favoriteOfferings: faveOffers })
        }
      },

      removeFavorite: (resource) => {
        const current_back_url = getStore().current_back_url;
        const favorites = getStore().favorites;
        if (sessionStorage.getItem("token")) {
          const opts = {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({
              name: resource,
            }),
          };
          fetch(current_back_url + "/api/removeFavorite", opts)
            .then((response) => response.json())
            .then((data) => {
              if (data.message == "okay") {
                favorites.forEach((element, index) => {
                  if (element.name == resource) {
                    favorites.splice(index, 1);
                    return;
                  }
                });
                // console.log("favorites from removefavorite", favorites);
                setStore({ favorites: favorites });
              }
            })
            .catch((error) => console.log(error));
        }
      },
      setSearchResults: () => {
        // console.log("CURRENT BACK", getStore().current_back_url)
        let url = window.location.search;
        fetch(getStore().current_back_url + "/api/getResources" + url, {
          method: "GET",
          // mode: "cors",
          headers: {
            "access-control-allow-origin": "*",
            "Content-Type": "application/json",
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({ searchResults: data.data });
            // console.log("search results", getStore().searchResults);
          })
          .catch((error) => console.log(error));
      },

      createComment: async (resource_id, comment_cont, parentId) => {
        const current_back_url = getStore().current_back_url;
        const token = getStore().token;
        const opts = {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            resource_id: resource_id,
            comment_cont: comment_cont,
            parentId: parentId,
          }),
        };
        try {
          const response = await fetch(
            current_back_url + "/api/createComment",
            opts
          );
          if (response.status >= 400) {
            alert("There has been an error");
            return false;
          }
          const data = await response.json();
          return true;
        } catch (error) {
          console.error(error);
        }
      },

      // ________________________________________________________________OFFERINGS
      addFavoriteOffering: (offering) => {
        console.log(offering);
        const current_back_url = getStore().current_back_url;
        let favorites = getStore().favoriteOfferings;
        const token = sessionStorage.getItem("token");
        if (token) {
          const opts = {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              title: offering,
            }),
          };
          fetch(current_back_url + "/api/addFavoriteOffering", opts)
            .then((response) => response.json())
            .then((data) => {
              if (data.message == "okay") {
                console.log("okay");
                favorites.push(data.offering)
                setStore({ favoriteOfferings: favorites })
              }
            });
        }
      },
      removeFavoriteOffering: (offering) => {
        console.log("offering from REMOVE FAVE OFFER FLUX", offering)
        const current_back_url = getStore().current_back_url;
        const token = sessionStorage.getItem("token")
        if (token) {
          fetch(`${current_back_url}/api/removeFavoriteOffering`, {
            method: 'DELETE',
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: offering })
          }).then(response => response.json())
            .then(result => {
              if (result.message == "okay") {
                const favorites = getStore().favoriteOfferings.filter((fav) => fav.title !== offering);
                setStore({ favoriteOfferings: favorites });
                console.log("FAVE OFFERINGS FLUX", getStore().favoriteOfferings)
              }
            })
            .catch(error => {
              console.error('An error occurred while removing favorite offering:', error);
            })
        }
      },
      setOfferings: () => {
        fetch(getStore().current_back_url + "/api/getOfferings")
          .then((response) => response.json())
          .then((data) => {
            setStore({ offerings: data.data });
          })
          .catch((error) => console.log(error));
      },
      createOffering: async (
        title,
        offeringType,
        offeringDescription,
        image,
        image2
      ) => {
        const current_back_url = getStore().current_back_url;
        const token = getStore().token;
        const opts = {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            title: title,
            offering_type: offeringType,
            description: offeringDescription,
            image: image,
            image2: image2,
          }),
        };
        try {
          const response = await fetch(
            current_back_url + "/api/createOffering",
            opts
          );
          if (response.status >= 400) {
            alert("There has been an error");
            return false;
          }
          const data = await response.json();
          return true;
        } catch (error) {
          console.error(error);
        }
      },
      createDrop: async (
        name,
        address,
        phone,
        description,
        type,
        identification,
        image
      ) => {
        const current_back_url = getStore().current_back_url;
        const current_front_url = getStore().current_front_url;
        const token = getStore().token;
        const opts = {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            name: name,
            address: address,
            phone: phone,
            description: description,
            type: type,
            identification: identification,
            image: image,
          }),
        };
        try {
          const response = await fetch(
            current_back_url + "/api/createDrop",
            opts
          );
          if (response.status >= 400) {
            alert("There has been an error");
            return false;
          }
          const data = await response.json();
          if (data.status == "true") {
            window.location.href = current_front_url + "/";
          }
          return true;
        } catch (error) {
          console.error(error);
        }
      },
      getFavorites: () => {
        const currentBackUrl = getStore().current_back_url;
        const token = sessionStorage.getItem("token");
        if (token) {
          const requestOptions = {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            method: "GET",
          };
          fetch(currentBackUrl + "/api/getFavoriteOfferings", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              console.log("favorite offerings", data.favoriteOfferings)
              setStore({ favoriteOfferings: data.favoriteOfferings })
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });

          fetch(currentBackUrl + "/api/getFavorites", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              setStore({ favorites: data.favorites })
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        }
      },
    },
  };
};

export default getState;
