using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceService.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "annual_limit",
                table: "PolicyDetails_Medical",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "card_tier",
                table: "PolicyDetails_Medical",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "dental_limit",
                table: "PolicyDetails_Medical",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "has_direct_billing",
                table: "PolicyDetails_Medical",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "maternity_limit",
                table: "PolicyDetails_Medical",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "outpatient_limit",
                table: "PolicyDetails_Medical",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "room_and_board_limit",
                table: "PolicyDetails_Medical",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "surgery_limit",
                table: "PolicyDetails_Medical",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "used_amount",
                table: "PolicyDetails_Medical",
                type: "decimal(15,2)",
                nullable: true,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "waiting_period_days",
                table: "PolicyDetails_Medical",
                type: "int",
                nullable: true,
                defaultValue: 30);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Claims",
                type: "datetime",
                nullable: true,
                defaultValueSql: "(getdate())");

            migrationBuilder.AddColumn<string>(
                name: "document_path",
                table: "Claims",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Claims",
                type: "datetime",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClaimApprovalHistories",
                columns: table => new
                {
                    approval_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    claim_id = table.Column<int>(type: "int", nullable: false),
                    approved_by = table.Column<int>(type: "int", nullable: false),
                    action = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    previous_status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    new_status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    comments = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    approved_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    action_date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    documents_verified = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    rejection_reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaimApprovalHistories", x => x.approval_id);
                    table.ForeignKey(
                        name: "FK_ClaimApprovalHistory_Claims",
                        column: x => x.claim_id,
                        principalTable: "Claims",
                        principalColumn: "claim_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClaimApprovalHistory_Users",
                        column: x => x.approved_by,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LoanRepaymentSchedules",
                columns: table => new
                {
                    schedule_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    loan_id = table.Column<int>(type: "int", nullable: false),
                    installment_number = table.Column<int>(type: "int", nullable: false),
                    due_date = table.Column<DateOnly>(type: "date", nullable: false),
                    principal_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    interest_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    total_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    outstanding_balance = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    is_paid = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    paid_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    paid_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    payment_reference = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    days_overdue = table.Column<int>(type: "int", nullable: true),
                    late_fee = table.Column<decimal>(type: "decimal(15,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoanRepaymentSchedules", x => x.schedule_id);
                    table.ForeignKey(
                        name: "FK_LoanRepaymentSchedule_PolicyLoans",
                        column: x => x.loan_id,
                        principalTable: "PolicyLoans",
                        principalColumn: "loan_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    notification_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    notification_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    related_entity_id = table.Column<int>(type: "int", nullable: true),
                    related_entity_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_read = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    read_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    email_sent = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    email_sent_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.notification_id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaymentReceipts",
                columns: table => new
                {
                    receipt_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    payment_id = table.Column<int>(type: "int", nullable: false),
                    receipt_number = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    generated_at = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    receipt_pdf_path = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    receipt_html = table.Column<string>(type: "ntext", nullable: true),
                    email_sent = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    email_sent_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentReceipts", x => x.receipt_id);
                    table.ForeignKey(
                        name: "FK_PaymentReceipts_PremiumPayments",
                        column: x => x.payment_id,
                        principalTable: "PremiumPayments",
                        principalColumn: "payment_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyBeneficiaries",
                columns: table => new
                {
                    beneficiary_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: false),
                    beneficiary_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    relationship = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: false),
                    phone_number = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    benefit_percentage = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    is_primary = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    identification_number = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    identification_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyBeneficiaries", x => x.beneficiary_id);
                    table.ForeignKey(
                        name: "FK_PolicyBeneficiaries_Policies",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyRenewals",
                columns: table => new
                {
                    renewal_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    renewal_date = table.Column<DateOnly>(type: "date", nullable: false),
                    previous_maturity_date = table.Column<DateOnly>(type: "date", nullable: false),
                    new_maturity_date = table.Column<DateOnly>(type: "date", nullable: false),
                    previous_premium = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    new_premium = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    renewal_term_years = table.Column<int>(type: "int", nullable: false),
                    renewal_status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Pending"),
                    renewal_notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    requested_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    processed_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    processed_by = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyRenewals", x => x.renewal_id);
                    table.ForeignKey(
                        name: "FK_PolicyRenewals_Policies",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PolicyRenewals_Users",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PolicyRiders",
                columns: table => new
                {
                    rider_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: false),
                    rider_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    rider_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    rider_premium = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    coverage_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyRiders", x => x.rider_id);
                    table.ForeignKey(
                        name: "FK_PolicyRiders_Policies",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicySurrenders",
                columns: table => new
                {
                    surrender_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    request_date = table.Column<DateOnly>(type: "date", nullable: false),
                    total_premium_paid = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    surrender_value = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    surrender_charges = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    net_payable = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    policy_held_years = table.Column<int>(type: "int", nullable: false),
                    policy_held_months = table.Column<int>(type: "int", nullable: false),
                    surrender_status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Pending"),
                    surrender_reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    admin_notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    requested_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    processed_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    processed_by = table.Column<int>(type: "int", nullable: true),
                    payment_method = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    payment_reference = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicySurrenders", x => x.surrender_id);
                    table.ForeignKey(
                        name: "FK_PolicySurrenders_Policies",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PolicySurrenders_Users",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClaimApprovalHistories_approved_by",
                table: "ClaimApprovalHistories",
                column: "approved_by");

            migrationBuilder.CreateIndex(
                name: "IX_ClaimApprovalHistories_claim_id",
                table: "ClaimApprovalHistories",
                column: "claim_id");

            migrationBuilder.CreateIndex(
                name: "IX_LoanRepaymentSchedules_loan_id",
                table: "LoanRepaymentSchedules",
                column: "loan_id");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_user_id",
                table: "Notifications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentReceipts_payment_id",
                table: "PaymentReceipts",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentReceipts_receipt_number",
                table: "PaymentReceipts",
                column: "receipt_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PolicyBeneficiaries_policy_id",
                table: "PolicyBeneficiaries",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyRenewals_policy_id",
                table: "PolicyRenewals",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyRenewals_user_id",
                table: "PolicyRenewals",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyRiders_policy_id",
                table: "PolicyRiders",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_PolicySurrenders_policy_id",
                table: "PolicySurrenders",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_PolicySurrenders_user_id",
                table: "PolicySurrenders",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClaimApprovalHistories");

            migrationBuilder.DropTable(
                name: "LoanRepaymentSchedules");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "PaymentReceipts");

            migrationBuilder.DropTable(
                name: "PolicyBeneficiaries");

            migrationBuilder.DropTable(
                name: "PolicyRenewals");

            migrationBuilder.DropTable(
                name: "PolicyRiders");

            migrationBuilder.DropTable(
                name: "PolicySurrenders");

            migrationBuilder.DropColumn(
                name: "annual_limit",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "card_tier",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "dental_limit",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "has_direct_billing",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "maternity_limit",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "outpatient_limit",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "room_and_board_limit",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "surgery_limit",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "used_amount",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "waiting_period_days",
                table: "PolicyDetails_Medical");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "document_path",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Claims");
        }
    }
}
