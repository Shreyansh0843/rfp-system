## 🖼️ Screenshots


<details>
<summary>🏠 Dashboard</summary>
<br>
<img src="https://github.com/Shreyansh0843/rfp-system/blob/main/rfp-system-ss/dashboard.png" alt="Dashboard-image" width="100%"/>
</details>

<details>
<summary>📅 RFP Listing Page</summary>
<br>
 <img src="https://github.com/Shreyansh0843/rfp-system/blob/main/rfp-system-ss/RFPListingPage.png" alt="RFP-LISTING-PAGE" width="100%"/>
</details>

<details>
<summary>👤 Vendor List Page</summary>
<br>
 <img src = "https://github.com/Shreyansh0843/rfp-system/blob/main/rfp-system-ss/VendorListPage.png" alt = "Vendor List Page" width = "100% />
</details>

<details>
<summary>👤 Adding New Vendor</summary>
<br>
<img src="https://github.com/Shreyansh0843/rfp-system/blob/main/rfp-system-ss/AddNewVendorPage.png" alt="Adding-New-Vendor" width="100%" />
</details>

<details>
<summary>📅 Create RFP Page</summary>
<br>
<img src="https://github.com/Shreyansh0843/rfp-system/blob/main/rfp-system-ss/CreateRFPpage.png" alt="Create-RFP-Page" width="100%" />
</details>

<h1 align="center">
  RFP MANAGEMENT SYSTEM
</h1>


# 🤖 AI-Powered RFP Management System

A comprehensive full-stack procurement management platform built with the MERN stack and AI integration, enabling seamless RFP creation, vendor management, automated proposal parsing, and intelligent recommendation system.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered RFP Creation**: Describe requirements in natural language, AI converts to structured RFP
- **Intelligent Vendor Management**: Maintain comprehensive vendor database with contact information
- **Automated Email Distribution**: Send RFPs to multiple vendors via real email (SMTP/IMAP)
- **Smart Proposal Parsing**: AI automatically extracts pricing, terms, and conditions from vendor emails
- **AI-Powered Comparison**: Intelligent analysis and scoring of proposals with detailed recommendations
- **Real-time Dashboard**: Track RFPs, vendors, and proposals with live statistics

### 🚀 Advanced Features
- **Natural Language Processing**: GPT-4 powered RFP generation from conversational input
- **Email Integration**: Bidirectional email communication (send RFPs, receive proposals)
- **Automated Data Extraction**: AI parses unstructured vendor responses into structured data
- **Intelligent Scoring System**: AI evaluates proposals based on price, delivery, terms, and completeness
- **Vendor Recommendations**: AI provides detailed reasoning for vendor selection
- **Responsive Design**: Modern UI with dark sidebar and gradient accents

## 🛠️ Tech Stack

### Frontend
- **React.js 18**: Component-based UI development
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API requests
- **React Toastify**: Beautiful notifications
- **date-fns**: Date formatting and manipulation

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **OpenAI GPT-4**: AI-powered parsing and analysis
- **Nodemailer**: Email sending (SMTP)
- **IMAP**: Email receiving and parsing
- **JWT**: Token-based authentication (ready for future implementation)
- **Express Validator**: Request validation

### Third-Party Services
- **OpenAI API**: Natural language processing and intelligent analysis
- **Gmail SMTP/IMAP**: Email communication infrastructure
- **MongoDB Atlas**: Cloud database hosting (optional)

## 🏗️ System Architecture
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Backend    │ ◄─────► │   MongoDB   │
│   (React)   │  REST   │  (Express)   │         │  Database   │
└─────────────┘  API    └──────────────┘         └─────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼─────┐      ┌─────▼─────┐
              │  OpenAI   │      │   Email   │
              │   GPT-4   │      │   SMTP    │
              └───────────┘      │   IMAP    │
                                 └───────────┘
```

### Workflow Diagram
```
User Input (Natural Language)
         │
         ▼
   OpenAI GPT-4 Parsing
         │
         ▼
   Structured RFP Created
         │
         ▼
   Select Vendors & Send Email
         │
         ▼
   Vendors Reply via Email
         │
         ▼
   AI Parses Email Responses
         │
         ▼
   AI Compares & Scores Proposals
         │
         ▼
   AI Recommendation Generated
```

## 📦 Installation

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)
- **Gmail Account** with App Password - [Setup Guide](https://support.google.com/accounts/answer/185833)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rfp-management-system.git
cd rfp-management-system
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables** (see below)

5. **Seed Database** (Optional but recommended)
```bash
cd backend
node src/scripts/seed.js
```

6. **Start the Application**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Environment Variables

### Backend `.env`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/rfp_system

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-16-char-app-password
IMAP_TLS=true

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=RFP Management System
```

