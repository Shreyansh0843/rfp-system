# RFP Management System - Complete Setup Guide

This guide walks you through setting up the complete RFP Management System from scratch.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React, Vite, Tailwind CSS, TypeScript |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| AI | OpenAI GPT-4o-mini API |
| Email | Nodemailer with Gmail SMTP |

---

## 📁 Project Structure

```
rfp-management-system/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (OpenAI, Email)
│   │   ├── scripts/        # Database seeding
│   │   └── utils/          # Utilities (logger)
│   ├── .env               # Environment variables
│   └── package.json
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── lib/           # Utilities
│   └── package.json
│
└── SETUP_GUIDE.md         # This file
```

---

## 🚀 Quick Start

### Step 1: Clone & Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials (see Configuration section)
```

### Step 2: Setup Frontend

```bash
# Navigate to frontend folder (root of this repo)
cd ..

# Install dependencies
npm install
```

### Step 3: Configure Environment Variables

#### Backend `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB - Use local or MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/rfp_management

# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key

# Gmail SMTP (see Gmail Setup section below)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env` file (create in root):

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 5: Seed Database (Optional)

```bash
cd backend
npm run seed
```

---

## ⚙️ Detailed Configuration

### MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```
3. Use connection string: `mongodb://localhost:27017/rfp_management`

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` with your password
5. Example: `mongodb+srv://user:password@cluster.mongodb.net/rfp_management`

---

### OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add to `.env` as `OPENAI_API_KEY`

**Note:** OpenAI charges based on usage. Monitor your usage in the dashboard.

---

### Gmail SMTP Setup

To send emails via Gmail, you need an App Password:

1. Enable 2-Factor Authentication on your Google Account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. Generate App Password:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. Add to `.env`:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # App password (no spaces)
   ```

---

## 📡 API Endpoints

### Vendors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vendors` | Get all vendors |
| GET | `/api/vendors/:id` | Get vendor by ID |
| POST | `/api/vendors` | Create vendor |
| PUT | `/api/vendors/:id` | Update vendor |
| DELETE | `/api/vendors/:id` | Delete vendor |
| GET | `/api/vendors/stats` | Get statistics |

### RFPs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rfps` | Get all RFPs |
| GET | `/api/rfps/:id` | Get RFP by ID |
| POST | `/api/rfps` | Create RFP |
| POST | `/api/rfps/ai-create` | Create RFP from natural language |
| PUT | `/api/rfps/:id` | Update RFP |
| DELETE | `/api/rfps/:id` | Delete RFP |
| POST | `/api/rfps/:id/send` | Send RFP to vendors |
| POST | `/api/rfps/ai-suggestions` | Get AI suggestions |

### Proposals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/proposals` | Get all proposals |
| GET | `/api/proposals/:id` | Get proposal by ID |
| GET | `/api/proposals/rfp/:rfpId` | Get proposals by RFP |
| POST | `/api/proposals` | Submit proposal |
| PUT | `/api/proposals/:id` | Update proposal |
| DELETE | `/api/proposals/:id` | Delete proposal |
| POST | `/api/proposals/:id/analyze` | AI analyze proposal |
| POST | `/api/proposals/compare/:rfpId` | AI compare proposals |

---

## 🎨 Frontend Integration

Create API service files to connect frontend to backend:

### `src/services/api.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Error');
  }
  
  return response.json();
}

export const vendorAPI = {
  getAll: (params?: Record<string, string>) => 
    fetchAPI(`/vendors?${new URLSearchParams(params)}`),
  getById: (id: string) => fetchAPI(`/vendors/${id}`),
  create: (data: any) => fetchAPI('/vendors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/vendors/${id}`, { method: 'DELETE' }),
};

export const rfpAPI = {
  getAll: (params?: Record<string, string>) => 
    fetchAPI(`/rfps?${new URLSearchParams(params)}`),
  getById: (id: string) => fetchAPI(`/rfps/${id}`),
  create: (data: any) => fetchAPI('/rfps', { method: 'POST', body: JSON.stringify(data) }),
  createFromAI: (input: string, deadline?: string) => 
    fetchAPI('/rfps/ai-create', { method: 'POST', body: JSON.stringify({ input, deadline }) }),
  update: (id: string, data: any) => fetchAPI(`/rfps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/rfps/${id}`, { method: 'DELETE' }),
  sendToVendors: (id: string, vendorIds: string[], customMessage?: string) =>
    fetchAPI(`/rfps/${id}/send`, { method: 'POST', body: JSON.stringify({ vendorIds, customMessage }) }),
};

export const proposalAPI = {
  getAll: (params?: Record<string, string>) => 
    fetchAPI(`/proposals?${new URLSearchParams(params)}`),
  getByRFP: (rfpId: string) => fetchAPI(`/proposals/rfp/${rfpId}`),
  getById: (id: string) => fetchAPI(`/proposals/${id}`),
  create: (data: any) => fetchAPI('/proposals', { method: 'POST', body: JSON.stringify(data) }),
  analyze: (id: string) => fetchAPI(`/proposals/${id}/analyze`, { method: 'POST' }),
  compare: (rfpId: string, proposalIds?: string[]) =>
    fetchAPI(`/proposals/compare/${rfpId}`, { method: 'POST', body: JSON.stringify({ proposalIds }) }),
};
```

---

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running (`brew services start mongodb-community` on macOS)

**OpenAI API Error:**
```
Error: Incorrect API key provided
```
Solution: Verify your API key is correct and has credits

**Email Sending Failed:**
```
Error: Invalid login
```
Solution: Use App Password, not regular password. Enable 2FA first.

**CORS Error:**
```
Access to fetch has been blocked by CORS policy
```
Solution: Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the console logs for detailed error messages
3. Ensure all environment variables are correctly set
4. Verify all services (MongoDB, etc.) are running

---

Built with ❤️ using MERN Stack + AI
