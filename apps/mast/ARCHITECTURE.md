# MAST (Management Assessment and Systems Tool) - Architecture Document

> **Version:** 2.0 (Refreshed)
> **Date:** March 2026
> **Status:** Ready for Development
> **Client:** Marine and Safety Tasmania (MAST)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Admin UI   │  │   Manager   │  │  Viewer UI  │             │
│  │             │  │    UI       │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Contributor UI (Data Entry/Upload)          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Next.js 16 (App Router) + Authentication Middleware   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
│   Supabase      │ │   Supabase      │ │   External Services     │
│   Auth          │ │   Database      │ │   - Excel (xlsx)        │
│   (Auth)        │ │   (Data)        │ │   - PDF Generator       │
└─────────────────┘ └─────────────────┘ └─────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 16 + React 19 | UI Framework |
| Styling | Tailwind CSS v4 | Styling |
| Database | Supabase (PostgreSQL) | Primary Data Store |
| Auth | Supabase Auth | User Authentication |
| File Processing | xlsx (SheetJS) | Excel Parsing |
| PDF Generation | @react-pdf/renderer | PDF Reports |
| Deployment | Vercel | Hosting |

---

## 2. Database Architecture

### 2.1 Schema Overview

```sql
-- Core Tables

-- Organizations (Multi-tenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Management Themes (6 themes for MAST)
CREATE TABLE management_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Domains (19 domains for MAST)
CREATE TABLE risk_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    theme_id UUID REFERENCES management_themes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risks (200+ risks for MAST)
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    risk_domain_id UUID REFERENCES risk_domains(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    inherent_risk INTEGER,  -- 1-5 scale
    current_risk INTEGER,    -- 1-5 scale
    residual_risk INTEGER,   -- 1-5 scale
    risk_type VARCHAR(50),   -- 'strategic' or 'operational'
    dynamics_status VARCHAR(50),  -- 'new', 'escalated', 'de-escalated', 'stable'
    period VARCHAR(50),
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Records
CREATE TABLE data_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES risks(id) ON DELETE CASCADE,
    risk_domain_id UUID REFERENCES risk_domains(id) ON DELETE CASCADE,
    period VARCHAR(50) NOT NULL,
    value NUMERIC,
    notes TEXT,
    uploaded_by UUID REFERENCES profiles(id),
    validated_by UUID REFERENCES profiles(id),
    is_validated BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Excel Uploads
CREATE TABLE excel_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    record_count INTEGER DEFAULT 0,
    error_message TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,  -- 'board', 'domain', 'summary'
    config JSONB DEFAULT '{}',
    generated_by UUID REFERENCES profiles(id),
    file_path TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Database Relationships

```
Organization (1)
    ├── Profiles (N) - Users belonging to organization
    │       └── User Roles: Admin, Manager, Contributor, Viewer
    ├── Management Themes (N) - 6 themes
    │       └── Risk Domains (N) - 19 domains
    │               └── Risks (N) - 200+ risks
    │                       └── Data Records (N)
    ├── Excel Uploads (N)
    └── Reports (N)
