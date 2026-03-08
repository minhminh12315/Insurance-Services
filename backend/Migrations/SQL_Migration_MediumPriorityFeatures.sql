-- ================================================================
-- SQL Migration Script: Medium Priority Features
-- Date: March 3, 2026
-- Description: Add medium-priority business features including:
--   1. Policy Renewal System
--   2. Beneficiary Management
--   3. Claim Approval Workflow
--   4. Payment Receipt System
--   5. Policy Surrender System
--   6. Loan Repayment Schedule
-- ================================================================

USE InsuranceDB;
GO

PRINT 'Starting Medium Priority Features Migration...';
GO

-- ================================================================
-- 1. CREATE TABLE: PolicyRenewals
-- ================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PolicyRenewals')
BEGIN
    CREATE TABLE PolicyRenewals (
        renewal_id INT PRIMARY KEY IDENTITY(1,1),
        policy_id INT NOT NULL,
        user_id INT NOT NULL,
        renewal_date DATE NOT NULL,
        previous_maturity_date DATE NOT NULL,
        new_maturity_date DATE NOT NULL,
        previous_premium DECIMAL(15, 2) NOT NULL,
        new_premium DECIMAL(15, 2) NOT NULL,
        renewal_term_years INT NOT NULL,
        renewal_status NVARCHAR(20) DEFAULT 'Pending',
        renewal_notes NVARCHAR(1000) NULL,
        requested_at DATETIME DEFAULT GETDATE(),
        processed_at DATETIME NULL,
        processed_by INT NULL,
        CONSTRAINT FK_PolicyRenewals_Policies FOREIGN KEY (policy_id) REFERENCES Policies(policy_id) ON DELETE CASCADE,
        CONSTRAINT FK_PolicyRenewals_Users FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE NO ACTION
    );

    CREATE INDEX IX_PolicyRenewals_PolicyId ON PolicyRenewals(policy_id);
    CREATE INDEX IX_PolicyRenewals_UserId ON PolicyRenewals(user_id);
    CREATE INDEX IX_PolicyRenewals_Status ON PolicyRenewals(renewal_status);

    PRINT '✓ Table PolicyRenewals created successfully';
END
ELSE
BEGIN
    PRINT '✗ Table PolicyRenewals already exists - skipping';
END
GO

-- ================================================================
-- 2. CREATE TABLE: PolicyBeneficiaries
-- ================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PolicyBeneficiaries')
BEGIN
    CREATE TABLE PolicyBeneficiaries (
        beneficiary_id INT PRIMARY KEY IDENTITY(1,1),
        policy_id INT NOT NULL,
        beneficiary_name NVARCHAR(100) NOT NULL,
        relationship NVARCHAR(50) NOT NULL,
        date_of_birth DATE NOT NULL,
        phone_number NVARCHAR(20) NULL,
        email NVARCHAR(100) NULL,
        address NVARCHAR(500) NULL,
        benefit_percentage DECIMAL(5, 2) NOT NULL,
        is_primary BIT DEFAULT 1,
        is_active BIT DEFAULT 1,
        identification_number NVARCHAR(50) NULL,
        identification_type NVARCHAR(50) NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL,
        CONSTRAINT FK_PolicyBeneficiaries_Policies FOREIGN KEY (policy_id) REFERENCES Policies(policy_id) ON DELETE CASCADE,
        CONSTRAINT CK_BenefitPercentage CHECK (benefit_percentage > 0 AND benefit_percentage <= 100)
    );

    CREATE INDEX IX_PolicyBeneficiaries_PolicyId ON PolicyBeneficiaries(policy_id);
    CREATE INDEX IX_PolicyBeneficiaries_IsActive ON PolicyBeneficiaries(is_active);

    PRINT '✓ Table PolicyBeneficiaries created successfully';
END
ELSE
BEGIN
    PRINT '✗ Table PolicyBeneficiaries already exists - skipping';
END
GO

-- ================================================================
-- 3. CREATE TABLE: ClaimApprovalHistory
-- ================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ClaimApprovalHistory')
BEGIN
    CREATE TABLE ClaimApprovalHistory (
        approval_id INT PRIMARY KEY IDENTITY(1,1),
        claim_id INT NOT NULL,
        approved_by INT NOT NULL,
        action NVARCHAR(50) NOT NULL,
        previous_status NVARCHAR(20) NOT NULL,
        new_status NVARCHAR(20) NOT NULL,
        comments NVARCHAR(1000) NULL,
        approved_amount DECIMAL(15, 2) NULL,
        action_date DATETIME DEFAULT GETDATE(),
        documents_verified NVARCHAR(500) NULL,
        rejection_reason NVARCHAR(500) NULL,
        CONSTRAINT FK_ClaimApprovalHistory_Claims FOREIGN KEY (claim_id) REFERENCES Claims(claim_id) ON DELETE CASCADE,
        CONSTRAINT FK_ClaimApprovalHistory_Users FOREIGN KEY (approved_by) REFERENCES Users(user_id) ON DELETE NO ACTION
    );

    CREATE INDEX IX_ClaimApprovalHistory_ClaimId ON ClaimApprovalHistory(claim_id);
    CREATE INDEX IX_ClaimApprovalHistory_ApprovedBy ON ClaimApprovalHistory(approved_by);
    CREATE INDEX IX_ClaimApprovalHistory_ActionDate ON ClaimApprovalHistory(action_date);

    PRINT '✓ Table ClaimApprovalHistory created successfully';
END
ELSE
BEGIN
    PRINT '✗ Table ClaimApprovalHistory already exists - skipping';
END
GO

