using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceService.API.Migrations
{
    /// <inheritdoc />
    public partial class VNPAY : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InsuranceCategories",
                columns: table => new
                {
                    category_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    category_name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Insuranc__D54EE9B40360DABD", x => x.category_id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    full_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    password_hash = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    phone_number = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: false),
                    gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    city = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Customer"),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__B9BE370F35449800", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "InsuranceSchemes",
                columns: table => new
                {
                    scheme_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    category_id = table.Column<int>(type: "int", nullable: true),
                    scheme_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    min_term = table.Column<int>(type: "int", nullable: true),
                    max_term = table.Column<int>(type: "int", nullable: true),
                    min_investment_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    max_investment_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    profit_ratio = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    new_launch_date = table.Column<DateOnly>(type: "date", nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Insuranc__8DF8FA63B4C6C668", x => x.scheme_id);
                    table.ForeignKey(
                        name: "FK__Insurance__categ__693CA210",
                        column: x => x.category_id,
                        principalTable: "InsuranceCategories",
                        principalColumn: "category_id");
                });

            migrationBuilder.CreateTable(
                name: "NewsAndAnnouncements",
                columns: table => new
                {
                    news_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    published_date = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    author_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NewsAndA__4C27CCD8E2DD9B95", x => x.news_id);
                    table.ForeignKey(
                        name: "FK__NewsAndAn__autho__14270015",
                        column: x => x.author_id,
                        principalTable: "Users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    RefreshTokenId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReplacedByToken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ReasonRevoked = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByIp = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RevokedByIp = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.RefreshTokenId);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Policies",
                columns: table => new
                {
                    policy_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    scheme_id = table.Column<int>(type: "int", nullable: false),
                    policy_number = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    start_date = table.Column<DateOnly>(type: "date", nullable: false),
                    maturity_date = table.Column<DateOnly>(type: "date", nullable: false),
                    term_years = table.Column<int>(type: "int", nullable: false),
                    payment_frequency = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    sum_assured = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    premium_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    policy_status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Pending"),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Policies__47DA3F0311C450B0", x => x.policy_id);
                    table.ForeignKey(
                        name: "FK__Policies__scheme__71D1E811",
                        column: x => x.scheme_id,
                        principalTable: "InsuranceSchemes",
                        principalColumn: "scheme_id");
                    table.ForeignKey(
                        name: "FK__Policies__user_i__70DDC3D8",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "Claims",
                columns: table => new
                {
                    claim_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    claim_date = table.Column<DateOnly>(type: "date", nullable: false),
                    claim_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Submitted"),
                    admin_comment = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Claims__F9CC0896144DC79A", x => x.claim_id);
                    table.ForeignKey(
                        name: "FK__Claims__policy_i__18EBB532",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id");
                    table.ForeignKey(
                        name: "FK__Claims__user_id__19DFD96B",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "PolicyDetails_Home",
                columns: table => new
                {
                    detail_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: true),
                    property_address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    property_value = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    structure_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    built_year = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PolicyDe__38E9A2245B17D7E2", x => x.detail_id);
                    table.ForeignKey(
                        name: "FK__PolicyDet__polic__02FC7413",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyDetails_Life",
                columns: table => new
                {
                    detail_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: true),
                    nominee_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    nominee_relation = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PolicyDe__38E9A22438F371FB", x => x.detail_id);
                    table.ForeignKey(
                        name: "FK__PolicyDet__polic__75A278F5",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyDetails_Medical",
                columns: table => new
                {
                    detail_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: true),
                    pre_existing_diseases = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    hospital_network_tier = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_family_floater = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PolicyDe__38E9A22431A48E84", x => x.detail_id);
                    table.ForeignKey(
                        name: "FK__PolicyDet__polic__7A672E12",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyDetails_Motor",
                columns: table => new
                {
                    detail_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: true),
                    vehicle_reg_number = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    vehicle_model = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    vehicle_type = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    engine_number = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    chassis_number = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    manufacturing_year = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PolicyDe__38E9A22426EED2C7", x => x.detail_id);
                    table.ForeignKey(
                        name: "FK__PolicyDet__polic__7F2BE32F",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyLoans",
                columns: table => new
                {
                    loan_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    loan_amount = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    interest_rate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    application_date = table.Column<DateOnly>(type: "date", nullable: false),
                    approval_date = table.Column<DateOnly>(type: "date", nullable: true),
                    loan_status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Requested")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PolicyLo__A1F79554F1962F1B", x => x.loan_id);
                    table.ForeignKey(
                        name: "FK__PolicyLoa__polic__0F624AF8",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id");
                    table.ForeignKey(
                        name: "FK__PolicyLoa__user___10566F31",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "PremiumPayments",
                columns: table => new
                {
                    payment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    policy_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    amount_paid = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    payment_date = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    payment_method = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    transaction_reference = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    order_code = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    gateway = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Pending")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PremiumP__ED1FC9EA4E0C5346", x => x.payment_id);
                    table.ForeignKey(
                        name: "FK__PremiumPa__polic__09A971A2",
                        column: x => x.policy_id,
                        principalTable: "Policies",
                        principalColumn: "policy_id");
                    table.ForeignKey(
                        name: "FK__PremiumPa__user___0A9D95DB",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Claims_policy_id",
                table: "Claims",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_user_id",
                table: "Claims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceSchemes_category_id",
                table: "InsuranceSchemes",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_NewsAndAnnouncements_author_id",
                table: "NewsAndAnnouncements",
                column: "author_id");

            migrationBuilder.CreateIndex(
                name: "IX_Policies_scheme_id",
                table: "Policies",
                column: "scheme_id");

            migrationBuilder.CreateIndex(
                name: "IX_Policies_user_id",
                table: "Policies",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "UQ__Policies__9691687297386018",
                table: "Policies",
                column: "policy_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__PolicyDe__47DA3F0228F3C749",
                table: "PolicyDetails_Home",
                column: "policy_id",
                unique: true,
                filter: "[policy_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__PolicyDe__47DA3F02CF575983",
                table: "PolicyDetails_Life",
                column: "policy_id",
                unique: true,
                filter: "[policy_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__PolicyDe__47DA3F02095C5CAC",
                table: "PolicyDetails_Medical",
                column: "policy_id",
                unique: true,
                filter: "[policy_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__PolicyDe__47DA3F02C801E076",
                table: "PolicyDetails_Motor",
                column: "policy_id",
                unique: true,
                filter: "[policy_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyLoans_policy_id",
                table: "PolicyLoans",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyLoans_user_id",
                table: "PolicyLoans",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_PremiumPayments_policy_id",
                table: "PremiumPayments",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_PremiumPayments_user_id",
                table: "PremiumPayments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__AB6E61644DCC5FA2",
                table: "Users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Claims");

            migrationBuilder.DropTable(
                name: "NewsAndAnnouncements");

            migrationBuilder.DropTable(
                name: "PolicyDetails_Home");

            migrationBuilder.DropTable(
                name: "PolicyDetails_Life");

            migrationBuilder.DropTable(
                name: "PolicyDetails_Medical");

            migrationBuilder.DropTable(
                name: "PolicyDetails_Motor");

            migrationBuilder.DropTable(
                name: "PolicyLoans");

            migrationBuilder.DropTable(
                name: "PremiumPayments");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "Policies");

            migrationBuilder.DropTable(
                name: "InsuranceSchemes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "InsuranceCategories");
        }
    }
}
