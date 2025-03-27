import { Repository } from 'typeorm';
import { App } from '../entities/App';
import { Developer } from '../entities/Developer';
import { Image, ImageType, DownloadStatus } from '../entities/Image';
import appStoreScraper from '../../../app-store-scraper/dist/index.js';

interface AppStoreApp {
  id: number;
  appId: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  genres: string[];
  genreIds: string[];
  primaryGenre: string;
  primaryGenreId: number;
  contentRating: string;
  languages: string[];
  size: string;
  requiredOsVersion: string;
  released: string;
  updated: string;
  releaseNotes?: string;
  version: string;
  price: number;
  currency: string;
  free: boolean;
  developerId: number;
  developer: string;
  developerUrl: string;
  developerWebsite?: string;
  score: number;
  reviews: number;
  currentVersionScore?: number;
  currentVersionReviews?: number;
  screenshots: string[];
  ipadScreenshots: string[];
  appletvScreenshots: string[];
  supportedDevices: string[];
}

interface Review {
  id: string;
  userName: string;
  userUrl: string;
  version: string;
  score: number;
  title: string;
  text: string;
  url: string;
  updated: string;
}

export class AppStoreService {
  constructor(
    private readonly appRepository: Repository<App>,
    private readonly developerRepository: Repository<Developer>,
    private readonly imageRepository: Repository<Image>
  ) {}

  async searchApps(query: string, country: string = 'us'): Promise<App[]> {
    const results = await appStoreScraper.search({
      term: query,
      country: country,
    });
    return Promise.all(results.map((result) => this.saveApp(result as unknown as AppStoreApp)));
  }

  async getAppDetails(appId: string, country: string = 'us'): Promise<App | null> {
    try {
      const result = await appStoreScraper.app({
        appId: appId,
        country: country,
      });
      return this.saveApp(result as unknown as AppStoreApp);
    } catch (error) {
      if (error instanceof Error && error.message.includes('App not found')) {
        console.log(`App ${appId} not found in App Store`);
        return null;
      }
      throw error;
    }
  }

  async getDeveloperApps(developerId: string, country: string = 'us'): Promise<App[]> {
    const results = await appStoreScraper.developer({
      devId: parseInt(developerId),
      country: country,
    });
    return Promise.all(results.map((result) => this.saveApp(result as unknown as AppStoreApp)));
  }

  async getSimilarApps(appId: string, country: string = 'us'): Promise<App[]> {
    const results = await appStoreScraper.similar({
      appId: appId,
      country: country,
    });

    return Promise.all(results.map((result) => this.saveApp(result as unknown as AppStoreApp)));
  }

  async getAppReviews(appId: string, country: string = 'us'): Promise<void> {
    const results = await appStoreScraper.reviews({
      appId: appId,
      country: country,
      sort: appStoreScraper.sort.RECENT,
      page: 1,
    });

    const app = await this.appRepository.findOne({ where: { id: parseInt(appId) } });
    if (app && Array.isArray(results)) {
      app.reviews = results
        .map((review: Review) => ({
          id: review.id,
          userName: review.userName,
          text: review.text,
          score: review.score,
          version: review.version,
          updated: review.updated,
        }))
        .slice(0, 1); // Only keep the latest review
      await this.appRepository.save(app);
    }
  }

  async getAppRatings(appId: string, country: string = 'us'): Promise<void> {
    const ratings = await appStoreScraper.ratings({
      id: parseInt(appId),
      country: country,
    });

    const app = await this.appRepository.findOne({ where: { id: parseInt(appId) } });
    if (app) {
      app.histogram = ratings.histogram;
      await this.appRepository.save(app);
    }
  }

  async getVersionHistory(appId: string, country: string = 'us'): Promise<void> {
    const history = await appStoreScraper.versionHistory({
      id: parseInt(appId),
      country: country,
    });

    const app = await this.appRepository.findOne({ where: { id: parseInt(appId) } });
    if (app && history.length > 0 && typeof history[0] === 'object' && 'version' in history[0]) {
      app.version = String(history[0].version);
      await this.appRepository.save(app);
    }
  }

  async listApps(options: {
    collection?: string;
    category?: number;
    country?: string;
    num?: number;
  }): Promise<App[]> {
    const results = await appStoreScraper.list({
      collection: options.collection,
      category: options.category,
      country: options.country || 'us',
      num: options.num || 200,
    });

    return Promise.all(results.map((result) => this.saveApp(result as unknown as AppStoreApp)));
  }

