# Webflow Pricing Calculator

A modern, interactive pricing wizard that helps users find the perfect Webflow plan based on their specific needs and requirements.

## ✨ Features

- **6-Step Guided Wizard**: Intuitive flow from site type selection to final recommendations
- **Smart Recommendations**: AI-powered plan suggestions based on user inputs
- **Modern UI Design**: Clean, responsive interface matching Webflow's brand standards
- **Interactive Elements**: Hover states, smooth transitions, and engaging user experience
- **Comprehensive Analysis**: Traffic estimation, content frequency, advanced features, and team requirements
- **Complete Font Integration**: Full WF Visual Sans font family included

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Fonts**: WF Visual Sans (Display & Text variants)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/webflow-pricing-calculator.git
   cd webflow-pricing-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
webflow-pricing-calculator/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── pricing-wizard/
│       ├── page.tsx               # Main wizard component
│       ├── components/            # Wizard-specific components
│       └── steps/                 # Individual step components
├── components/ui/                 # Reusable UI components
├── lib/                          # Utility functions and data
├── public/
│   ├── fonts/                    # WF Visual Sans font files
│   └── webflow-pricing-bg.png    # Background image
└── styles/
    └── globals.css               # Global styles and font declarations
```

## 🎯 Wizard Steps

1. **Site Type Selection**: Choose from Marketing Website, Blog, Portfolio, or Other
2. **Traffic Estimation**: Input expected monthly visitors with smart presets
3. **Content Frequency**: Select how often content will be updated
4. **Advanced Features**: Optional add-ons like analytics, localization, A/B testing
5. **Plan Recommendation**: AI-generated suggestions based on requirements
6. **Team & Workspace**: Team size, guest access, and enterprise features

## 🎨 Design System

- **Colors**: Webflow brand blue (#146EF5) with carefully selected grays
- **Typography**: WF Visual Sans Display for headings, WF Visual Sans Text for body
- **Spacing**: Consistent 8px grid system
- **Components**: Clean cards with subtle shadows and hover states
- **Interactions**: Smooth transitions and intuitive feedback

## 🔧 Customization

The pricing logic is easily customizable in:
- `lib/pricing.ts` - Plan pricing and limits
- `lib/recommendPlan.ts` - Recommendation algorithm
- `lib/workspaceData.ts` - Workspace plans and features

## 📱 Responsive Design

Fully responsive design optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Webflow's official pricing page
- Built with love using modern web technologies
- Font files courtesy of Webflow's design system

---

**Note**: This is a demonstration project and is not officially affiliated with Webflow Inc. 