### 📧 Gmail Setup Guide

To use Gmail for sending/receiving emails:

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Add to `.env`**
```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd-efgh-ijkl-mnop
   IMAP_USER=your-email@gmail.com
   IMAP_PASSWORD=abcd-efgh-ijkl-mnop
```

## 📚 API Documentation

### Authentication Endpoints
*Note: Authentication endpoints ready for future implementation*

### Vendor Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/vendors` | Get all vendors with pagination | No |
| GET | `/api/vendors/:id` | Get vendor by ID | No |
| POST | `/api/vendors` | Create new vendor | No |
| PUT | `/api/vendors/:id` | Update vendor | No |
| DELETE | `/api/vendors/:id` | Delete vendor | No |
| GET | `/api/vendors/stats` | Get vendor statistics | No |

### RFP Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/rfps` | Get all RFPs with pagination | No |
| GET | `/api/rfps/:id` | Get RFP by ID with items | No |
| POST | `/api/rfps` | Create RFP from natural language | No |
| PUT | `/api/rfps/:id` | Update RFP | No |
| DELETE | `/api/rfps/:id` | Delete RFP | No |
| POST | `/api/rfps/:id/send` | Send RFP to vendors via email | No |
| GET | `/api/rfps/stats` | Get RFP statistics | No |



### Proposal Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/proposals/rfp/:rfpId` | Get all proposals for an RFP | No |
| GET | `/api/proposals/:id` | Get proposal by ID | No |
| POST | `/api/proposals` | Create proposal (manual/testing) | No |
| GET | `/api/proposals/rfp/:rfpId/compare` | AI-powered proposal comparison | No |
| POST | `/api/proposals/check-emails` | Check for new email responses | No |
| PATCH | `/api/proposals/:id/status` | Update proposal status | No |
| DELETE | `/api/proposals/:id` | Delete proposal | No |



## 📁 Project Structure
```
rfp-management-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── vendorController.js   # Vendor business logic
│   │   │   ├── rfpController.js      # RFP business logic
│   │   │   └── proposalController.js # Proposal business logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Global error handling
│   │   │   └── validateRequest.js    # Request validation
│   │   ├── models/
│   │   │   ├── Vendor.js            # Vendor schema
│   │   │   ├── RFP.js               # RFP schema
│   │   │   └── Proposal.js          # Proposal schema
│   │   ├── routes/
│   │   │   ├── vendorRoutes.js      # Vendor endpoints
│   │   │   ├── rfpRoutes.js         # RFP endpoints
│   │   │   └── proposalRoutes.js    # Proposal endpoints
│   │   ├── services/
│   │   │   ├── openaiService.js     # OpenAI integration
│   │   │   └── emailService.js      # Email integration
│   │   ├── utils/
│   │   │   └── logger.js            # Logging utility
│   │   ├── scripts/
│   │   │   └── seed.js              # Database seeding
│   │   └── server.js                # Application entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Reusable components
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   ├── ErrorDisplay.js
│   │   │   │   ├── EmptyState.js
│   │   │   │   ├── ConfirmDialog.js
│   │   │   │   └── Modal.js
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.js       # Navigation sidebar
│   │   │   │   └── Layout.js        # Main layout wrapper
│   │   │   ├── vendors/
│   │   │   │   ├── VendorList.js
│   │   │   │   └── VendorModal.js
│   │   │   ├── rfps/
│   │   │   │   ├── RFPList.js
│   │   │   │   ├── CreateRFP.js
│   │   │   │   ├── RFPDetails.js
│   │   │   │   └── SendRFP.js
│   │   │   └── proposals/
│   │   │       ├── ProposalsList.js
│   │   │       ├── CreateProposalModal.js
│   │   │       └── CompareProposals.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── VendorsPage.js
│   │   │   ├── RFPsPage.js
│   │   │   ├── CreateRFPPage.js
│   │   │   ├── RFPDetailsPage.js
│   │   │   ├── SendRFPPage.js
│   │   │   ├── ProposalsPage.js
│   │   │   ├── CompareProposalsPage.js
│   │   │   ├── ProposalDetailsPage.js
│   │   │   └── SettingsPage.js
│   │   ├── services/
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── vendorService.js     # Vendor API calls
│   │   │   ├── rfpService.js        # RFP API calls
│   │   │   └── proposalService.js   # Proposal API calls
│   │   ├── utils/
│   │   │   └── helpers.js           # Utility functions
│   │   ├── contexts/
│   │   │   └── AppContext.js        # Global state
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css                # Tailwind + custom styles
│   ├── .env
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

## 📖 Usage Guide

### For Procurement Managers

#### 1. Create an RFP
- Navigate to Dashboard → Click "Create New RFP"
- Describe requirements in natural language:
```
  Example: "I need 20 laptops with 16GB RAM and Intel i7 processor, 
  and 15 monitors 27-inch with 4K resolution. Budget is $50,000. 
  Need delivery within 30 days. Payment Net 30, warranty 2 years."
