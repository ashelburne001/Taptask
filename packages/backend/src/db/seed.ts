import { db } from './database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    // Initialize database
    const dbPath = './data/taptask.db'
    await db.initialize(dbPath)
    console.log('✓ Database initialized')

    // Create departments
    const deptIds = {
      icu: uuidv4(),
      er: uuidv4(),
      surgery: uuidv4(),
      pharmacy: uuidv4(),
    };

    for (const [key, id] of Object.entries(deptIds)) {
      const code = key.toUpperCase();
      const name = {
        icu: 'Intensive Care Unit',
        er: 'Emergency Room',
        surgery: 'Surgery',
        pharmacy: 'Pharmacy',
      }[key];

      await db.run(
        'INSERT OR IGNORE INTO departments (id, code, name, location) VALUES (?, ?, ?, ?)',
        [id, code, name, `${name} Wing`]
      );
    }

    // Create locations
    const locIds = {
      icu_shelf1: uuidv4(),
      er_shelf1: uuidv4(),
    };

    await db.run(
      'INSERT OR IGNORE INTO locations (id, code, name, department_id, shelf_location, warehouse_location) VALUES (?, ?, ?, ?, ?, ?)',
      [locIds.icu_shelf1, 'ICU-SHELF-01', 'ICU Shelf 1', deptIds.icu, 'Shelf A1', 'Warehouse Section 1']
    );

    await db.run(
      'INSERT OR IGNORE INTO locations (id, code, name, department_id, shelf_location, warehouse_location) VALUES (?, ?, ?, ?, ?, ?)',
      [locIds.er_shelf1, 'ER-SHELF-01', 'ER Shelf 1', deptIds.er, 'Shelf B1', 'Warehouse Section 2']
    );

    // Create items
    const itemIds = {
      saline: uuidv4(),
      bandage: uuidv4(),
      gloves: uuidv4(),
    };

    await db.run(
      'INSERT OR IGNORE INTO items (id, item_number, name, description, gtin, unit_of_measure, par_level, bin_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [itemIds.saline, 'INV-001', 'Saline Solution 0.9%', 'Normal saline solution', '00051301422951', 'Box', 10, 50]
    );

    await db.run(
      'INSERT OR IGNORE INTO items (id, item_number, name, description, gtin, unit_of_measure, par_level, bin_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [itemIds.bandage, 'INV-002', 'Sterile Gauze Pads', 'Sterile gauze bandages', '00718674003452', 'Box', 20, 100]
    );

    await db.run(
      'INSERT OR IGNORE INTO items (id, item_number, name, description, gtin, unit_of_measure, par_level, bin_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [itemIds.gloves, 'INV-003', 'Latex Gloves Size L', 'Sterile latex gloves', '00718674001234', 'Box', 15, 200]
    );

    // Create bins
    const binIds = {
      icu_saline: uuidv4(),
      er_bandage: uuidv4(),
      icu_gloves: uuidv4(),
    };

    await db.run(
      'INSERT OR IGNORE INTO bins (id, bin_code, item_id, location_id, department_id, par_level, current_quantity, bin_size, nfc_tag_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [binIds.icu_saline, 'KBN-ICU-0042', itemIds.saline, locIds.icu_shelf1, deptIds.icu, 10, 5, 50, 'NFC-ICU-042']
    );

    await db.run(
      'INSERT OR IGNORE INTO bins (id, bin_code, item_id, location_id, department_id, par_level, current_quantity, bin_size, nfc_tag_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [binIds.er_bandage, 'KBN-ER-0015', itemIds.bandage, locIds.er_shelf1, deptIds.er, 20, 12, 100, 'NFC-ER-015']
    );

    await db.run(
      'INSERT OR IGNORE INTO bins (id, bin_code, item_id, location_id, department_id, par_level, current_quantity, bin_size, nfc_tag_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [binIds.icu_gloves, 'KBN-ICU-0043', itemIds.gloves, locIds.icu_shelf1, deptIds.icu, 15, 20, 200, 'NFC-ICU-043']
    );

    // Create users
    const adminId = uuidv4();
    const technicianId = uuidv4();
    const employeeId = uuidv4();

    const adminHash = await bcrypt.hash('admin123', 10);
    const techHash = await bcrypt.hash('tech123', 10);
    const empHash = await bcrypt.hash('emp123', 10);

    await db.run(
      'INSERT OR IGNORE INTO users (id, email, name, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      [adminId, 'admin@hospital.local', 'System Administrator', adminHash, 'admin', null]
    );

    await db.run(
      'INSERT OR IGNORE INTO users (id, email, name, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      [technicianId, 'tech@hospital.local', 'John Technician', techHash, 'technician', deptIds.icu]
    );

    await db.run(
      'INSERT OR IGNORE INTO users (id, email, name, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      [employeeId, 'emp@hospital.local', 'Jane Employee', empHash, 'employee', deptIds.icu]
    );

    // Create workflow modules
    await db.run(
      'INSERT OR IGNORE INTO workflow_modules (id, code, name, description, version, is_enabled) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), 'KBN', 'Kanban Replenishment', 'Main Kanban replenishment workflow', '1.0.0', true]
    );

    await db.run(
      'INSERT OR IGNORE INTO workflow_modules (id, code, name, description, version, is_enabled) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), 'CC', 'Crash Cart Checks', 'Emergency crash cart verification', '1.0.0', true]
    );

    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  }
}

seed();
