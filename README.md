# Smart Recipe Generator

A modern web application that suggests recipes based on available ingredients, built with Next.js, MongoDB, and advanced recipe-matching algorithms.

## Key Features

- **Ingredient-Based Recipe Search**: Input available ingredients and get matching recipes
- **Smart Recipe Matching**: Finds recipes based on available ingredients with substitution suggestions
- **Text Search**: Search by recipe name, cuisine, or dish type
- **Advanced Filtering**: Filter by difficulty, cooking time, dietary restrictions, and cuisine
- **Serving Size Adjustment**: Dynamically adjust ingredient quantities
- **User Authentication**: Secure registration and login system
- **Favorites System**: Save and manage favorite recipes
- **Recipe Rating**: Rate recipes and receive personalized recommendations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Enhanced UX with Framer Motion
- **Recipe Database**: 20+ curated recipes with nutritional info, steps, and substitutions

## Live Demo & Repository

- **Application URL**: https://recipe-generator-fefr9tl57-vikas-s-projects-4c095660.vercel.app/
- **GitHub Repository**: https://github.com/vikas-dev2002/recipe-generator

## Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript  
- **Styling**: Tailwind CSS, shadcn/ui components  
- **Animations**: Framer Motion  
- **Backend**: Next.js API Routes  
- **Database**: MongoDB Atlas  
- **Authentication**: JWT-based system  
- **Deployment**: Vercel  

## Installation & Setup

### Prerequisites
- Node.js 18+  
- MongoDB Atlas account  

### Steps
1. Clone the repository:  
```bash
git clone https://github.com/vikas-dev2002/recipe-generator.git
cd recipe-generator

## Technical Stack
Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, MongoDB Atlas, JWT authentication
## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── discover/          # Recipe discovery page
│   ├── favorites/         # User favorites page
│   └── recipes/           # Recipe listing and detail pages
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (header, navigation)
│   ├── recipe/            # Recipe-related components
│   ├── search/            # Search and filter components
│   └── ui/                # shadcn/ui base components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and services
├── public/                # Static assets and recipe images
└── scripts/               # Database seeding scripts
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Recipes
- `GET /api/recipes` - Get all recipes with pagination
- `GET /api/recipes/[id]` - Get specific recipe details
- `GET /api/recipes/search` - Text-based recipe search
- `POST /api/recipes/ingredients` - Ingredient-based recipe matching
- `GET /api/recipes/filter` - Advanced recipe filtering

### User Features
- `POST /api/favorites` - Add/remove favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/ratings` - Rate recipes

## 🧠 Technical Approach

### Ingredient Classification & Matching
The application uses a sophisticated ingredient matching algorithm that:
- Normalizes ingredient names (handles plurals, common variations)
- Implements fuzzy matching for ingredient recognition
- Calculates recipe compatibility scores based on available ingredients
- Suggests ingredient substitutions using a predefined mapping system

### Recipe Matching Logic
- **Exact Match**: Recipes where user has all required ingredients
- **Partial Match**: Recipes where user has 70%+ of ingredients, sorted by compatibility
- **Substitution Suggestions**: Alternative ingredients for missing items
- **Dietary Filtering**: Real-time filtering based on dietary restrictions

### Error Handling & UX
- Comprehensive error boundaries and fallback UI
- Loading states with skeleton components
- Optimistic updates for better perceived performance
- Toast notifications for user feedback
- Form validation with clear error messages

### Performance Optimizations
- Server-side rendering for SEO and initial load performance
- Image optimization with Next.js Image component
- Lazy loading for recipe cards and images
- Debounced search inputs to reduce API calls
- MongoDB indexing for fast query performance

## 🎨 Design System

- **Color Palette**: Modern purple accent with neutral grays
- **Typography**: Geist Sans for headings, system fonts for body text
- **Components**: Consistent design system using shadcn/ui
- **Responsive**: Mobile-first approach with Tailwind CSS
- **Animations**: Subtle Framer Motion animations for enhanced UX

## 🚀 Deployment

The application is deployed on Vercel with:
- Automatic deployments from GitHub
- Environment variables configured in Vercel dashboard
- MongoDB Atlas for production database
- CDN optimization for static assets

## 📱 Mobile Responsiveness

- Responsive grid layouts that adapt to screen size
- Touch-friendly interface elements
- Optimized images for different device densities
- Mobile navigation with collapsible sidebar

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Password hashing using bcrypt
- Input validation and sanitization
- CORS configuration for API security
- Environment variable protection

## 🧪 Testing & Quality

- TypeScript for type safety
- ESLint and Prettier for code consistency
- Error boundaries for graceful error handling
- Loading states and fallback UI
- Input validation on both client and server