  async getPrivacyDetails(appId: string, country: string = 'us'): Promise<void> {
    const privacy = await appStoreScraper.privacy({
      id: parseInt(appId),
      country: country,
    });

    const app = await this.appRepository.findOne({ where: { id: parseInt(appId) } });
    if (app) {
      // Store privacy information in the app's description or a new field if needed
      app.description = `${app.description}\n\nPrivacy Information:\n${JSON.stringify(privacy, null, 2)}`;
      await this.appRepository.save(app);
    }
  }

  async getSuggestions(term: string, country: string = 'us'): Promise<string[]> {
    const results = await appStoreScraper.suggest({
      term: term,
      country: country,
    });

    // Log the raw results to see the structure
    console.log('Raw suggestion results:', JSON.stringify(results, null, 2));

    // Handle both string and object results
    return results
      .map((result) => {
        if (typeof result === 'string') {
          return result;
        }
        if (typeof result === 'object' && result !== null) {
          return (result as { term: string }).term || '';
        }
        return '';
      })
      .filter((suggestion) => suggestion !== '');
  }

  private async saveApp(result: AppStoreApp): Promise<App> {
    let app = await this.appRepository.findOne({
      where: { url: result.url },
      relations: ['developer_entity'],
    });

    if (!app) {
      app = new App();
      app.url = result.url;
      app.first_discovered = new Date();
      app.last_updated = new Date();
      app.needs_enrichment = true;
    }

    app.title = result.title;
    app.description = result.description;
    app.score = result.score;
    app.content_rating = result.contentRating;
    app.icon = result.icon;
    app.currency = result.currency;
    app.current_version_reviews = result.currentVersionReviews || 0;
    app.current_version_score = result.currentVersionScore || 0;
    app.developer = result.developer;
    app.developer_id = result.developerId?.toString() || '';
    app.developer_url = result.developerUrl || '';
    app.rating_count = result.reviews || 0;
    app.free = result.free;
    app.genre_ids = result.genreIds || [];
    app.genres = result.genres || [];
    app.languages = result.languages || [];
    app.price = result.price || 0;
    app.primary_genre = result.primaryGenre || '';
    app.primary_genre_id = result.primaryGenreId?.toString() || '';
    app.released = result.released || '';
    app.required_os_version = result.requiredOsVersion || '';
    app.size = result.size || '';
    app.supported_models = result.supportedDevices || [];
    app.updated = result.updated || '';
    app.version = result.version || '';
    app.last_updated = new Date();

    // Save or update developer
    if (result.developerId) {
      let developer = await this.developerRepository.findOne({
        where: { developer_id: result.developerId.toString() },
      });

      if (!developer) {
        developer = new Developer();
        developer.developer_id = result.developerId.toString();
      }

      developer.name = result.developer || '';
      developer.website = result.developerUrl || '';
      developer = await this.developerRepository.save(developer);
      app.developer_entity = developer;
    }

    app = await this.appRepository.save(app);

    // Save screenshots
    const screenshots = [
      ...(result.screenshots || []).map((url: string) => ({ url, type: ImageType.SCREENSHOT })),
      ...(result.ipadScreenshots || []).map((url: string) => ({
        url,
        type: ImageType.IPAD_SCREENSHOT,
      })),
      ...(result.appletvScreenshots || []).map((url: string) => ({
        url,
        type: ImageType.TV_SCREENSHOT,
      })),
    ];

    if (screenshots.length > 0) {
      for (const screenshot of screenshots) {
        let image = await this.imageRepository.findOne({
          where: { app_id: app.id, original_url: screenshot.url },
        });

        if (!image) {
          image = new Image();
          image.app_id = app.id;
          image.original_url = screenshot.url;
          image.image_type = screenshot.type;
          image.local_path = `images/${app.id}/${screenshot.type}/${screenshot.url.split('/').pop()}`;
          image.download_status = DownloadStatus.PENDING;
        }

        try {
          // Here you would implement the actual image download logic
          image.download_status = DownloadStatus.COMPLETED;
          image.download_date = new Date();
        } catch (error: unknown) {
          if (error instanceof Error) {
            image.error_message = error.message;
          } else {
            image.error_message = 'Unknown error occurred';
          }
          image.download_status = DownloadStatus.FAILED;
        }

        await this.imageRepository.save(image);
      }
    }

    return app;
  }
}