```
- AI automatically creates structured RFP with items, budget, and terms
- Review and confirm the parsed information

#### 2. Manage Vendors
- Add vendors with contact information
- Search and filter vendors by name or category
- Update vendor details and status
- View vendor performance history

#### 3. Send RFP to Vendors
- Select an RFP → Click "Send to Vendors"
- Choose vendors from your database
- System sends professional emails with RFP details
- Track which vendors received the RFP

#### 4. Receive & Review Proposals
- Vendors reply via email with their proposals
- Click "Check Emails" to automatically parse responses
- AI extracts pricing, delivery times, and terms
- View all proposals in a structured format

#### 5. Compare Proposals with AI
- Navigate to RFP → Click "Compare with AI"
- AI analyzes all proposals based on:
  - Price competitiveness
  - Delivery timeline
  - Payment terms
  - Warranty offerings
  - Proposal completeness
- View AI-generated scores (0-100)
- Read detailed summaries for each vendor
- Get clear recommendation with reasoning

#### 6. Make Decision
- Review AI recommendation
- Examine detailed proposal comparisons
- Consider additional factors
- Accept proposal and notify vendor

### Testing the System

#### Quick Test Flow
1. **Add Test Vendors**
```
   - TechSupply Inc (use your email for testing)
   - Global Electronics
```

2. **Create Sample RFP**
```
   Input: "Need 10 laptops, budget $15,000, delivery 20 days"
```

3. **Send to Vendors**
```
   - Select vendors
   - Check your email inbox for RFP
```

4. **Create Test Proposal**
```
   - Use "Add Proposal" button
   - Paste sample vendor response
   - AI will parse automatically
```

5. **Compare Proposals**
```
   - View AI scores and summaries
   - See recommendation
```

## 🔮 Future Enhancements

### Planned Features
- [ ] **User Authentication & Authorization**
  - Multi-user support with role-based access
  - Secure login/logout functionality
  - Team collaboration features

- [ ] **Advanced AI Features**
  - Custom AI training on historical RFPs
  - Predictive analytics for vendor selection
  - Automated negotiation suggestions
  - Risk assessment for proposals

- [ ] **Enhanced Email Features**
  - Real-time email notifications
  - Email templates customization
  - Automated follow-up emails
  - Email tracking (opens, clicks)

- [ ] **Analytics & Reporting**
  - Comprehensive dashboards
  - Export to PDF/Excel
  - Cost savings analysis
  - Vendor performance metrics

- [ ] **Integration & Automation**
  - ERP system integration
  - Calendar sync for deadlines
  - Slack/Teams notifications
  - Webhook support

- [ ] **Document Management**
  - PDF/Word document parsing
  - File attachments support
  - Version control for RFPs
  - Digital signatures

- [ ] **Mobile Application**
  - React Native mobile app
  - Push notifications
  - Offline mode support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Update documentation for new features
- Add tests for new functionality
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shreyansh Priyadarshi**
- GitHub: [@Shreyansh0843](https://github.com/Shreyansh0843)
- LinkedIn: [Shreyansh Priyadarshi](https://linkedin.com/in/shreyansh20)
- Email: shreyansh@example.com

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API providing intelligent parsing and analysis
- **MongoDB** for flexible NoSQL database
- **Nodemailer** for email integration
- **React** and **Tailwind CSS** communities for excellent documentation
- All open-source libraries used in this project

## 📞 Support

For issues, questions, or suggestions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [existing issues](https://github.com/yourusername/rfp-management-system/issues)
3. Open a new issue with detailed description
4. Contact: shreyansh@example.com

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/rfp-management-system&type=Date)](https://star-history.com/shreyansh0843/rfp-management-system&Date)

---

<p align="center">
  Made with ❤️ using MERN Stack + AI
</p>

<p align="center">
  <a href="#top">Back to top ⬆️</a>
</p>
```

---

## Additional Files to Create

### 1. **`LICENSE`**
```
MIT License

Copyright (c) 2025 Shreyansh Priyadarshi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

