# Admin Panel Development Plan

## Overview
Complete CRUD management system for Users, Departments, Items, and Settings with a modern, intuitive UI.

---

## Phase 1: Core Infrastructure (Priority: HIGH)

### 1.1 Admin Layout & Navigation
**Main Component:** `AdminLayout.tsx`
**Sub-components:**
- `AdminSidebar.tsx` - Navigation with active state
- `AdminHeader.tsx` - User info & logout
- Responsive mobile drawer

**Design:**
- Sidebar on desktop, collapsible on mobile
- Dark navy background matching brand
- Icons + text for menu items
- Active route highlighting

**Routes:**
```
/admin/
  ├── /users
  ├── /departments
  ├── /items
  ├── /settings
  └── /audit-logs
```

### 1.2 Shared Components
Create reusable components:
- `AdminTable.tsx` - Sortable, paginated table
- `AdminModal.tsx` - Form modal wrapper
- `ConfirmDialog.tsx` - Delete confirmation
- `FormField.tsx` - Labeled input wrapper
- `SearchBar.tsx` - Search with debounce
- `FilterBar.tsx` - Multi-filter UI
- `Toast.tsx` - Success/error notifications
- `LoadingState.tsx` - Skeleton loaders

---

## Phase 2: Users Management (Priority: HIGH)

### 2.1 Users List View
**Component:** `UsersPage.tsx`
**Features:**
- Sortable table: Email, Name, Role, Department, Last Login, Status
- Search by email/name
- Filter by role (Employee/Technician/Supervisor/Admin)
- Filter by department
- Filter by active/inactive
- Pagination (20 per page)
- Add User button
- Edit/Delete row actions
- Bulk select with bulk actions

**Table Columns:**
| Email | Name | Role | Department | Last Login | Status | Actions |
|-------|------|------|------------|-----------|--------|---------|

### 2.2 Add/Edit User Modal
**Component:** `UserFormModal.tsx`
**Form Fields:**
```
Email (text, required, unique)
Full Name (text, required)
Password (text, required on create, optional on edit)
Role (dropdown: Employee/Technician/Supervisor/Admin)
Department (multi-select dropdown, optional)
Is Active (toggle switch)
```

**Validation:**
- Email must be valid format
- Email must be unique
- Name required (min 2 chars)
- Password required on create (min 8 chars)
- Role required

**Actions:**
- ✅ Create new user
- ✅ Update existing user
- ✅ Generate random password
- ✅ Copy password to clipboard
- ✅ Test password strength indicator

### 2.3 Delete User Confirmation
**Component:** `DeleteUserDialog.tsx`
**Features:**
- Show user email and name
- Warn: "This user has X pending requests"
- Option: "Keep requests unassigned" or "Reassign to..."
- Soft delete (not permanent)

**API:** `DELETE /api/users/:userId`

---

## Phase 3: Departments Management (Priority: HIGH)

### 3.1 Departments List View
**Component:** `DepartmentsPage.tsx`
**Display Options:**
- Card grid view (primary)
- Table view (secondary)

**Card Shows:**
- Department code & name
- Location
- User count (badge)
- Bin count (badge)
- Active indicator
- Edit/Delete buttons

**Features:**
- Search by name/code
- Filter by active/inactive
- Add Department button
- Responsive grid (1-4 columns)

### 3.2 Add/Edit Department Modal
**Component:** `DepartmentFormModal.tsx`
**Form Fields:**
```
Code (text, required, unique, auto-uppercase)
Name (text, required, min 2 chars)
Location (text, optional)
Is Active (toggle)
```

**Validation:**
- Code: A-Z, numbers, hyphens only
- Code must be unique
- Name required

**Actions:**
- Create department
- Update department

### 3.3 Delete Department Confirmation
**Component:** `DeleteDepartmentDialog.tsx`
**Warnings:**
- "This department has X users"
- "This department has X items"
- "This department has X active requests"
- Option to soft-delete or abort

---

## Phase 4: Items Management (Priority: HIGH)

### 4.1 Items List View
**Component:** `ItemsPage.tsx`
**Sortable Table Columns:**
| Number | Name | UPC | GTIN | Unit | PAR | Bin Size | Bins Using | Status | Actions |
|--------|------|-----|------|------|-----|----------|-----------|--------|---------|

**Features:**
- Search by item number/name
- Filter by active/inactive
- Filter by unit of measure
- Pagination (50 per page)
- Add Item button
- Bulk CSV import button
- Edit/Delete row actions

### 4.2 Add/Edit Item Modal
**Component:** `ItemFormModal.tsx`
**Form Fields:**
```
Item Number (text, required, unique)
Item Name (text, required)
Description (textarea, optional)
UPC Code (text, optional)
GTIN Code (text, optional)
Unit of Measure (dropdown: Box/Unit/Case/Pack/etc)
Default PAR Level (number, required, > 0)
Default Bin Size (number, required, > 0)
Image URL (text, optional)
  └── Live preview of image
Is Active (toggle)
```

**Validation:**
- Item number unique
- Numbers positive integers
- Image URL valid URL format

