#!/bin/bash
set -e

echo "=========================================="
echo "Starting SQL Server..."
echo "=========================================="

/opt/mssql/bin/sqlservr &
SQL_PID=$!

echo "Waiting for SQL Server to be ready..."
for i in {1..60}; do
    if /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" -C -b 2>&1 | grep -q "1 rows affected"; then
        echo "SQL Server is ready!"
        break
    fi

    if [ $i -eq 60 ]; then
        echo "ERROR: SQL Server failed to start after 60 attempts"
        echo "Last connection attempt output:"
        /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" -C -b 2>&1 || true
        exit 1
    fi

    echo "Attempt $i/60: SQL Server not ready yet..."
    sleep 2
done

echo "=========================================="
echo "Deploying Alzheimer Classification Database..."
echo "=========================================="

if [ -f /usr/src/app/deploy-database.sh ]; then
    bash /usr/src/app/deploy-database.sh
else
    echo "WARNING: deploy-database.sh not found, skipping deployment"
fi

echo "=========================================="
echo "Alzheimer Classification Database ready!"
echo "=========================================="

wait $SQL_PID
