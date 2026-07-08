-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('employee', 'technician', 'supervisor', 'admin')),
  department_id TEXT,
  azure_id TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department_id TEXT NOT NULL,
  warehouse_location TEXT,
  shelf_location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  item_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  gtin TEXT,
  upc TEXT,
  unit_of_measure TEXT,
  image_url TEXT,
  par_level INTEGER,
  bin_size INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bins table
CREATE TABLE IF NOT EXISTS bins (
  id TEXT PRIMARY KEY,
  bin_code TEXT UNIQUE NOT NULL,
  item_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  par_level INTEGER,
  current_quantity INTEGER DEFAULT 0,
  bin_size INTEGER,
  last_counted TIMESTAMP,
  nfc_tag_id TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  bin_id TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('refill', 'partial_refill', 'damaged')),
  employee_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'unable_to_fill')),
  assigned_technician_id TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  quantity_requested INTEGER,
  quantity_filled INTEGER,
  notes TEXT,
  photo_url TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id),
  FOREIGN KEY (employee_id) REFERENCES users(id),
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (assigned_technician_id) REFERENCES users(id)
);

-- Refills table
CREATE TABLE IF NOT EXISTS refills (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  bin_id TEXT NOT NULL,
  technician_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  warehouse_location TEXT,
  printed_label BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES requests(id),
  FOREIGN KEY (bin_id) REFERENCES bins(id),
  FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  bin_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  par_level INTEGER,
  transaction_type TEXT CHECK (transaction_type IN ('add', 'remove', 'adjust', 'count')),
  created_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (bin_id) REFERENCES bins(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  device_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  changes TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  resource_type TEXT,
  resource_id TEXT,
  channel TEXT CHECK (channel IN ('email', 'teams', 'sms', 'in_app')),
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notification Rules table
CREATE TABLE IF NOT EXISTS notification_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  condition TEXT,
  recipients TEXT,
  channels TEXT,
  is_enabled BOOLEAN DEFAULT true,
  escalate_after_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  bin_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('image', 'document', 'label')),
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Workflow Modules table (for modular architecture)
CREATE TABLE IF NOT EXISTS workflow_modules (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT,
  is_enabled BOOLEAN DEFAULT true,
  config TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_bins_code ON bins(bin_code);
CREATE INDEX IF NOT EXISTS idx_bins_item ON bins(item_id);
CREATE INDEX IF NOT EXISTS idx_bins_location ON bins(location_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_department ON requests(department_id);
CREATE INDEX IF NOT EXISTS idx_requests_technician ON requests(assigned_technician_id);
CREATE INDEX IF NOT EXISTS idx_requests_created ON requests(created_at);
CREATE INDEX IF NOT EXISTS idx_refills_status ON refills(status);
CREATE INDEX IF NOT EXISTS idx_inventory_item ON inventory(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_bin ON inventory(bin_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
