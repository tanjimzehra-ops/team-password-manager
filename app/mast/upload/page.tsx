"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Save, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  History,
  ChevronRight,
  ClipboardList,
  FileUp,
  File,
  X
} from "lucide-react"

// Types for entry fields
type EntryType = 
  | "percent" 
  | "currency" 
  | "integer" 
  | "zeroToTen" 
  | "yesNo" 
  | "yesNoNa" 
  | "decimal"

interface EntryField {
  id: string
  name: string
  label: string
  type: EntryType
  description?: string
  required: boolean
  min?: number
  max?: number
}

interface RiskDomain {
  id: string
  name: string
  theme: string
  fields: EntryField[]
}

// Mock data: 19 Risk Domains with their entry fields
const MOCK_RISK_DOMAINS: RiskDomain[] = [
  {
    id: "rd-001",
    name: "Strategic Planning",
    theme: "Stakeholders",
    fields: [
      { id: "f1", name: "strategyScore", label: "Strategy Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "goalAlignment", label: "Goal Alignment %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f3", name: "budget", label: "Annual Budget ($)", type: "currency", required: true, min: 0 },
    ]
  },
  {
    id: "rd-002",
    name: "Stakeholder Engagement",
    theme: "Stakeholders",
    fields: [
      { id: "f1", name: "engagementScore", label: "Engagement Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "stakeholderCount", label: "Active Stakeholders", type: "integer", required: true, min: 0 },
      { id: "f3", name: "satisfactionRate", label: "Satisfaction Rate %", type: "percent", required: false, min: 0, max: 100 },
    ]
  },
  {
    id: "rd-003",
    name: "Service Delivery",
    theme: "Service Delivery",
    fields: [
      { id: "f1", name: "serviceLevel", label: "Service Level %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f2", name: "responseTime", label: "Avg Response Time (hrs)", type: "decimal", required: true, min: 0 },
      { id: "f3", name: "customerRating", label: "Customer Rating", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f4", name: "resolvedCases", label: "Cases Resolved", type: "integer", required: true, min: 0 },
    ]
  },
  {
    id: "rd-004",
    name: "Operations Management",
    theme: "Service Delivery",
    fields: [
      { id: "f1", name: "efficiencyRate", label: "Efficiency Rate %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f2", name: "operationalCost", label: "Operational Cost ($)", type: "currency", required: true, min: 0 },
      { id: "f3", name: "processCompliant", label: "Process Compliant", type: "yesNo", required: true },
    ]
  },
  {
    id: "rd-005",
    name: "Governance",
    theme: "Management & Governance",
    fields: [
      { id: "f1", name: "governanceScore", label: "Governance Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "policyCompliance", label: "Policy Compliance %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f3", name: "boardMeetings", label: "Board Meetings Held", type: "integer", required: false, min: 0 },
      { id: "f4", name: "auditFindings", label: "Audit Findings", type: "integer", required: true, min: 0 },
    ]
  },
  {
    id: "rd-006",
    name: "Compliance",
    theme: "Management & Governance",
    fields: [
      { id: "f1", name: "complianceRate", label: "Compliance Rate %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f2", name: "regulatoryChanges", label: "Regulatory Changes", type: "integer", required: false, min: 0 },
      { id: "f3", name: "violations", label: "Violations", type: "integer", required: true, min: 0 },
      { id: "f4", name: "compliant", label: "Fully Compliant", type: "yesNo", required: true },
    ]
  },
  {
    id: "rd-007",
    name: "Workforce Planning",
    theme: "People & Culture",
    fields: [
      { id: "f1", name: "staffCount", label: "Total Staff", type: "integer", required: true, min: 0 },
      { id: "f2", name: "turnoverRate", label: "Turnover Rate %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f3", name: "vacancyRate", label: "Vacancy Rate %", type: "percent", required: false, min: 0, max: 100 },
    ]
  },
  {
    id: "rd-008",
    name: "Training & Development",
    theme: "People & Culture",
    fields: [
      { id: "f1", name: "trainingHours", label: "Training Hours/Employee", type: "decimal", required: true, min: 0 },
      { id: "f2", name: "certificationRate", label: "Certification Rate %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f3", name: "skillsGap", label: "Skills Gap Score", type: "zeroToTen", required: false, min: 0, max: 10 },
    ]
  },
  {
    id: "rd-009",
    name: "Culture & Engagement",
    theme: "People & Culture",
    fields: [
      { id: "f1", name: "cultureScore", label: "Culture Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "employeeSatisfaction", label: "Employee Satisfaction %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f3", name: "retentionRate", label: "Retention Rate %", type: "percent", required: true, min: 0, max: 100 },
    ]
  },
  {
    id: "rd-010",
    name: "Financial Performance",
    theme: "Financial Management",
    fields: [
      { id: "f1", name: "revenue", label: "Revenue ($)", type: "currency", required: true, min: 0 },
      { id: "f2", name: "expenses", label: "Expenses ($)", type: "currency", required: true, min: 0 },
      { id: "f3", name: "surplusDeficit", label: "Surplus/Deficit ($)", type: "currency", required: true },
      { id: "f4", name: "variance", label: "Budget Variance %", type: "decimal", required: false },
    ]
  },
  {
    id: "rd-011",
    name: "Budget Management",
    theme: "Financial Management",
    fields: [
      { id: "f1", name: "budgetUtilization", label: "Budget Utilization %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f2", name: "forecastAccuracy", label: "Forecast Accuracy %", type: "percent", required: false, min: 0, max: 100 },
      { id: "f3", name: "costPerUnit", label: "Cost per Unit ($)", type: "decimal", required: true, min: 0 },
    ]
  },
  {
    id: "rd-012",
    name: "Asset Management",
    theme: "Financial Management",
    fields: [
      { id: "f1", name: "assetValue", label: "Total Asset Value ($)", type: "currency", required: true, min: 0 },
      { id: "f2", name: "assetCondition", label: "Asset Condition Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f3", name: "maintenanceCost", label: "Maintenance Cost ($)", type: "currency", required: true, min: 0 },
    ]
  },
  {
    id: "rd-013",
    name: "Risk Management",
    theme: "Risk & Safety",
    fields: [
      { id: "f1", name: "riskScore", label: "Overall Risk Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "identifiedRisks", label: "Identified Risks", type: "integer", required: true, min: 0 },
      { id: "f3", name: "mitigatedRisks", label: "Mitigated Risks", type: "integer", required: true, min: 0 },
      { id: "f4", name: "riskAppetite", label: "Within Risk Appetite", type: "yesNo", required: true },
    ]
  },
  {
    id: "rd-014",
    name: "Safety Performance",
    theme: "Risk & Safety",
    fields: [
      { id: "f1", name: "safetyScore", label: "Safety Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "incidents", label: "Incidents", type: "integer", required: true, min: 0 },
      { id: "f3", name: "lostTime", label: "Lost Time (days)", type: "decimal", required: true, min: 0 },
      { id: "f4", name: "safetyTraining", label: "Safety Training %", type: "percent", required: true, min: 0, max: 100 },
    ]
  },
  {
    id: "rd-015",
    name: "Emergency Preparedness",
    theme: "Risk & Safety",
    fields: [
      { id: "f1", name: "preparednessScore", label: "Preparedness Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "drillsConducted", label: "Drills Conducted", type: "integer", required: false, min: 0 },
      { id: "f3", name: "responsePlan", label: "Response Plan Updated", type: "yesNo", required: true },
    ]
  },
  {
    id: "rd-016",
    name: "Regulatory Compliance",
    theme: "Risk & Safety",
    fields: [
      { id: "f1", name: "regulatoryCompliance", label: "Regulatory Compliance %", type: "percent", required: true, min: 0, max: 100 },
      { id: "f2", name: "inspections", label: "Inspections Passed", type: "integer", required: true, min: 0 },
      { id: "f3", name: "penalties", label: "Penalties ($)", type: "currency", required: false, min: 0 },
    ]
  },
  {
    id: "rd-017",
    name: "Environmental Management",
    theme: "Risk & Safety",
    fields: [
      { id: "f1", name: "environmentalScore", label: "Environmental Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "carbonFootprint", label: "Carbon Footprint (tCO2e)", type: "decimal", required: false, min: 0 },
      { id: "f3", name: "sustainablePractices", label: "Sustainable Practices", type: "yesNo", required: false },
    ]
  },
  {
    id: "rd-018",
    name: "Information Security",
    theme: "Risk & Safety",
    fields: [
      { id: "f1", name: "securityScore", label: "Security Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "dataBreaches", label: "Data Breaches", type: "integer", required: true, min: 0 },
      { id: "f3", name: "securityIncidents", label: "Security Incidents", type: "integer", required: true, min: 0 },
    ]
  },
  {
    id: "rd-019",
    name: "Business Continuity",
    theme: "Risk & Safety",
    fields: [
      { id: "f1", name: "continuityScore", label: "Continuity Score", type: "zeroToTen", required: true, min: 0, max: 10 },
      { id: "f2", name: "recoveryTime", label: "Recovery Time (hrs)", type: "decimal", required: false, min: 0 },
      { id: "f3", name: "planTested", label: "Plan Tested", type: "yesNo", required: true },
    ]
  },
]

// Reporting periods (semesters)
const REPORTING_PERIODS = [
  { id: "2026-h1", label: "H1 2026 (Jan - Jun)", startDate: "2026-01-01", endDate: "2026-06-30" },
  { id: "2025-h2", label: "H2 2025 (Jul - Dec)", startDate: "2025-07-01", endDate: "2025-12-31" },
  { id: "2025-h1", label: "H1 2025 (Jan - Jun)", startDate: "2025-01-01", endDate: "2025-06-30" },
  { id: "2024-h2", label: "H2 2024 (Jul - Dec)", startDate: "2024-07-01", endDate: "2024-12-31" },
  { id: "2024-h1", label: "H1 2024 (Jan - Jun)", startDate: "2024-01-01", endDate: "2024-06-30" },
]

// Mock audit log entries
const MOCK_AUDIT_LOG = [
  { id: 1, action: "Data Saved", user: "John Doe", domain: "Strategic Planning", period: "H1 2026", timestamp: "2026-03-10 14:32:15" },
  { id: 2, action: "Data Updated", user: "Jane Smith", domain: "Service Delivery", period: "H1 2026", timestamp: "2026-03-10 11:45:22" },
  { id: 3, action: "Data Saved", user: "John Doe", domain: "Financial Performance", period: "H2 2025", timestamp: "2026-03-09 16:20:08" },
  { id: 4, action: "Data Submitted", user: "Alice Johnson", domain: "Risk Management", period: "H1 2026", timestamp: "2026-03-08 09:15:33" },
  { id: 5, action: "Data Saved", user: "Jane Smith", domain: "Governance", period: "H2 2025", timestamp: "2026-03-07 13:42:19" },
]

// Validation functions for each entry type
function validateValue(value: string, type: EntryType, min?: number, max?: number): { valid: boolean; error?: string } {
  if (value === "" || value === undefined) {
    return { valid: false, error: "Value is required" }
  }

  switch (type) {
    case "percent": {
      const num = parseFloat(value)
      if (isNaN(num)) return { valid: false, error: "Must be a number" }
      if (num < 0 || num > 100) return { valid: false, error: "Must be between 0 and 100" }
      if (!/^\d{0,3}(\.\d)?$/.test(value)) return { valid: false, error: "Max 1 decimal place" }
      return { valid: true }
    }
    case "currency": {
      const num = parseFloat(value)
      if (isNaN(num)) return { valid: false, error: "Must be a number" }
      if (num < 0 && (min === undefined || min >= 0)) return { valid: false, error: "Cannot be negative" }
      if (!/^\d+(\.\d{0,2})?$/.test(value)) return { valid: false, error: "Max 2 decimal places" }
      return { valid: true }
    }
    case "integer": {
      const num = parseInt(value, 10)
      if (isNaN(num)) return { valid: false, error: "Must be a whole number" }
      if (min !== undefined && num < min) return { valid: false, error: `Must be at least ${min}` }
      if (max !== undefined && num > max) return { valid: false, error: `Must be at most ${max}` }
      return { valid: true }
    }
    case "zeroToTen": {
      const num = parseFloat(value)
      if (isNaN(num)) return { valid: false, error: "Must be a number" }
      if (num < 0 || num > 10) return { valid: false, error: "Must be between 0 and 10" }
      return { valid: true }
    }
    case "decimal": {
      const num = parseFloat(value)
      if (isNaN(num)) return { valid: false, error: "Must be a number" }
      if (min !== undefined && num < min) return { valid: false, error: `Must be at least ${min}` }
      if (max !== undefined && num > max) return { valid: false, error: `Must be at most ${max}` }
      if (!/^\d+(\.\d{0,2})?$/.test(value)) return { valid: false, error: "Max 2 decimal places" }
      return { valid: true }
    }
    case "yesNo":
    case "yesNoNa":
      // These are handled by select, always valid
      return { valid: true }
    default:
      return { valid: true }
  }
}

function formatValueForDisplay(value: string, type: EntryType): string {
  if (value === "" || value === undefined) return "-"
  
  switch (type) {
    case "currency":
      return `$${parseFloat(value).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    case "percent":
      return `${parseFloat(value).toFixed(1)}%`
    case "decimal":
      return parseFloat(value).toFixed(2)
    case "zeroToTen":
      return `${parseFloat(value)}/10`
    case "yesNo":
      return value === "yes" ? "Yes" : "No"
    case "yesNoNa":
      return value === "na" ? "N/A" : (value === "yes" ? "Yes" : "No")
    default:
      return value
  }
}

export default function UploadPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")
  const [selectedDomain, setSelectedDomain] = useState<string>("")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState("")

  // Get selected domain data
  const currentDomain = useMemo(() => {
    return MOCK_RISK_DOMAINS.find(d => d.id === selectedDomain)
  }, [selectedDomain])

  // Group domains by theme for the dropdown
  const domainsByTheme = useMemo(() => {
    const grouped: Record<string, RiskDomain[]> = {}
    MOCK_RISK_DOMAINS.forEach(domain => {
      if (!grouped[domain.theme]) {
        grouped[domain.theme] = []
      }
      grouped[domain.theme].push(domain)
    })
    return grouped
  }, [])

  // Handle input change with validation
  function handleInputChange(fieldId: string, value: string, field: EntryField) {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    setHasChanges(true)
    setSaveSuccess(false)

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  // Validate all fields
  function validateForm(): boolean {
    if (!currentDomain) return false
    
    const newErrors: Record<string, string> = {}
    let isValid = true

    currentDomain.fields.forEach(field => {
      const value = formData[field.id] || ""
      if (field.required && !value) {
        newErrors[field.id] = "This field is required"
        isValid = false
      } else if (value) {
        const validation = validateValue(value, field.type, field.min, field.max)
        if (!validation.valid) {
          newErrors[field.id] = validation.error || "Invalid value"
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Handle save
  async function handleSave() {
    if (!validateForm()) return

    setSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaving(false)
    setSaveSuccess(true)
    setHasChanges(false)
    
    // Clear success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // Reset form
  function handleReset() {
    setFormData({})
    setErrors({})
    setSelectedDomain("")
    setSaveSuccess(false)
    setHasChanges(false)
  }

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['.xlsx', '.xls', '.csv']
      const fileName = file.name.toLowerCase()
      const isValid = validTypes.some(ext => fileName.endsWith(ext))
      
      if (!isValid) {
        setUploadError('Please upload an Excel file (.xlsx, .xls) or CSV file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB')
        return
      }
      
      setUploadedFile(file)
      setUploadError('')
      setUploadSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile || !selectedPeriod) {
      setUploadError('Please select a reporting period and file')
      return
    }
    
    setUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setUploading(false)
      setUploadSuccess(true)
    }, 2500)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setUploadSuccess(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="h-8 w-8" />
            Data Entry
          </h1>
          <p className="text-muted-foreground mt-1">
            Enter performance data for MAST risk domains
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          MAST Phase 1
        </Badge>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Reporting Period</CardTitle>
            <CardDescription>Select the semester for data entry</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select reporting period" />
              </SelectTrigger>
              <SelectContent>
                {REPORTING_PERIODS.map(period => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPeriod && (
              <p className="text-xs text-muted-foreground mt-2">
                {REPORTING_PERIODS.find(p => p.id === selectedPeriod)?.startDate} to{" "}
                {REPORTING_PERIODS.find(p => p.id === selectedPeriod)?.endDate}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Risk Domain</CardTitle>
            <CardDescription>Select the domain to enter data for</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDomain} onValueChange={(val) => {
              setSelectedDomain(val)
              setFormData({})
              setErrors({})
              setSaveSuccess(false)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk domain" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Object.entries(domainsByTheme).map(([theme, domains]) => (
                  <div key={theme}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {theme}
                    </div>
                    {domains.map(domain => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Upload Excel File
          </CardTitle>
          <CardDescription>
            Upload a pre-filled Excel template to import data automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileSpreadsheet className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">
                Click to upload Excel file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports .xlsx and .xls files
              </p>
            </label>
          </div>

          {/* Selected File Display */}
          {uploadedFile && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">{uploadedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Success */}
          {uploadSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Upload Successful!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your data has been imported. Please review and save.
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Error */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          {uploadedFile && !uploadSuccess && (
            <div className="flex justify-end gap-2">
              <Button 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Entry Form */}
      {selectedDomain && selectedPeriod && currentDomain && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{currentDomain.name}</CardTitle>
                <CardDescription>
                  {currentDomain.fields.length} fields • {currentDomain.theme}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={saving || !hasChanges}>
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Success Message */}
            {saveSuccess && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Data Saved Successfully</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your data has been saved. It will be included in the next report generation.
                </AlertDescription>
              </Alert>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentDomain.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {field.type === "yesNo" || field.type === "yesNoNa" ? (
                    <Select 
                      value={formData[field.id] || ""} 
                      onValueChange={(val) => handleInputChange(field.id, val, field)}
                    >
                      <SelectTrigger className={errors[field.id] ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        {field.type === "yesNoNa" && (
                          <SelectItem value="na">N/A</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>
                      <Input
                        id={field.id}
                        type="text"
                        placeholder={getPlaceholder(field.type)}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                        className={errors[field.id] ? "border-red-500" : ""}
                      />
                      {field.description && (
                        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                      )}
                    </div>
                  )}
                  
                  {errors[field.id] && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors[field.id]}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {getFieldHint(field.type, field.min, field.max)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No domain selected state */}
      {(!selectedDomain || !selectedPeriod) && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Period and Domain</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Choose a reporting period and risk domain above to begin entering data.
              All fields will be validated according to their type requirements.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Audit Log Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit Log
          </CardTitle>
          <CardDescription>Recent data entry activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AUDIT_LOG.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>
                    <Badge variant={entry.action.includes("Submitted") ? "default" : "secondary"}>
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.domain}</TableCell>
                  <TableCell>{entry.period}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function getPlaceholder(type: EntryType): string {
  switch (type) {
    case "percent": return "0.0"
    case "currency": return "0.00"
    case "integer": return "0"
    case "zeroToTen": return "0-10"
    case "decimal": return "0.00"
    default: return ""
  }
}

function getFieldHint(type: EntryType, min?: number, max?: number): string {
  switch (type) {
    case "percent": return "Enter a value between 0 and 100 (1 decimal place)"
    case "currency": return min !== undefined && min >= 0 ? "Enter a positive value (2 decimal places)" : "Enter value (2 decimal places)"
    case "integer": 
      if (min !== undefined && max !== undefined) return `Enter a whole number between ${min} and ${max}`
      if (min !== undefined) return `Enter a whole number (minimum ${min})`
      return "Enter a whole number"
    case "zeroToTen": return "Enter a value from 0 to 10"
    case "decimal": return min !== undefined ? `Enter a number (minimum ${min}, 2 decimal places)` : "Enter a number (2 decimal places)"
    case "yesNo": return "Select Yes or No"
    case "yesNoNa": return "Select Yes, No, or N/A"
    default: return ""
  }
}