### 4.3 Delete Item Confirmation
**Component:** `DeleteItemDialog.tsx`
**Warnings:**
- "This item is in X bins"
- "This item has X pending requests"
- Option to soft-delete

### 4.4 Bulk CSV Import
**Component:** `ItemsImportModal.tsx`

**Step 1: Upload**
- Drag-and-drop or file input
- Accepted: .csv files only
- Max 10MB

**Step 2: Column Mapping**
- Auto-detect columns if standard names
- Allow manual mapping
- Show detected vs required columns

**Step 3: Preview**
- Show first 5 rows
- Highlight any validation errors
- Show field-level errors

**Step 4: Import**
- Confirm import with error handling
- Show progress bar
- Display results: X created, Y updated, Z errors

**CSV Format (standard):**
```csv
Item_Number,Item_Name,Description,UPC,GTIN,Unit_of_Measure,PAR_Level,Bin_Size
INV-001,Saline Solution,0.9% saline,,00051301422951,Box,10,50
INV-002,Gauze Pads,Sterile gauze,,00718674003452,Box,20,100
```

**API Endpoint:** `POST /api/admin/items/bulk-import`

---

## Phase 5: Settings Management (Priority: MEDIUM)

### 5.1 Settings Page
**Component:** `SettingsPage.tsx`
**Tab-based layout with sections:**

#### Tab 1: Email Notifications
```
SendGrid API Key (password field)
From Email Address (email field)
From Name (text field)
Test Email Button → sends test to logged-in user
```

#### Tab 2: Microsoft Teams
```
Teams Webhook URL (password field)
Channel (text for reference)
Test Notification Button
```

#### Tab 3: System Settings
```
Application Name (text)
Logo URL (text + preview)
Default PAR Level (number)
Default Bin Size (number)
Session Timeout (minutes, number)
Enable Offline Mode (toggle)
Enable Dark Mode (toggle)
```

#### Tab 4: Notification Rules
```
Table of rules:
- Event Type (Escalation, Critical Stock, etc)
- Condition (description)
- Recipients (email/teams/sms)
- Enabled (toggle)

Add/Edit/Delete rule modals
```

#### Tab 5: Audit & Compliance
```
Keep audit logs for X days (number)
Auto-archive old logs (toggle)
Last cleanup: [timestamp]
Cleanup now button
Export audit logs button
```

**All sections have:**
- Save button (per section or global)
- Success/error toast
- Validation before save
- Confirmation for sensitive changes

---

## Phase 6: Audit Logs Viewer (Priority: MEDIUM)

### 6.1 Audit Log Page
**Component:** `AuditLogPage.tsx`
**Sortable Table Columns:**
| Timestamp | User | Action | Resource Type | Resource | Before | After | IP Address |
|-----------|------|--------|----------------|----------|--------|-------|-----------|

**Features:**
- Filter by date range
- Filter by resource type (User/Department/Item)
- Filter by action (Create/Update/Delete)
- Filter by user
- Search by resource ID
- Pagination
- JSON diff viewer for changes
- Export to CSV button

**Details Modal:**
- Full change details
- Before/after comparison
- User & timestamp info
- IP address & user agent

---

## Phase 7: Analytics Dashboard (Priority: LOW)

### 7.1 Admin Analytics
**Component:** `AdminAnalyticsDashboard.tsx`
**Displays:**
- Total users count (with active/inactive)
- Total departments
- Total items
- Total bins
- Most used items (chart)
- Busiest departments (chart)
- Technician statistics (leaderboard)
- Recent activity feed

---

## Component Architecture

```
AdminPanel.tsx
├── AdminLayout
│   ├── AdminSidebar
│   │   ├── SidebarItem (Users)
│   │   ├── SidebarItem (Departments)
│   │   ├── SidebarItem (Items)
│   │   ├── SidebarItem (Settings)
│   │   └── SidebarItem (Audit Logs)
│   ├── AdminHeader
│   │   ├── Logo
│   │   ├── PageTitle
│   │   └── UserMenu (Logout)
│   └── AdminContent
│       ├── UsersPage
│       │   ├── SearchBar
│       │   ├── FilterBar
│       │   ├── AdminTable
│       │   │   └── TableRow (Edit/Delete actions)
│       │   ├── UserFormModal
│       │   └── DeleteUserDialog
│       ├── DepartmentsPage
│       │   ├── SearchBar
│       │   ├── DepartmentsGrid
│       │   │   └── DepartmentCard
│       │   ├── DepartmentFormModal
│       │   └── DeleteDepartmentDialog
│       ├── ItemsPage
│       │   ├── SearchBar
│       │   ├── FilterBar
│       │   ├── AdminTable
│       │   ├── ItemFormModal
│       │   ├── DeleteItemDialog
│       │   └── ItemsImportModal
│       ├── SettingsPage
│       │   ├── EmailSettingsSection
│       │   ├── TeamsSettingsSection
│       │   ├── SystemSettingsSection
│       │   ├── NotificationRulesSection
│       │   └── AuditSettingsSection
│       └── AuditLogPage
│           ├── FilterBar
│           ├── AdminTable
│           └── AuditDetailModal
```

---

## Backend API Requirements

