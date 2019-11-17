using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace GIS.Migrations
{
    public partial class pubimages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PubsImages",
                columns: table => new
                {
                    IdIPubImage = table.Column<Guid>(nullable: false),
                    PubImageName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PubsImages", x => x.IdIPubImage);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PubsImages");
        }
    }
}
