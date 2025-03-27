# Changelog

All notable changes to the App Store Scraper Example project will be documented in this file.

## [0.0.1] - 2025-03-27

### Added
- Initial release of the App Store Scraper Example project
- Core functionality for scraping App Store data:
  - Search functionality for finding apps
  - Detailed app information retrieval
  - App reviews and ratings collection
  - Version history tracking
  - Privacy details extraction
  - Similar apps discovery
  - Developer information gathering
- SQLite database integration with TypeORM
- Comprehensive data models:
  - Apps table with detailed app information
  - Images table for storing app icons and screenshots
  - Developers table for developer information
- Local image storage system in `data/images` directory
- TypeScript implementation for type safety
- ESLint and Prettier configuration for code quality

### Features
- Search for apps in the App Store
- Get detailed information about specific apps
- Download and store app icons and screenshots
- Store app reviews, ratings, and version history
- Track developer information
- Store all data in a SQLite database
- Support for multiple app collections and categories
- Country-specific data retrieval
- Language-specific results
- Caching capabilities for improved performance

### Technical Details
- Built on TypeScript for enhanced type safety
- Uses TypeORM for database operations
- Implements comprehensive error handling
- Includes data validation and normalization
- Supports batch operations for efficient data collection
- Includes logging and debugging capabilities

### Database Schema
- Apps table with fields for:
  - Basic information (title, description, price, etc.)
  - Ratings and reviews
  - Version information
  - Developer information
  - Metadata (first discovered, last updated, etc.)
- Images table for storing:
  - App icons
  - Screenshots
  - Download status
  - Local storage information
  - Error tracking
- Developers table containing:
  - Developer ID
  - Website
  - Country information

### Setup and Usage
- Simple installation process with npm
- Clear setup instructions
- Example usage patterns
- Comprehensive documentation
- Development guidelines