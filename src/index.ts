import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { AppStoreService } from './services/AppStoreService';
import { App } from './entities/App';
import { Developer } from './entities/Developer';
import { Image } from './entities/Image';

async function main(): Promise<void> {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    const appStoreService = new AppStoreService(
      AppDataSource.getRepository(App),
      AppDataSource.getRepository(Developer),
      AppDataSource.getRepository(Image)
    );

    // Check if --suggestions flag is present
    const args = process.argv.slice(2);
    if (args.includes('--suggestions')) {
      // Get search term from args or use default
      const searchTerm = args[args.indexOf('--suggestions') + 1] || 'twit';
      console.log(`Getting search suggestions for "${searchTerm}"...`);
      const suggestions = await appStoreService.getSuggestions(searchTerm);
      console.log('Search suggestions:', suggestions);
    } else {
      // Original functionality
      // Example: Search for apps
      console.log('Searching for apps...');
      const searchResults = await appStoreService.searchApps('twitter');
      console.log(`Found ${searchResults.length} apps`);

      // Example: Get details for a specific app
      if (searchResults.length > 0) {
        const appId = searchResults[0].id.toString();
        console.log(`Getting details for app ${appId}...`);
        const appDetails = await appStoreService.getAppDetails(appId);

        if (appDetails) {
          console.log(`App details retrieved: ${appDetails.title}`);

          // Get additional data
          console.log('Getting reviews...');
          await appStoreService.getAppReviews(appId);

          console.log('Getting ratings...');
          await appStoreService.getAppRatings(appId);

          console.log('Getting version history...');
          await appStoreService.getVersionHistory(appId);

          console.log('Getting privacy details...');
          await appStoreService.getPrivacyDetails(appId);

          // Get similar apps
          console.log('Getting similar apps...');
          const similarApps = await appStoreService.getSimilarApps(appId);
          console.log(`Found ${similarApps.length} similar apps`);
        } else {
          console.log(`Skipping additional data retrieval for app ${appId} as it was not found`);
        }
      }

      // Example: List top free apps
      console.log('Getting top free apps...');
      const topFreeApps = await appStoreService.listApps({
        collection: 'topfreemacapps',
        num: 10,
      });
      console.log(`Found ${topFreeApps.length} top free apps`);

      // Example: Get search suggestions
      console.log('Getting search suggestions...');
      const suggestions = await appStoreService.getSuggestions('twit');
      console.log('Search suggestions:', suggestions);
    }

    console.log('All operations completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close database connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

main();