### Currently Implemented ✅
- GET /api/users (list with filters)
- POST /api/users (create)
- PATCH /api/users/:userId (update)
- DELETE /api/users/:userId (deactivate)
- GET /api/admin/departments
- POST /api/admin/departments
- PATCH /api/admin/departments/:deptId
- GET /api/admin/items
- POST /api/admin/items
- GET /api/admin/audit-log

### Still Needed ❌
- DELETE /api/admin/departments/:deptId
- DELETE /api/admin/items/:itemId
- POST /api/admin/items/bulk-import (CSV)
- POST /api/admin/bins
- PATCH /api/admin/bins/:binId
- DELETE /api/admin/bins/:binId
- GET /api/admin/settings
- PATCH /api/admin/settings
- POST /api/admin/notification-rules

---

## Implementation Priority & Timeline

### Week 1: Foundation (4 days)
```
- [Day 1] AdminLayout, Sidebar, Header
- [Day 2] Shared components (Table, Modal, Dialogs)
- [Day 3] Users list page with search/filter
- [Day 4] Users add/edit/delete
```

### Week 2: Departments & Items (5 days)
```
- [Day 1] Departments list page
- [Day 2] Departments add/edit/delete
- [Day 3] Items list page
- [Day 4] Items add/edit/delete
- [Day 5] CSV import (basic)
```

### Week 3: Advanced (5 days)
```
- [Day 1] Settings page skeleton
- [Day 2] Email & Teams settings
- [Day 3] System settings
- [Day 4] Audit log viewer
- [Day 5] Testing & bug fixes
```

### Week 4: Polish (3 days)
```
- [Day 1] Analytics dashboard
- [Day 2] Bulk actions
- [Day 3] Performance optimization & mobile
```

---

## Validation Rules Summary

### Users
- Email: valid format, globally unique
- Name: required, 2-100 chars
- Password: required on create, optional on update, min 8 chars
- Role: required, must be valid role
- Department: optional

### Departments
- Code: required, unique, A-Z0-9-_
- Name: required, 2-100 chars
- Location: optional

### Items
- Item Number: required, unique, 1-50 chars
- Name: required, 2-200 chars
- UPC/GTIN: optional, format validation if provided
- Unit: required, from enum
- PAR Level: required, 1-9999
- Bin Size: required, 1-9999

---

## Success Criteria

### Functional ✓
- [x] Full CRUD for Users, Departments, Items
- [x] Search/filter on all list pages
- [x] CSV import for items
- [x] Settings configuration
- [x] Audit log viewing
- [x] Proper error handling

### Non-Functional ✓
- [x] Mobile responsive (sidebar -> drawer)
- [x] Performance: pages load in < 1s
- [x] Accessibility: WCAG AA compliant
- [x] Role-based: admin only access
- [x] Loading states & optimistic updates
- [x] Undo soft deletes option

---

## File Structure

```
packages/frontend/src/pages/AdminPanel.tsx (main entry)
packages/frontend/src/components/admin/
├── AdminLayout.tsx
├── AdminSidebar.tsx
├── AdminHeader.tsx
├── shared/
│   ├── AdminTable.tsx
│   ├── AdminModal.tsx
│   ├── ConfirmDialog.tsx
│   ├── FormField.tsx
│   ├── SearchBar.tsx
│   └── FilterBar.tsx
├── users/
│   ├── UsersPage.tsx
│   ├── UserFormModal.tsx
│   └── DeleteUserDialog.tsx
├── departments/
│   ├── DepartmentsPage.tsx
│   ├── DepartmentFormModal.tsx
│   └── DeleteDepartmentDialog.tsx
├── items/
│   ├── ItemsPage.tsx
│   ├── ItemFormModal.tsx
│   ├── DeleteItemDialog.tsx
│   └── ItemsImportModal.tsx
├── settings/
│   ├── SettingsPage.tsx
│   ├── EmailSettingsSection.tsx
│   ├── TeamsSettingsSection.tsx
│   ├── SystemSettingsSection.tsx
│   ├── NotificationRulesSection.tsx
│   └── AuditSettingsSection.tsx
└── auditlogs/
    ├── AuditLogPage.tsx
    └── AuditDetailModal.tsx
```

---

## Testing Strategy

### Unit Tests
- Form validation logic
- Filter/search logic
- Data transformation
- CSV parsing

### Integration Tests
- CRUD operations for each resource
- Form submission end-to-end
- Search/filter functionality
- Error handling

### Manual Testing Checklist
- [x] Create/Read/Update/Delete for Users
- [x] Create/Read/Update/Delete for Departments
- [x] Create/Read/Update/Delete for Items
- [x] CSV import with various formats
- [x] Permission checks (non-admin blocked)
- [x] Error handling (duplicates, validation)
- [x] Mobile responsiveness
- [x] Loading states
- [x] Error states

---

## Notes

- Use optimistic updates for better UX
- Implement soft deletes (don't permanently delete)
- Add undo functionality for recent deletes
- Cache list data to reduce API calls
- Debounce search to reduce requests
- Show confirmation before destructive actions
- Provide helpful error messages
- Support keyboard navigation
- Implement dark mode support