```

### 2.3 Database Indexes

```sql
-- Performance indexes for 200+ risks
CREATE INDEX idx_risks_organization ON risks(organization_id);
CREATE INDEX idx_risks_domain ON risks(risk_domain_id);
CREATE INDEX idx_risks_period ON risks(period);
CREATE INDEX idx_risks_dynamics ON risks(dynamics_status);
CREATE INDEX idx_data_records_period ON data_records(period);
CREATE INDEX idx_data_records_risk ON data_records(risk_id);
```

---

## 3. Application Architecture

### 3.1 Project Structure

```
mast/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── themes/
│   │   │   │   └── page.tsx
│   │   │   ├── domains/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── manager/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── domain-report/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   ├── board/
│   │   │   │   └── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── upload/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── risks/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── uploads/
│   │   ├── reports/
│   │   ├── risks/
│   │   └── data/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── auth/                  # Auth-related components
│   ├── upload/                # File upload components
│   ├── reports/               # Report components
│   ├── dashboard/             # Dashboard components
│   ├── risks/                 # Risk management components
│   └── layout/                # Layout components
├── lib/
│   ├── supabase/              # Supabase client & helpers
│   ├── excel/                 # Excel processing utilities
│   │   ├── parser.ts          # Parse Excel files
│   │   ├── validator.ts       # Validate data structure
│   │   ├── mapper.ts          # Map to database entities
│   │   └── formulas.ts       # Formula replication logic
│   ├── reports/               # Report generation logic
│   │   ├── generator.ts       # Generate report data
│   │   ├── pdf.ts             # PDF generation
│   │   └── excel.ts           # Excel export
│   └── utils/                 # General utilities
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript type definitions
└── public/                    # Static assets
```

### 3.2 Key Modules

#### Authentication Module
- `lib/supabase/auth.ts` - Auth client and helpers
- Middleware for route protection
- Role-based access control (RBAC)

#### Excel Processing Module
- `lib/excel/parser.ts` - Parse Excel files using xlsx library
- `lib/excel/validator.ts` - Validate data structure
- `lib/excel/mapper.ts` - Map to database entities
- `lib/excel/formulas.ts` - Formula replication logic from BDO file

#### Risk Management Module
- `lib/risks/dynamics.ts` - Track escalation/de-escalation
- `lib/risks/residual.ts` - Track residual risk
- `lib/risks/periods.ts` - Period management

#### Reporting Module
- `lib/reports/generator.ts` - Generate report data
- `lib/reports/pdf.ts` - PDF generation
- `lib/reports/excel.ts` - Excel export
- `lib/reports/dashboard.ts` - Dashboard data aggregation

---

## 4. API Design

### 4.1 REST Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/logout` | User logout | Auth |
| GET | `/api/auth/me` | Get current user | Auth |
| GET | `/api/users` | List users | Admin |
| POST | `/api/users` | Create user | Admin |
| PATCH | `/api/users/[id]` | Update user | Admin |
| DELETE | `/api/users/[id]` | Delete user | Admin |
| GET | `/api/organization` | Get organization | Auth |
| GET | `/api/themes` | List management themes | Auth |
| POST | `/api/themes` | Create theme | Admin |
| GET | `/api/domains` | List risk domains | Auth |
| POST | `/api/domains` | Create domain | Admin |
| GET | `/api/risks` | List risks | Manager+ |
| POST | `/api/risks` | Create risk | Contributor+ |
| PATCH | `/api/risks/[id]` | Update risk | Contributor+ |
| GET | `/api/risks/[id]` | Get risk details | Manager+ |
| POST | `/api/uploads` | Upload Excel file | Contributor |
| GET | `/api/uploads` | List uploads | Contributor |
| GET | `/api/uploads/[id]` | Get upload status | Contributor |
| GET | `/api/data` | Get data records | Contributor |
| POST | `/api/data` | Create data record | Contributor |
| GET | `/api/reports` | List reports | Viewer |
| POST | `/api/reports` | Generate report | Contributor |
| GET | `/api/reports/board` | Get board report | Viewer |
| GET | `/api/reports/domain/[id]` | Get domain report | Manager |
| GET | `/api/reports/[id]/download` | Download report | Viewer |

### 4.2 Data Models

```typescript
// User Role
type UserRole = 'admin' | 'manager' | 'contributor' | 'viewer';

// Organization
interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Profile
interface Profile {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

// Management Theme
interface ManagementTheme {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
}

// Risk Domain
interface RiskDomain {
  id: string;
  organizationId: string;
  themeId: string;
  name: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
}

// Risk
interface Risk {
  id: string;
  organizationId: string;
  riskDomainId: string;
  title: string;
  description?: string;
  inherentRisk: number;    // 1-5
  currentRisk: number;     // 1-5
  residualRisk: number;    // 1-5
  riskType: 'strategic' | 'operational';
  dynamicsStatus: 'new' | 'escalated' | 'de-escalated' | 'stable';
  period: string;
  uploadedBy: string;
}

// Data Record
interface DataRecord {
  id: string;
  organizationId: string;
  riskId: string;
  riskDomainId: string;
  period: string;
  value: number;
  notes?: string;
  uploadedBy: string;
  validatedBy?: string;
  isValidated: boolean;
  uploadedAt: Date;
  validatedAt?: Date;
}

// Excel Upload
interface ExcelUpload {
  id: string;
  organizationId: string;
  userId: string;
  filename: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordCount: number;
  errorMessage?: string;
  uploadedAt: Date;
  processedAt?: Date;
}

// Report
interface Report {
  id: string;
  organizationId: string;
  name: string;
  type: 'board' | 'domain' | 'summary';
  config: Record<string, any>;
  generatedBy: string;
  filePath?: string;
  generatedAt: Date;
}
```

---

## 5. Security Architecture

### 5.1 Authentication Flow