-- ================================================================
-- 4. CREATE TABLE: PaymentReceipts
-- ================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PaymentReceipts')
BEGIN
    CREATE TABLE PaymentReceipts (
        receipt_id INT PRIMARY KEY IDENTITY(1,1),
        payment_id INT NOT NULL,
        receipt_number NVARCHAR(50) NOT NULL UNIQUE,
        generated_at DATETIME DEFAULT GETDATE(),
        receipt_pdf_path NVARCHAR(500) NULL,
        receipt_html NTEXT NULL,
        email_sent BIT DEFAULT 0,
        email_sent_at DATETIME NULL,
        CONSTRAINT FK_PaymentReceipts_PremiumPayments FOREIGN KEY (payment_id) REFERENCES PremiumPayments(payment_id) ON DELETE CASCADE
    );

    CREATE INDEX IX_PaymentReceipts_PaymentId ON PaymentReceipts(payment_id);
    CREATE UNIQUE INDEX IX_PaymentReceipts_ReceiptNumber ON PaymentReceipts(receipt_number);

    PRINT '✓ Table PaymentReceipts created successfully';
END
ELSE
BEGIN
    PRINT '✗ Table PaymentReceipts already exists - skipping';
END
GO

-- ================================================================
-- 5. CREATE TABLE: PolicySurrenders
-- ================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PolicySurrenders')
BEGIN
    CREATE TABLE PolicySurrenders (
        surrender_id INT PRIMARY KEY IDENTITY(1,1),
        policy_id INT NOT NULL,
        user_id INT NOT NULL,
        request_date DATE NOT NULL,
        total_premium_paid DECIMAL(15, 2) NOT NULL,
        surrender_value DECIMAL(15, 2) NOT NULL,
        surrender_charges DECIMAL(15, 2) NOT NULL,
        net_payable DECIMAL(15, 2) NOT NULL,
        policy_held_years INT NOT NULL,
        policy_held_months INT NOT NULL,
        surrender_status NVARCHAR(20) DEFAULT 'Pending',
        surrender_reason NVARCHAR(500) NULL,
        admin_notes NVARCHAR(1000) NULL,
        requested_at DATETIME DEFAULT GETDATE(),
        processed_at DATETIME NULL,
        processed_by INT NULL,
        payment_method NVARCHAR(50) NULL,
        payment_reference NVARCHAR(200) NULL,
        CONSTRAINT FK_PolicySurrenders_Policies FOREIGN KEY (policy_id) REFERENCES Policies(policy_id) ON DELETE CASCADE,
        CONSTRAINT FK_PolicySurrenders_Users FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE NO ACTION
    );

    CREATE INDEX IX_PolicySurrenders_PolicyId ON PolicySurrenders(policy_id);
    CREATE INDEX IX_PolicySurrenders_UserId ON PolicySurrenders(user_id);
    CREATE INDEX IX_PolicySurrenders_Status ON PolicySurrenders(surrender_status);

    PRINT '✓ Table PolicySurrenders created successfully';
END
ELSE
BEGIN
    PRINT '✗ Table PolicySurrenders already exists - skipping';
END
GO

-- ================================================================
-- 6. CREATE TABLE: LoanRepaymentSchedule
-- ================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LoanRepaymentSchedule')
BEGIN
    CREATE TABLE LoanRepaymentSchedule (
        schedule_id INT PRIMARY KEY IDENTITY(1,1),
        loan_id INT NOT NULL,
        installment_number INT NOT NULL,
        due_date DATE NOT NULL,
        principal_amount DECIMAL(15, 2) NOT NULL,
        interest_amount DECIMAL(15, 2) NOT NULL,
        total_amount DECIMAL(15, 2) NOT NULL,
        outstanding_balance DECIMAL(15, 2) NOT NULL,
        is_paid BIT DEFAULT 0,
        paid_date DATETIME NULL,
        paid_amount DECIMAL(15, 2) NULL,
        payment_reference NVARCHAR(200) NULL,
        days_overdue INT NULL,
        late_fee DECIMAL(15, 2) NULL,
        CONSTRAINT FK_LoanRepaymentSchedule_PolicyLoans FOREIGN KEY (loan_id) REFERENCES PolicyLoans(loan_id) ON DELETE CASCADE
    );

    CREATE INDEX IX_LoanRepaymentSchedule_LoanId ON LoanRepaymentSchedule(loan_id);
    CREATE INDEX IX_LoanRepaymentSchedule_DueDate ON LoanRepaymentSchedule(due_date);
    CREATE INDEX IX_LoanRepaymentSchedule_IsPaid ON LoanRepaymentSchedule(is_paid);
    CREATE INDEX IX_LoanRepaymentSchedule_Overdue ON LoanRepaymentSchedule(is_paid, due_date) 
        WHERE is_paid = 0;

    PRINT '✓ Table LoanRepaymentSchedule created successfully';
END
ELSE
BEGIN
    PRINT '✗ Table LoanRepaymentSchedule already exists - skipping';
END
GO

-- ================================================================
-- SUMMARY
-- ================================================================
PRINT '';
PRINT '========================================';
PRINT 'Medium Priority Features Migration Complete';
PRINT '========================================';
PRINT 'Tables created:';
PRINT '  1. PolicyRenewals - Policy renewal requests';
PRINT '  2. PolicyBeneficiaries - Policy beneficiaries/nominees';
PRINT '  3. ClaimApprovalHistory - Claim workflow audit trail';
PRINT '  4. PaymentReceipts - Payment receipt generation';
PRINT '  5. PolicySurrenders - Policy surrender requests';
PRINT '  6. LoanRepaymentSchedule - Loan EMI schedule';
PRINT '';
PRINT 'Total: 6 new tables added';
PRINT '========================================';
GO
