#!/bin/bash
set -e

SQLCMD="/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -C"
DB_NAME="AlzheimerClassification"

execute_sql() {
    local sql_file=$1
    local db_context=${2:-$DB_NAME}

    if [ ! -f "$sql_file" ]; then
        echo "  WARNING: File not found: $sql_file"
        return 0
    fi

    echo "  Executing: $(basename $sql_file)"

    local temp_file="/tmp/$(basename $sql_file)"
    echo "SET QUOTED_IDENTIFIER ON;" > "$temp_file"
    echo "SET ANSI_NULLS ON;" >> "$temp_file"
    echo "GO" >> "$temp_file"
    cat "$sql_file" >> "$temp_file"

    $SQLCMD -d "$db_context" -i "$temp_file" 2>&1 || {
        echo "  WARNING: Error executing $sql_file (continuing...)"
    }

    rm -f "$temp_file"
}

execute_sql_directory() {
    local dir=$1
    local db_context=${2:-$DB_NAME}

    if [ ! -d "$dir" ]; then
        echo "  Directory not found: $dir (skipping)"
        return 0
    fi

    echo ""
    echo "Processing directory: $dir"

    for sql_file in "$dir"/*.sql; do
        if [ -f "$sql_file" ]; then
            execute_sql "$sql_file" "$db_context"
        fi
    done
}

echo ""
echo "=========================================="
echo "STEP 1: Create Database"
echo "=========================================="

$SQLCMD -Q "
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'$DB_NAME')
BEGIN
    CREATE DATABASE [$DB_NAME];
    PRINT 'Database $DB_NAME created successfully';
END
ELSE
BEGIN
    PRINT 'Database $DB_NAME already exists';
END
"

echo ""
echo "=========================================="
echo "STEP 2: Deploy Tables"
echo "=========================================="

# Orden específico para respetar foreign keys
echo "  Creating tables in order..."

# Primero las tablas sin dependencias
execute_sql "/usr/src/app/dbo/tables/Gender.sql" "$DB_NAME"
execute_sql "/usr/src/app/dbo/tables/UserType.sql" "$DB_NAME"
execute_sql "/usr/src/app/dbo/tables/ImageClassification.sql" "$DB_NAME"
execute_sql "/usr/src/app/dbo/tables/Image.sql" "$DB_NAME"

# Luego las tablas con dependencias
execute_sql "/usr/src/app/dbo/tables/User.sql" "$DB_NAME"
execute_sql "/usr/src/app/dbo/tables/ImagePatient.sql" "$DB_NAME"

echo ""
echo "=========================================="
echo "STEP 3: Deploy Functions"
echo "=========================================="

execute_sql_directory "/usr/src/app/dbo/functions" "$DB_NAME"

echo ""
echo "=========================================="
echo "STEP 4: Deploy Stored Procedures"
echo "=========================================="

# RegisterUser must be first (ExaminePatient depends on it)
execute_sql "/usr/src/app/dbo/stored-procedures/RegisterUser.sql" "$DB_NAME"

# Then deploy all other stored procedures automatically
SP_DIR="/usr/src/app/dbo/stored-procedures"
if [ -d "$SP_DIR" ]; then
    for sql_file in "$SP_DIR"/*.sql; do
        if [ -f "$sql_file" ] && [ "$(basename $sql_file)" != "RegisterUser.sql" ]; then
            execute_sql "$sql_file" "$DB_NAME"
        fi
    done
fi

echo ""
echo "=========================================="
echo "STEP 5: Seed Initial Data"
echo "=========================================="

execute_sql_directory "/usr/src/app/scripts/seed-data" "$DB_NAME"

echo ""
echo "=========================================="
echo "Database Deployment Completed Successfully!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Database: $DB_NAME"
echo "  - Tables: Gender, UserType, ImageClassification, Image, User, ImagePatient"
echo "  - Functions: CheckPatientExistence"
echo "  - Stored Procedures: All from stored-procedures folder"
echo ""
