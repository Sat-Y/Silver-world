# Mizuki Blog - Admin Panel Guide

This guide will help you use the new admin panel for managing your Mizuki Blog.

## Accessing the Admin Panel

1. Make sure both frontend and backend servers are running:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`

2. Navigate to the admin login page:
   ```
   http://localhost:3000/admin/login
   ```

3. Login with your admin credentials:
   - **Username**: admin
   - **Password**: admin123

## Dashboard Overview

After logging in, you'll be redirected to the admin dashboard. Here you can see:
- Total number of posts
- Total number of albums
- Total number of photos
- Quick actions for creating new posts and albums

## Managing Blog Posts

### Creating a New Post

1. Click on "New Post" from the dashboard or the sidebar menu
2. Fill in the post details:
   - **Title**: The title of your blog post
   - **Status**: Choose between "Draft" or "Published"
   - **Categories**: Comma-separated list of categories
   - **Tags**: Comma-separated list of tags
   - **Published Date**: Set the publication date
   - **Content**: Write your post using Markdown
   - **Excerpt**: A short summary of your post (optional, auto-generated if not provided)

3. Use the Markdown preview to see how your post will look
4. Click "Save Post" to create the post

### Editing a Post

1. Navigate to the posts list (`http://localhost:3000/admin/posts`)
2. Click the edit icon (pencil) next to the post you want to edit
3. Make your changes
4. Click "Update Post" to save the changes

### Deleting a Post

1. Navigate to the posts list
2. Click the delete icon (trash can) next to the post you want to delete
3. Confirm the deletion in the modal

## Managing Albums and Photos

### Creating a New Album

1. Click on "New Album" from the dashboard or the sidebar menu
2. Fill in the album details:
   - **Title**: The title of your album
   - **Description**: A description of the album
   - **Date**: Set the album date
   - **Location**: Where the photos were taken
   - **Tags**: Comma-separated list of tags

3. Click "Create Album"
4. After creating the album, you can upload photos to it

### Uploading Photos to an Album

1. Create an album first (you can't upload photos to a non-existent album)
2. After creating the album, the photo upload section will become available
3. Click on the upload area to select photos from your computer
4. You can select multiple photos at once
5. Click "Start Upload" to upload the selected photos
6. The uploaded photos will be displayed in the preview section

### Deleting Photos

1. After uploading photos, they will appear in the preview section
2. Click the delete icon (trash can) in the top-right corner of each photo
3. The photo will be removed from the album and deleted from the server

### Deleting an Album

1. Navigate to the albums list (`http://localhost:3000/admin/albums`)
2. Click the delete icon (trash can) next to the album you want to delete
3. Confirm the deletion in the modal (this will also delete all associated photos)

## Admin Panel Features

### Responsive Design
The admin panel is fully responsive and works on both desktop and mobile devices.

### Markdown Editor
- Real-time preview
- Syntax highlighting
- Support for all standard Markdown features

### File Upload
- Support for multiple file uploads
- Image validation (only image files allowed)
- File size limit (5MB per file)
- Visual feedback during upload

### Security
- JWT authentication
- Protected routes
- Secure password storage
- File upload validation

## Troubleshooting

### I can't access the admin panel
- Make sure both frontend and backend servers are running
- Check that you're using the correct URL: `http://localhost:3000/admin/login`
- Verify that you're using the correct login credentials

### Photos aren't uploading
- Check that the backend server is running
- Make sure you've created an album first
- Verify that your files are image files (JPG, PNG, GIF, WebP)
- Check that your files are under 5MB in size

### Changes aren't saving
- Check that you're logged in
- Verify that the backend server is running
- Check the browser console for any error messages

## Customization

### Changing the Default Admin Password

1. Login to the admin panel
2. Go to the profile section (to be implemented)
3. Change your password

### Customizing the Admin Theme

The admin panel uses the same Tailwind CSS theme as the main blog. To customize the colors and styles:

1. Edit the Tailwind configuration in `tailwind.config.js`
2. Modify the CSS variables in `src/styles/variables.styl`
3. Rebuild the project

## Security Best Practices

1. Change the default admin password immediately
2. Use strong passwords
3. Keep your Node.js and dependencies up to date
4. Configure proper CORS settings in production
5. Consider adding rate limiting to prevent brute force attacks
6. Use HTTPS in production

## Backup

To backup your data:

1. Backup the `backend/database` directory (contains all posts and albums data)
2. Backup the `public/uploads` directory (contains all uploaded photos)
3. Backup the `.env` file (contains your configuration)

## Updating the Project

1. Pull the latest changes from the repository
2. Update dependencies:
   ```bash
   npm install
   cd backend
   npm install
   ```

3. Restart both servers

## Contact

If you encounter any issues or have questions, please refer to the project documentation or contact the developer.

---

Happy blogging with Mizuki!
