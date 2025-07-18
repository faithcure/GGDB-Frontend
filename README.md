# 🎮 GGDB Frontend

Modern React frontend for GGDB (Game Database) - A responsive web application for game discovery, reviews, and community interaction built with Vite and Tailwind CSS.

## 🚀 Features

- **Game Discovery** - Browse and search games database
- **Reviews & Ratings** - Write and read game reviews
- **User Profiles** - Customizable profiles with gaming stats
- **Admin Dashboard** - Administrative controls and analytics
- **Responsive Design** - Mobile-first responsive interface
- **Modern UI** - Clean design with Tailwind CSS
- **Fast Performance** - Vite build system and optimizations
- **Real-time Updates** - Dynamic content updates

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── admin/        # Admin panel components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Shared UI components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── game/         # Game-related components
│   │   ├── home/         # Homepage components
│   │   ├── layout/       # Layout components
│   │   └── profile/      # User profile components
│   ├── config/           # Configuration files
│   ├── context/          # React Context providers
│   ├── data/             # Static data and constants
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── index.js          # Entry point
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/faithcure/GGDB-Frontend.git
   cd GGDB-Frontend
   npm install
   ```

2. **Environment Setup**
   
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

App runs on http://localhost:3000

## 🎨 Key Components

### Layout Components
- **Header** - Navigation and user menu
- **Footer** - Site information and links
- **MainMenu** - Primary navigation
- **UserMenu** - User-specific actions

### Page Components
- **GameDetail** - Game information and reviews
- **NewDashboard** - User dashboard with stats
- **AdminDashboard** - Admin management interface
- **Login/Register** - Authentication forms

### Common Components
- **GameCard** - Reusable game display card
- **FormField** - Standardized form inputs
- **ErrorBoundary** - Error handling wrapper
- **PageTransition** - Smooth transitions

## 🔐 Authentication

- JWT token-based authentication
- Protected routes with role-based access
- User registration and login forms
- Password strength validation
- Automatic token refresh

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly interface
- Optimized for all screen sizes

## 🎯 State Management

- React Context API for global state
- Local component state with useState
- Custom hooks for data fetching
- Efficient re-rendering patterns

## 📊 Performance

- Code splitting with React.lazy
- Image optimization and lazy loading
- Bundle size optimization
- Efficient component rendering

## 📝 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm test           # Run tests
```

## 🧪 Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy 'build' folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

### Development Guidelines
- Follow React best practices
- Use functional components with hooks
- Write tests for new features
- Follow existing code style
- Update documentation as needed

## 📄 License

ISC License

## 🔗 Links

- **Backend Repository**: https://github.com/faithcure/GGDB-Backend
- **Main Repository**: https://github.com/faithcure/GGDB

---

**Made with ❤️ by the GGDB Team**