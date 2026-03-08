-- Migration: Add High Priority Features
-- Date: 2026-03-03
-- Description: Adds Notifications, PolicyRiders, enhanced Claim and PolicyDetailsMedical tables

-- 1. Create Notifications table
CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    message NVARCHAR(1000) NOT NULL,
    notification_type NVARCHAR(50) NOT NULL,
    related_entity_id INT NULL,
    related_entity_type NVARCHAR(50) NULL,
    is_read BIT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    read_at DATETIME NULL,
    email_sent BIT NOT NULL DEFAULT 0,
    email_sent_at DATETIME NULL,
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX IX_Notifications_UserId ON Notifications(user_id);
CREATE INDEX IX_Notifications_IsRead ON Notifications(is_read);
CREATE INDEX IX_Notifications_CreatedAt ON Notifications(created_at DESC);

-- 2. Create PolicyRiders table
CREATE TABLE PolicyRiders (
    rider_id INT PRIMARY KEY IDENTITY(1,1),
    policy_id INT NOT NULL,
    rider_name NVARCHAR(100) NOT NULL,
    rider_type NVARCHAR(50) NOT NULL,
    description NVARCHAR(500) NULL,
    rider_premium DECIMAL(15,2) NOT NULL,
    coverage_amount DECIMAL(15,2) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_PolicyRiders_Policies FOREIGN KEY (policy_id) REFERENCES Policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX IX_PolicyRiders_PolicyId ON PolicyRiders(policy_id);
CREATE INDEX IX_PolicyRiders_RiderType ON PolicyRiders(rider_type);

-- 3. Alter Claims table - Add new columns
ALTER TABLE Claims ADD document_path NVARCHAR(500) NULL;
ALTER TABLE Claims ADD created_at DATETIME NOT NULL DEFAULT GETDATE();
ALTER TABLE Claims ADD updated_at DATETIME NULL;

-- 4. Alter PolicyDetails_Medical table - Add new columns
ALTER TABLE PolicyDetails_Medical ADD annual_limit DECIMAL(15,2) NULL;
ALTER TABLE PolicyDetails_Medical ADD used_amount DECIMAL(15,2) NOT NULL DEFAULT 0;
ALTER TABLE PolicyDetails_Medical ADD room_and_board_limit DECIMAL(15,2) NULL;
ALTER TABLE PolicyDetails_Medical ADD surgery_limit DECIMAL(15,2) NULL;
ALTER TABLE PolicyDetails_Medical ADD outpatient_limit DECIMAL(15,2) NULL;
ALTER TABLE PolicyDetails_Medical ADD dental_limit DECIMAL(15,2) NULL;
ALTER TABLE PolicyDetails_Medical ADD maternity_limit DECIMAL(15,2) NULL;
ALTER TABLE PolicyDetails_Medical ADD has_direct_billing BIT NOT NULL DEFAULT 0;
ALTER TABLE PolicyDetails_Medical ADD card_tier NVARCHAR(20) NULL;
ALTER TABLE PolicyDetails_Medical ADD waiting_period_days INT NOT NULL DEFAULT 30;

-- 5. Create Uploads directory table for file tracking (optional)
CREATE TABLE FileUploads (
    file_id INT PRIMARY KEY IDENTITY(1,1),
    file_path NVARCHAR(500) NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    file_type NVARCHAR(100) NOT NULL,
    entity_type NVARCHAR(50) NOT NULL, -- Claim, Policy, etc.
    entity_id INT NOT NULL,
    uploaded_by INT NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT GETDATE(),
    file_size BIGINT NULL,
    CONSTRAINT FK_FileUploads_Users FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
);

CREATE INDEX IX_FileUploads_EntityType ON FileUploads(entity_type, entity_id);

PRINT 'Migration completed successfully!';
