-- ===========================================================================
-- OBO-PAMS demo/seed data for the auto-screenshot pipeline.
-- Safe to re-run: everything below uses explicit IDs scoped to rows that do
-- not exist from schema.sql or the sql/*.sql migration scripts.
-- ===========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- ORDER OF PAYMENT
-- ---------------------------------------------------------------------------
INSERT INTO order_of_payments
  (id, transaction_no, applicant_name, permit_type, amount, payment_status, official_receipt_no, payment_date, encoded_by, created_at, time_in, time_out, elapsed_minutes)
VALUES
  (1, 'OP-2026-0001', 'Miguel A. Santos',     'Building Permit',   53250.00, 'Paid',     'OR-88911', '2026-09-01', 1, '2026-09-01 09:04:00', '09:04:00', '09:41:00', 37),
  (2, 'OP-2026-0002', 'Luzviminda R. Ramos',  'Occupancy Permit',  18500.50, 'Paid',     'OR-88912', '2026-09-02', 1, '2026-09-02 10:12:00', '10:12:00', '10:33:00', 21),
  (3, 'OP-2026-0003', 'Jose C. Villanueva',   'Building Permit',  124850.00, 'Pending',  NULL,       NULL,        1, '2026-09-09 09:30:00', '09:30:00', NULL,      NULL),
  (4, 'OP-2026-0004', 'Maria Elena B. Lim',   'Ancillary Permit',  8730.00,  'Paid',     'OR-88927', '2026-09-11', 1, '2026-09-11 14:02:00', '14:02:00', '14:18:00', 16),
  (5, 'OP-2026-0005', 'Randy P. Fernandez',   'Building Permit',  99820.75, 'Pending',  NULL,       NULL,        1, '2026-09-13 08:45:00', '08:45:00', NULL,      NULL),
  (6, 'OP-2026-0006', 'Salome G. Dizon',      'Occupancy Permit', 12300.00, 'Paid',     'OR-88934', '2026-09-15', 1, '2026-09-15 11:20:00', '11:20:00', '11:36:00', 16),
  (7, 'OP-2026-0007', 'Antonio M. Reyes',     'Building Permit',  66240.00, 'Cancelled', NULL,      NULL,        1, '2026-09-16 09:55:00', '09:55:00', NULL,      NULL),
  (8, 'OP-2026-0008', 'Cristina D. Navarro',  'Ancillary Permit', 15490.25, 'Paid',     'OR-88940', '2026-09-17', 1, '2026-09-17 13:15:00', '13:15:00', '13:44:00', 29);

-- ---------------------------------------------------------------------------
-- PERMIT WORKFLOW
-- ---------------------------------------------------------------------------
INSERT INTO permit_workflows
  (id, application_no, permit_no, applicant_name, project_type, permit_type, assessment_approval, date_paid, released, location, current_stage, status, encoded_by, created_at, first_in, first_out, no_of_days, current_round)
VALUES
  (1, 'APP-2026-0101', 'BP-2026-0112', 'Miguel A. Santos',    'Two-storey residential', 'Building Permit',  'Approved', '2026-09-01', '2026-09-16', 'Purok 4, General Santos City',          'Releasing',        'Released',     1, '2026-08-24 08:50:00', '2026-08-24', '2026-08-26', 2, 1),
  (2, 'APP-2026-0108', 'OP-2026-0089', 'Luzviminda R. Ramos', 'Warehouse renovation',   'Occupancy Permit', 'Approved', '2026-09-02', '2026-09-15', 'Mabuhay Road, General Santos City',     'Releasing',        'Released',     1, '2026-08-27 10:00:00', '2026-08-27', '2026-08-31', 4, 1),
  (3, 'APP-2026-0124', 'BP-2026-0127', 'Jose C. Villanueva',  'Commercial building',    'Building Permit',  'Pending',  NULL,         NULL,         'National Highway, General Santos City', 'On-Site Inspection', 'Under Review', 1, '2026-09-09 09:30:00', '2026-09-09', '2026-09-11', 2, 1),
  (4, 'APP-2026-0130', 'BP-2026-0133', 'Randy P. Fernandez',  'Mixed-use building',     'Building Permit',  'Pending',  NULL,         NULL,         'Quezon Ave., General Santos City',      'Initial Review',    'Pending',      1, '2026-09-13 08:45:00', '2026-09-13', NULL, 0, 1),
  (5, 'APP-2026-0135', 'OP-2026-0098', 'Maria Elena B. Lim',  'Retail store fit-out',   'Ancillary Permit', 'Approved', '2026-09-11', NULL,         'Burgos St., General Santos City',       'Permit Approval',   'Approved',     1, '2026-09-11 14:02:00', '2026-09-11', '2026-09-14', 3, 1),
  (6, 'APP-2026-0140', 'OP-2026-0102', 'Salome G. Dizon',     'Office fit-out',         'Occupancy Permit', 'Approved', '2026-09-15', NULL,         'Pioneer Ave., General Santos City',     'Permit Approval',   'Approved',     1, '2026-09-15 11:20:00', '2026-09-15', '2026-09-17', 2, 1),
  (7, 'APP-2026-0152', NULL,             'Antonio M. Reyes',   'Rowhouse construction',  'Building Permit',  'Rejected', NULL,         NULL,         'San Isidro, General Santos City',       'Initial Review',    'Disapproved',  1, '2026-09-16 09:55:00', '2026-09-16', '2026-09-18', 2, 1),
  (8, 'APP-2026-0158', 'OP-2026-0110', 'Cristina D. Navarro', 'Signage installation',   'Ancillary Permit', 'Approved', '2026-09-17', NULL,         'Dadiangas West, General Santos City',   'Permit Approval',   'Approved',     1, '2026-09-17 13:15:00', '2026-09-17', '2026-09-18', 1, 1);

-- ---------------------------------------------------------------------------
-- PERMIT APPROVAL
-- ---------------------------------------------------------------------------
INSERT INTO permit_approvals
  (id, workflow_id, application_no, bp_no, applicant_name, location, type_of_occupancy, contractor, land_others, surcharge, area, line_grade, bldg_cost, permit_no, incharge, or_no, fees, date_paid, received_by, date_oop, date_approved, permit_type, approval_date, tat, approved_by)
VALUES
  (1, 1, 'APP-2026-0101', 'BP-2026-0112', 'Miguel A. Santos',   'Purok 4, General Santos City', 'Residential', 'Sta. Clara Construction',  150000.00, 1500.00, 248.50, 'G-1', 5820000.00, 'BP-2026-0112', 'Engr. D. Morales', 'OR-88911', 53250.00, '2026-09-01', 'Ma. Teresa Guevarra', '2026-08-24', '2026-09-05', 'Building Permit', '2026-09-05', 12, 1),
  (2, 2, 'APP-2026-0108', 'OP-2026-0089', 'Luzviminda R. Ramos', 'Mabuhay Road, General Santos City', 'Warehouse', 'Davao Builders Inc.', 80000.00, 800.00, 415.20, NULL, 2450000.00, 'OP-2026-0089', 'Engr. R. Tan', 'OR-88912', 18500.50, '2026-09-02', 'J. Salazar', '2026-08-27', '2026-09-10', 'Occupancy Permit', '2026-09-10', 14, 1),
  (3, 5, 'APP-2026-0135', 'OP-2026-0098', 'Maria Elena B. Lim',  'Burgos St., General Santos City', 'Retail', 'Interior Concepts PH', 15000.00, 150.00, 62.40, NULL, 480000.00, 'OP-2026-0098', 'Engr. L. Ramos', 'OR-88927', 8730.00, '2026-09-11', 'K. Andrada', '2026-09-11', '2026-09-14', 'Ancillary Permit', '2026-09-14', 3, 1),
  (4, 6, 'APP-2026-0140', 'OP-2026-0102', 'Salome G. Dizon',     'Pioneer Ave., General Santos City', 'Office', 'Mindanao Steel Works', 42000.00, 420.00, 175.80, NULL, 1320000.00, 'OP-2026-0102', 'Engr. P. Uy', 'OR-88934', 12300.00, '2026-09-15', 'S. Domingo', '2026-09-15', '2026-09-17', 'Occupancy Permit', '2026-09-17', 2, 1);

-- ---------------------------------------------------------------------------
-- RELEASING
-- ---------------------------------------------------------------------------
INSERT INTO releasing_plans
  (id, date_released, permit_application_no, applicant_name, claimed_by, time_released, encoded_by, released_by)
VALUES
  (1, '2026-09-15', 'APP-2026-0101', 'Miguel A. Santos',   'Miguel A. Santos',  '10:22:00', 1, 1),
  (2, '2026-09-16', 'APP-2026-0108', 'Luzviminda R. Ramos', 'Luzviminda R. Ramos', '09:47:00', 1, 1),
  (3, '2026-09-17', 'APP-2026-0124', 'Jose C. Villanueva',  'Jose C. Villanueva',  '14:05:00', 1, 1),
  (4, '2026-09-18', 'APP-2026-0130', 'Randy P. Fernandez',  'Randy P. Fernandez',  '11:38:00', 1, 1);

-- ---------------------------------------------------------------------------
-- ANNOUNCEMENTS
-- ---------------------------------------------------------------------------
INSERT INTO announcements
  (id, title, content, created_by, is_active, created_at)
VALUES
  (1, 'Updated office hours this week', 'OBO office hours this week end at 4:00 PM to accommodate the continuing permit encoding for the fourth quarter. Thank you for your cooperation.', 1, 1, '2026-09-08 08:30:00'),
  (2, 'On-site inspection schedule released', 'The on-site ocular inspection schedule for the third week of September has been released. Inspectors may view their assigned schedules under Inspection Management.', 1, 1, '2026-09-14 10:00:00'),
  (3, 'Reminder: encode release records promptly', 'All releasing records must be encoded on the same day the plans are claimed to keep permit records accurate.', 1, 1, '2026-09-16 09:15:00');

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
INSERT INTO notifications (user_id, sender_id, title, message, module_name, record_id, is_read, created_at)
VALUES
  (1, 1, 'Permit approved', 'BP-2026-0112 for Miguel A. Santos was approved and is ready for releasing.', 'permit-approval-records', 1, 0, '2026-09-05 09:00:00'),
  (1, 1, 'New plan released', 'Plans with reference APP-2026-0101 have been released to the claimant.', 'releasing-records', 1, 0, '2026-09-15 10:22:00'),
  (1, 1, 'Inspection scheduled', 'On-site inspection scheduled for APP-2026-0124 on 2026-09-21.', 'inspection-checklist', 3, 0, '2026-09-14 11:00:00'),
  (1, 1, 'Order of payment paid', 'Order of payment OP-2026-0006 was fully paid and assigned an official receipt.', 'op-records', 6, 0, '2026-09-15 11:36:00'),
  (1, 1, 'Team leader updated', 'Team Leader assignments were updated for the inspection team.', 'team-leaders', 1, 0, '2026-09-16 13:40:00'),
  (1, 1, 'Permit workflow updated', 'Permit workflow APP-2026-0140 moved to Permit Approval stage.', 'permit-workflow', 6, 0, '2026-09-17 08:55:00');

-- ---------------------------------------------------------------------------
-- ACTIVITY LOGS
-- ---------------------------------------------------------------------------
INSERT INTO activity_logs (user_id, module_name, action, description, ip_address, user_agent, created_at)
VALUES
  (1, 'auth',       'login',          'User logged in successfully', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-01 08:00:00'),
  (1, 'order-of-payment', 'create',    'Encoded order of payment OP-2026-0001', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-01 09:04:00'),
  (1, 'op-records', 'paid',           'Marked OP-2026-0001 as Paid (OR-88911)', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-01 09:41:00'),
  (1, 'permit-workflow', 'create',    'Encoded permit workflow APP-2026-0101', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-08-24 08:50:00'),
  (1, 'permit-approval-encoding', 'approve', 'Approved permit BP-2026-0112', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-05 09:00:00'),
  (1, 'releasing',  'release',        'Released plans for APP-2026-0101 to claimant', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-15 10:22:00'),
  (1, 'user-management', 'update',    'Updated user permissions for an account', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-10 09:30:00'),
  (1, 'inspection-checklist', 'schedule', 'Scheduled on-site inspection for APP-2026-0124', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-14 11:00:00'),
  (1, 'inspection-records', 'create', 'Encoded inspection record INSP-2026-0021', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-16 10:05:00'),
  (1, 'team-leaders', 'update',       'Reassigned inspection team leaders', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-16 13:40:00'),
  (1, 'permit-workflow', 'update',    'Moved APP-2026-0140 to Permit Approval stage', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-17 08:55:00'),
  (1, 'announcements', 'create',      'Posted announcement: Reminder on releasing records', '127.0.0.1', 'Portfolio-AutoScreenshots/1.0', '2026-09-16 09:15:00');

-- ---------------------------------------------------------------------------
-- INSPECTION SCHEDULES
-- ---------------------------------------------------------------------------
INSERT INTO inspection_schedules
  (id, application_no, permit_no, project_title, project_location, applicant_name, owner_representative, contact_number, scheduled_date, scheduled_time, inspector_id, status, remarks, encoded_by, created_at)
VALUES
  (1, 'APP-2026-0124', 'BP-2026-0127', 'Commercial building construction', 'National Highway, General Santos City', 'Jose C. Villanueva', 'Arch. M. Villanueva', '0917-555-0134', '2026-09-21', '09:00:00', NULL, 'Scheduled', 'Final structural inspection before approval.', 1, '2026-09-14 11:00:00'),
  (2, 'APP-2026-0130', 'BP-2026-0133', 'Mixed-use building', 'Quezon Ave., General Santos City', 'Randy P. Fernandez', 'Engr. T. Fernandez', '0918-555-0178', '2026-09-22', '10:30:00', NULL, 'Scheduled', 'Foundation inspection.', 1, '2026-09-15 09:20:00'),
  (3, 'APP-2026-0158', 'OP-2026-0110', 'Signage installation', 'Dadiangas West, General Santos City', 'Cristina D. Navarro', 'Cristina D. Navarro', '0919-555-0122', '2026-09-19', '14:00:00', NULL, 'Completed', 'Signage installed within allowed size.', 1, '2026-09-18 13:40:00');

-- ---------------------------------------------------------------------------
-- INSPECTION RECORDS
-- ---------------------------------------------------------------------------
INSERT INTO inspection_records
  (id, inspection_no, schedule_id, application_no, permit_no, permit_date_issued, project_title, project_location, owner_representative, contact_number, project_contractor, project_engineer, inspection_team, inspection_date, inspection_type, inspection_result, time_started, time_finished, physical_accomplishment, mech_accomplishment, completion_percentage, status, inspector_id, team_leader_1, team_leader_2, reviewed_by, review_date, review_remarks, approved_by, approval_date, approval_remarks, encoded_by, created_at)
VALUES
  (1, 'INSP-2026-0021', 3, 'APP-2026-0158', 'OP-2026-0110', '2026-09-18', 'Signage installation', 'Dadiangas West, General Santos City', 'Cristina D. Navarro', '0919-555-0122', 'Banner Works PH', 'Engr. R. Tan', 'Team 1', '2026-09-19', 'Initial Inspection', 'Passed', '14:00:00', '14:35:00', 100.00, 100.00, 100.00, 'Approved', NULL, 1, 2, 1, '2026-09-18 15:00:00', 'All requirements met.', 1, '2026-09-18 15:10:00', 'Approved.', 1, '2026-09-18 13:30:00'),
  (2, 'INSP-2026-0022', 1, 'APP-2026-0124', 'BP-2026-0127', NULL, 'Commercial building construction', 'National Highway, General Santos City', 'Arch. M. Villanueva', '0917-555-0134', 'Sta. Clara Construction', 'Engr. D. Morales', 'Team 2', '2026-09-21', 'Initial Inspection', 'Ongoing', NULL, NULL, 60.00, 45.00, 58.00, 'Under Review', NULL, 2, 1, 1, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-14 11:30:00');

-- ---------------------------------------------------------------------------
-- INSPECTION RESULTS (template items seeded by inspection-module.sql)
-- ---------------------------------------------------------------------------
INSERT INTO inspection_results (inspection_id, template_item_id, category, item_text, item_type, result, remarks)
VALUES
  (1, 1,    'Signage Compliance', 'Signage within permitted size',    'radio',    'Pass', NULL),
  (1, 2,    'Signage Compliance', 'Signage within permitted height',  'radio',    'Pass', NULL),
  (1, 3,    'Signage Compliance', 'Structural mounting is secure',    'radio',    'Pass', NULL),
  (2, 4,    'Structural Works',   'Foundation conforms to drawings',  'radio',    'N/A',  'Awaiting completion'),
  (2, 5,    'Structural Works',   'Vertical reinforcements installed','radio',    'N/A',  'Awaiting completion');

SET FOREIGN_KEY_CHECKS = 1;