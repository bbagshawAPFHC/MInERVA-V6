# MInERVA

**M**edical **In**formation and **E**lectronic **R**ecord **V**ault **A**pplication

![MInERVA Logo](https://github.com/bbagshawAPFHC/MInERVA-V4/blob/main/frontend/public/minerva_256.png)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-4.3.9-646CFF?logo=vite)](https://vitejs.dev/)
[![Azure AD](https://img.shields.io/badge/Azure_AD-Integrated-0078D4?logo=microsoft-azure)](https://azure.microsoft.com/)
[![Mantine](https://img.shields.io/badge/Mantine-2.0.0-06B6D4?logo=mantine)](https://mantine.dev/)

## Empowering Healthcare Professionals with Secure, Efficient, and Comprehensive Patient Data Management

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Structure](#structure)
- [Logic Flow Diagrams](#logic-flow-diagrams)
- [Dependency and Interaction Table](#dependency-and-interaction-table)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Docs](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

MInERVA is a cutting-edge, full-stack application designed to revolutionize the way healthcare professionals manage and access medical information and electronic health records. With its intuitive interface and powerful backend, MInERVA offers seamless patient data retrieval, visualization, and export capabilities, all while maintaining the highest standards of security and compliance.

## Features

- 🔐 **Robust Security**: Azure AD integration for enterprise-grade authentication
- 🔍 **Advanced Search**: Lightning-fast patient lookup across multiple parameters
- 📤 **Bulk Export**: Effortlessly compile and download comprehensive patient data
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- 🚀 **High Performance**: Optimized for speed and efficiency, even with large datasets
- 🔄 **Real-time Updates**: Stay synchronized with the latest patient information
- 📊 **Data Visualization**: Intuitive display of patient information and file structure
- 🎨 **Modern UI**: Clean and intuitive interface built with Tailwind CSS

## Tech Stack

| Frontend | Backend | Database | Authentication | Build Tool |
| --- | --- | --- | --- | --- |
| ![React](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg) ![TypeScript](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg) ![Tailwind CSS](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg) | ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) ![Express](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg) | ![MongoDB](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg) | ![Azure AD](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg) | ![Vite](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg) ![Mantine](https://avatars.githubusercontent.com/u/79146003?s=200&v=4) |

## Structure

## Logic Flow Diagrams

### Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (LoginPage)
    participant B as Backend (AuthController)
    participant AD as Azure AD

    U->>F: Enter credentials and click login
    F->>B: Send login request
    B->>AD: Validate credentials
    AD-->>B: Return authentication token
    B-->>F: Send token
    F->>F: Store token
    F->>U: Redirect to SearchPatients page
```

### File Download Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (SearchPatients)
    participant B as Backend (FileController)
    participant FS as File System

    U->>F: Click "Download All" button
    F->>B: Send bulk download request
    B->>FS: Fetch requested files
    FS-->>B: Return files
    B->>B: Create zip archive
    B-->>F: Send zip file
    F->>U: Initiate zip download

    U->>F: Click individual file download
    F->>B: Request single file
    B->>FS: Fetch file
    FS-->>B: Return file
    B-->>F: Send file
    F->>U: Initiate file download
```

### Patient Search Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (SearchPatients)
    participant B as Backend (PatientController)
    participant DB as MongoDB

    U->>F: Enter search query
    F->>B: Send search request
    B->>DB: Query database
    DB-->>B: Return matching patients
    B-->>F: Send patient list
    F->>U: Display search results

    U->>F: Click on a patient
    F->>B: Request patient details
    B->>DB: Fetch patient data
    DB-->>B: Return patient details
    B-->>F: Send patient details
    F->>U: Display patient information
```

## Dependency and Interaction Table

| Directory | File | Description | Depends On | Depended By |
|-----------|------|-------------|------------|-------------|
| frontend | src/main.tsx | Entry point for the React app | App.tsx, index.css | index.html |
| frontend | src/App.tsx | Main component, handles routing | components/*, services/authService.ts, utils/api.ts | main.tsx |
| frontend | src/components/LoginPage.tsx | Handles user login | services/authService.ts | App.tsx |
| frontend | src/components/SearchPatients.tsx | Patient search and results display | utils/api.ts, types/index.ts | App.tsx |
| frontend | src/components/Header.tsx | App header with user info | services/authService.ts | App.tsx |
| frontend | src/components/Sidebar.tsx | Navigation sidebar | - | App.tsx |
| frontend | src/services/authService.ts | Authentication logic | - | LoginPage.tsx, App.tsx |
| frontend | src/utils/api.ts | API calls to backend | - | SearchPatients.tsx, other components |
| frontend | src/types/index.ts | TypeScript type definitions | - | Most .tsx files |
| frontend | vite.config.ts | Vite configuration | - | Build process |
| frontend | tailwind.config.js | Tailwind CSS configuration | - | CSS processing |
| frontend | .env.local | Environment variables | - | App.tsx, api.ts |
| backend | src/index.ts | Entry point for the server | config/db.ts, routes/* | - |
| backend | src/config/db.ts | Database connection setup | - | index.ts |
| backend | src/controllers/patientController.ts | Handles patient-related logic | models/*, utils/modelLoader.ts | routes/patientRoutes.ts |
| backend | src/controllers/fileController.ts | Handles file operations | - | routes/fileRoutes.ts |
| backend | src/controllers/bulkDownloadController.ts | Manages bulk file downloads | - | routes/fileRoutes.ts |
| backend | src/controllers/demographicController.ts | Manages demographic data | models/DemographicModel.ts | routes/demographicRoutes.ts |
| backend | src/controllers/readOnlyController.ts | Handles read-only operations | models/* | routes/readOnlyRoutes.ts |
| backend | src/models/DemographicModel.ts | Mongoose model for demographics | - | controllers/demographicController.ts |
| backend | src/models/index.ts | Exports all models | - | controllers/* |
| backend | src/routes/patientRoutes.ts | Defines patient-related routes | controllers/patientController.ts | index.ts |
| backend | src/routes/fileRoutes.ts | Defines file-related routes | controllers/fileController.ts, controllers/bulkDownloadController.ts | index.ts |
| backend | src/routes/demographicRoutes.ts | Defines demographic routes | controllers/demographicController.ts | index.ts |
| backend | src/routes/readOnlyRoutes.ts | Defines read-only routes | controllers/readOnlyController.ts | index.ts |
| backend | src/utils/modelLoader.ts | Dynamically loads Mongoose models | - | controllers/* |
| backend | .env | Environment variables | - | config/db.ts, index.ts |

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- MongoDB (v5.0 or later)
- Azure AD account with a registered application

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/minerva.git
   cd minerva
   ```
  
2. Set up backend:
  
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Edit .env with your configuration
    ```
  
3. Set up frontend:
  
    ```bash
    cd ../frontend
    npm install
    cp .env.example .env
    # Edit .env with your configuration
    ```
  
In the `.env` file for the backend, configure the following variables:

- `AZURE_APP_CLIENT_ID`= Your_Azure_Client_ID
- `AZURE_APP_TENANT_ID`= Your_Azure_Tenant_ID
- `AZURE_AD_CLIENT_SECRET` = Your_Azure_Client_Secret
- `MONGODB_URI`= mongodb://username:password@localhost:27017/collectionname
- `PORT` = 5000
- `EXPORT_FILES_PATH` = Path_To_Your_Exported_Files

In the `.env` file for the frontend, configure the following variables:

- `VITE_AZURE_CLIENT_ID`= Your_Azure_Client_ID
- `VITE_AZURE_TENANT_ID`= Your_Azure_Tenant_ID
- `VITE_API_URL`= <http://localhost:5000>

  Make sure to replace the placeholder values with your actual configuration.

4. Start the development servers:

   ```bash
   # In the backend directory
   npm run dev

   # In the frontend directory (new terminal)
   npm run dev
   ```

Visit `http://localhost:5173` to access MInERVA.

## Usage

1. Log in using your Azure AD credentials.
2. Use the search functionality to find patients by various criteria.
3. View comprehensive patient information and associated files.
4. Download individual files or perform bulk downloads of patient data.
5. Navigate through different views using the intuitive interface.

## API Documentation

For detailed API specifications, please refer to our [API Documentation](API_DOCUMENTATION.md).

## Contributing

We welcome contributions from the community! Please check out our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## License

MInERVA is open-source software licensed under the [GNU General Public License v3.0](LICENSE).

## Contact

For support, feature requests, or inquiries, please [open an issue](https://github.com/yourusername/minerva/issues) or contact us at [minerva-support@example.com](mailto:minerva-support@example.com).

---

Made with ❤️ by Brody B, A Plus Family HealthCare

[⬆ Back to Top](#minerva)
