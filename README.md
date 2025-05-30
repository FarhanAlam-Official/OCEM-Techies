# 🌐 OCEM Techies – Official Website

Welcome to the official website of **OCEM Techies**, the student tech club of Oxford College of Engineering and Management. This platform serves as the digital hub for our community — offering a modern, responsive interface to showcase our mission, manage club activities, publish updates, and coordinate technical events.

Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, the site is designed for performance, security, and user-friendliness — both for public visitors and our internal team.

## ✨ Key Features

### 🎯 Public Portal
- **Club Information**
  - About OCEM Techies – vision, mission, team
  - Latest news, events, and updates
  - Contact and outreach information
  - Mobile-friendly and accessible design

### 🔐 Admin Dashboard
- **Authentication & Management**
  - Role-based authentication & access control
  - Event creation and management tools
  - Member management and profile settings
  - Real-time notifications system

### 💻 Modern UI/UX
- **User Experience**
  - Fully responsive across all devices
  - Light/Dark mode support
  - Clean and intuitive navigation
  - Beautiful animations and transitions
- **Technical Excellence**
  - Built with Shadcn UI components
  - Optimized performance metrics
  - SEO-friendly structure
  - Accessibility compliance

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Lucide Icons

### Development
- Custom authentication context
- Secure session management
- PostCSS
- CSS Modules

## 📦 Installation

1. **Clone the Repository**
   \`\`\`bash
   git clone https://github.com/FarhanAlam-Official/OCEM-Techies
   cd ocem-techies
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Environment Setup**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   # Core Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Database (if applicable)
   DATABASE_URL=your-database-url
   
   # API Keys (if needed)
   API_KEY=your-api-key
   \`\`\`

4. **Start Development**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) to view the site

## 📁 Project Structure

\`\`\`
├── app/                # Next.js app directory
│   ├── (auth)/        # Authentication routes
│   ├── (dashboard)/   # Admin dashboard
│   └── (public)/      # Public pages
├── components/         # Reusable components
│   ├── admin/         # Admin components
│   ├── public/        # Public components
│   └── ui/            # UI components
├── lib/               # Utility functions
│   ├── auth/          # Authentication logic
│   ├── api/           # API utilities
│   └── utils/         # Helper functions
├── hooks/             # Custom React hooks
├── public/            # Static assets
└── styles/            # Global styles
\`\`\`

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with a single click
4. Enjoy automatic deployments on every push

## 🧪 Testing

Run the test suite:
\`\`\`bash
# Unit tests
npm run test

# E2E tests (if configured)
npm run test:e2e

# Integration tests (if configured)
npm run test:integration
\`\`\`

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch:
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. Commit your changes:
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
4. Push to the branch:
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Farhan Alam** - Project Lead - [GitHub](https://github.com/FarhanAlam-Official)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [Lucide Icons](https://lucide.dev/) - Beautiful Icons
- Oxford College of Engineering and Management for their support

## 📞 Contact

- Website: [OCEM Techies](https://ocem-techies.vercel.app)
- Email: [ocemtechies@gmail.com]
- Twitter: [@OCEMTechies]
- LinkedIn: [OCEM Techies]

---

<div align="center">
Made with ❤️ by Farhan Alam
</div> 