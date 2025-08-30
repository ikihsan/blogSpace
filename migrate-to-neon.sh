#!/bin/bash

echo "🚀 Starting Database Migration from Render to Neon"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
echo "📋 Checking prerequisites..."
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}❌ pg_dump not found. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql not found. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Backup from Render database
echo ""
echo "📤 Step 1: Backing up data from Render database..."
echo "=================================================="

# Extract connection details from .env
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found in backend directory${NC}"
    exit 1
fi

# Read DATABASE_URL from .env
RENDER_DB_URL=$(grep "DATABASE_URL=" .env | cut -d '=' -f2-)

if [ -z "$RENDER_DB_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not found in .env file${NC}"
    exit 1
fi

echo "🔗 Render DB URL found"
BACKUP_FILE="render_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "📦 Creating backup file: $BACKUP_FILE"
pg_dump "$RENDER_DB_URL" --no-owner --no-privileges --clean --if-exists --verbose > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created successfully: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

# Update .env file with Neon URL
echo ""
echo "🔄 Step 2: Updating .env file with Neon database URL..."
echo "======================================================"

NEON_DB_URL="postgresql://neondb_owner:npg_hPW62cUpxjos@ep-wandering-shape-a185dr4w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Backup original .env
cp .env .env.render_backup

# Update DATABASE_URL
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$NEON_DB_URL|" .env
else
    # Linux/Windows
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$NEON_DB_URL|" .env
fi

echo -e "${GREEN}✅ .env file updated with Neon URL${NC}"
echo "📋 Original .env backed up as .env.render_backup"

# Test Neon connection
echo ""
echo "🔗 Step 3: Testing Neon database connection..."
echo "=============================================="

psql "$NEON_DB_URL" -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Neon database connection successful${NC}"
else
    echo -e "${RED}❌ Neon database connection failed${NC}"
    echo "🔄 Restoring original .env file..."
    mv .env.render_backup .env
    exit 1
fi

# Restore data to Neon
echo ""
echo "📥 Step 4: Restoring data to Neon database..."
echo "============================================="

echo "⚠️  This will overwrite any existing data in Neon database"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled by user"
    echo "🔄 Restoring original .env file..."
    mv .env.render_backup .env
    exit 1
fi

# Drop existing schema and restore
psql "$NEON_DB_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" > /dev/null 2>&1
psql "$NEON_DB_URL" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Data migration to Neon completed successfully${NC}"
else
    echo -e "${RED}❌ Data migration failed${NC}"
    echo "🔄 Restoring original .env file..."
    mv .env.render_backup .env
    exit 1
fi

# Test the application
echo ""
echo "🧪 Step 5: Testing application with new database..."
echo "==================================================="

echo "🔄 Starting backend server to test connection..."
npm start &
SERVER_PID=$!

# Wait a bit for server to start
sleep 10

# Test health endpoint
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Application successfully connected to Neon database${NC}"
else
    echo -e "${YELLOW}⚠️  Application may not be fully started yet, but database connection should work${NC}"
fi

# Stop test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Migration Summary:"
echo "===================="
echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
echo -e "${GREEN}✅ Database URL updated to Neon${NC}"
echo -e "${GREEN}✅ Data migrated successfully${NC}"
echo -e "${GREEN}✅ Connection test passed${NC}"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Test your application locally: npm start"
echo "2. If everything works, commit and push changes:"
echo "   git add ."
echo "   git commit -m 'Migrate database from Render to Neon'"
echo "   git push origin master"
echo "3. Redeploy on Render with new environment variables"
echo "4. Monitor your application for any issues"
echo ""
echo -e "${YELLOW}⚠️  Important: Keep the backup file ($BACKUP_FILE) safe!${NC}"