```
User Login Flow:
1. User enters email/password
2. Client sends to Supabase Auth
3. Supabase validates credentials
4. JWT token returned to client
5. Client stores token in cookies
6. Subsequent requests include token
7. Server validates token via middleware
8. Role-based route protection applied
```

### 5.2 Authorization Rules

| Role | Permissions |
|------|-------------|
| **Admin** | Full CRUD on all entities, user management, theme/domain config, settings, audit logs |
| **Manager** | View/edit their assigned domains, generate domain reports, view risks in their domain |
| **Contributor** | Upload files, create/edit risks and data records, generate reports |
| **Viewer** | Read-only access to data, dashboards, and reports |

### 5.3 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE management_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE excel_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their organization's data
CREATE POLICY "Users can view own organization"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can view organization data"
ON risks FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  )
);

-- Role-based access policies
CREATE POLICY "Admin can do anything"
ON risks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 6. Excel Processing Pipeline

### 6.1 Upload Flow

```
1. User uploads Excel file
2. Server validates file type/size (max 10MB)
3. File stored in Supabase Storage
4. Upload record created in DB (status: pending)
5. Background job triggered
6. Excel parsed using xlsx library
7. Formulas extracted from cells
8. Data validated against schema
9. Formulas converted to SQL queries
10. Records inserted/updated in DB
11. Risk dynamics calculated
12. Upload record updated (status: completed)
13. User notified of success/failure
```

### 6.2 Formula Replication (from BDO Data and Formulas)

```typescript
// Formula mapping example based on BDO file
const formulaMappings: Record<string, string> = {
  // Risk calculations
  'INHERENT_RISK': 'Calculate inherent risk score',
  'CURRENT_RISK': 'Calculate current risk score',
  'RESIDUAL_RISK': 'Calculate residual risk after controls',
  
  // Aggregation formulas
  'SUM(A1:A10)': 'SELECT SUM(value) FROM data_records WHERE period = ?',
  'AVG(A1:A10)': 'SELECT AVG(value) FROM data_records WHERE period = ?',
  'COUNTIF(A1:A10">0")': 'SELECT COUNT(*) FROM data_records WHERE value > 0',
  
  // Risk dynamics
  'ESCALATED': 'SELECT COUNT(*) FROM risks WHERE dynamics_status = "escalated"',
  'DE-ESCALATED': 'SELECT COUNT(*) FROM risks WHERE dynamics_status = "de-escalated"',
  'NEW_RISKS': 'SELECT COUNT(*) FROM risks WHERE dynamics_status = "new"',
  
  // More mappings from BDO file...
};
```

---

## 7. Dashboard & Reporting Architecture

### 7.1 Dashboard Views

| View | Audience | Features |
|------|----------|----------|
| Executive Dashboard | Board/Viewer | Critical risk summary, KPIs, graphical outcomes |
| Manager Dashboard | Manager | Domain-specific metrics, risk trends |
| Contributor Dashboard | Contributor | Data entry, upload status, recent reports |

### 7.2 Report Types

| Report | Description | Audience |
|--------|-------------|----------|
| Board Report | Executive summary of critical risks | Board, Admin |
| Domain Report | Manager-specific domain performance | Manager |
| Summary Report | Overall organizational risk overview | Admin, Manager |
| Detailed Report | Full risk register with all details | Contributor, Manager |

### 7.3 Visualization Components

- Risk heatmaps (domain vs. risk level)
- Trend charts (period over period)
- Pie charts (risk distribution)
- Bar charts (domain comparison)
- Drill-down tables (200+ risks with filtering)

---

## 8. Deployment Architecture

### 8.1 Environment Setup

```
┌─────────────────┐     ┌─────────────────┐
│   Development   │     │    Production   │
│   - Localhost   │     │    - Vercel     │
│   - Supabase    │     │    - Supabase   │
│     Dev DB      │     │      Prod DB    │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Staging       │
│   - Vercel      │
│   - Supabase    │
│   - Test DB     │
└─────────────────┘
```

### 8.2 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 9. Scalability Considerations

### 9.1 Performance Optimizations
- Database indexes on frequently queried columns (risks, periods, domains)
- Pagination for large data sets (200+ risks)
- Caching with Supabase
- Background job processing for Excel uploads
- Lazy loading for dashboard charts

### 9.2 Future Enhancements
- Real-time subscriptions for live updates
- Multiple file upload support
- Advanced analytics dashboard
- API for third-party integrations
- Mobile-responsive design

---

*Document Version: 2.0 - Refreshed with source document analysis*
*Last Updated: March 2026*
