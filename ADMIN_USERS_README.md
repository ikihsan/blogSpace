# Admin User Management

This guide explains how to manage admin users in your blog system.

## Current Admin Users

Your system currently has the following admin users:
- `nkfathima05@gmail.com` (original admin)
- `your_admin_email@domain.com`
- `fathimank@mail.com`
- `ikihsaan@gmail.com` (newly added)

## How to Add More Admin Users

### Method 1: Using the Management Script (Recommended)

Navigate to your backend directory and run:

```bash
cd backend
node manage-admins.js add newadmin@example.com securepassword123
```

### Method 2: Using the Simple Script

```bash
cd backend
node add-admin.js newadmin@example.com securepassword123
```

### Method 3: Manual Environment Variable Method

You can also add admin users by setting environment variables, but this requires server restart:

```bash
# Add to your .env file
ADMIN_EMAIL_2=newadmin@example.com
ADMIN_PASSWORD_2=securepassword123
```

## Available Commands

### List All Admin Users
```bash
node manage-admins.js list
```

### Add New Admin User
```bash
node manage-admins.js add email@example.com password123
```

### Remove Admin Privileges
```bash
node manage-admins.js remove email@example.com
```

## Security Notes

- Admin passwords are automatically hashed using bcrypt
- All admin users have full access to the admin panel
- You can have unlimited admin users
- Removing admin privileges changes the user to a regular user (doesn't delete them)

## Deployment

After adding admin users locally, the changes will be reflected in your deployed application since the users are stored in the database.

## Troubleshooting

If you encounter database connection issues:
1. Make sure your `.env` file has the correct `DATABASE_URL`
2. Ensure the database is running and accessible
3. Check that all required environment variables are set
