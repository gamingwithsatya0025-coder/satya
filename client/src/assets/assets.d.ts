export interface Car {
    _id: string;
    owner: string;
    brand: string;
    model: string;
    image: string;
    year: number;
    category: string;
    seating_capacity: number;
    fuel_type: string;
    transmission: string;
    pricePerDay: number;
    location: string;
    description: string;
    isAvaliable: boolean;
    createdAt: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: string;
}

export const assets: {
    logo: string;
    gmail_logo: string;
    facebook_logo: string;
    instagram_logo: string;
    twitter_logo: string;
    menu_icon: string;
    search_icon: string;
    close_icon: string;
    users_icon: string;
    edit_icon: string;
    car_icon: string;
    location_icon: string;
    fuel_icon: string;
    addIcon: string;
    carIcon: string;
    carIconColored: string;
    dashboardIcon: string;
    dashboardIconColored: string;
    addIconColored: string;
    listIcon: string;
    listIconColored: string;
    cautionIconColored: string;
    calendar_icon_colored: string;
    location_icon_colored: string;
    arrow_icon: string;
    star_icon: string;
    check_icon: string;
    tick_icon: string;
    delete_icon: string;
    eye_icon: string;
    eye_close_icon: string;
    filter_icon: string;
    testimonial_image_1: string;
    testimonial_image_2: string;
    main_car: string;
    banner_car_image: string;
    car_image1: string;
    upload_icon: string;
    user_profile: string;
    car_image2: string;
    car_image3: string;
    car_image4: string;
};

export const cityList: string[];
export const dummyCarData: Car[];
export const dummyUserData: User;
export const menuLinks: { name: string; path: string }[];
export const ownerMenuLinks: { name: string; path: string; icon: string; coloredIcon: string }[];
