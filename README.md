# Fashion Ecommerce Client - React Version

## Overview
This is the React version of the Fashion Ecommerce Client application, migrated from Vue.js.

## Tech Stack
- **React 18.3** - UI Library
- **React Router 7** - Routing
- **Ant Design 5** - UI Component Library
- **Zustand** - State Management
- **Axios** - HTTP Client
- **Tailwind CSS 3** - Styling
- **Vite 6** - Build Tool
- **AOS** - Animation on Scroll
- **Moment.js** - Date/Time formatting
- **EmailJS** - Email integration

## Setup

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Then edit .env with your API URL
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── apis/           # API service functions
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable React components
├── layouts/        # Layout components
├── pages/          # Page components
├── routers/        # Route configurations
├── stores/         # Zustand stores
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── App.jsx         # Main App component
├── main.jsx        # Entry point
├── axios.js        # Axios configuration
└── style.css       # Global styles
```

## Migration Status

This project is currently being migrated from Vue.js to React. The following components need to be converted:

### Pages
- [ ] Home
- [ ] Product Listing
- [ ] Product Detail
- [ ] Cart
- [ ] Checkout
- [ ] Order History
- [ ] User Profile
- [ ] Login/Register

### Components
- [ ] Header/Navigation
- [ ] Footer
- [ ] ProductCard
- [ ] CartItem
- [ ] SearchBar
- [ ] Filter components

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Features

- Product Browsing & Search
- Shopping Cart
- User Authentication
- Order Management
- Payment Integration
- Email Notifications
- Responsive Design
- Smooth Animations

## Contributing

Please follow the existing code structure and naming conventions when adding new components.
