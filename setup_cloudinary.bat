@echo off
echo Setting up Cloudinary environment variables for your blog project...
echo.
echo Please provide your Cloudinary credentials:
echo.

set /p CLOUD_NAME="Enter your Cloudinary Cloud Name: "
set /p API_KEY="Enter your Cloudinary API Key: "
set /p API_SECRET="Enter your Cloudinary API Secret: "

REM Update the .env file
set ENV_FILE="d:\Ihsan project\persblog\personalblog\backend\.env"

if exist "%ENV_FILE%" (
    REM Add Cloudinary variables to existing .env file
    echo. >> "%ENV_FILE%"
    echo # Cloudinary Configuration >> "%ENV_FILE%"
    echo CLOUDINARY_CLOUD_NAME=%CLOUD_NAME% >> "%ENV_FILE%"
    echo CLOUDINARY_API_KEY=%API_KEY% >> "%ENV_FILE%"
    echo CLOUDINARY_API_SECRET=%API_SECRET% >> "%ENV_FILE%"

    echo.
    echo ✅ Cloudinary environment variables have been added to your .env file!
    echo.
    echo Your .env file now includes:
    echo   - CLOUDINARY_CLOUD_NAME: %CLOUD_NAME%
    echo   - CLOUDINARY_API_KEY: %API_KEY%
    echo   - CLOUDINARY_API_SECRET: [HIDDEN]
    echo.
    echo 🚀 Your blog is now ready to use Cloudinary for image storage!
    echo.
    echo Next steps:
    echo 1. Restart your backend server
    echo 2. Test image uploads in your admin panel
    echo 3. Images will now be stored in Cloudinary instead of local storage
) else (
    echo ❌ .env file not found at %ENV_FILE%
    echo Please make sure the backend directory exists.
)
pause
