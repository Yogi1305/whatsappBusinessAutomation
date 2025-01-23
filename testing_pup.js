import puppeteer from 'puppeteer';
import NodeCache from 'node-cache';

class PuppeteerInstanceManager {
  constructor() {
    this.instances = new Map(); // sessionId -> { browser, page, createdAt }
    this.cache = new NodeCache({ stdTTL: 1800 }); // key -> sessionId with 30-minute TTL
  }

  async createOrGetInstance(key) {
    // Check if the key exists in the cache
    let sessionId = this.cache.get(key);

    if (sessionId && this.instances.has(sessionId)) {
      console.log(`Reusing existing session for key: ${key}, sessionId: ${sessionId}`);
      return this.instances.get(sessionId);
    }

    // Create a new session
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--remote-debugging-port=9222',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
        ],
      });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setDefaultTimeout(0);

    // Store the session in the map and cache
    this.instances.set(sessionId, { browser, page, createdAt: Date.now() });
    this.cache.set(key, sessionId);

    console.log(`Created new session for key: ${key}, sessionId: ${sessionId}`);
    return { browser, page };
  }

  getInstanceByKey(key) {
    const sessionId = this.cache.get(key);
    if (sessionId) {
      return this.instances.get(sessionId);
    }
    return null;
  }

  async removeInstanceByKey(key) {
    const sessionId = this.cache.get(key);
    if (sessionId) {
      await this.removeInstance(sessionId);
      this.cache.del(key);
    }
  }

  async removeInstance(sessionId) {
    const instance = this.instances.get(sessionId);
    if (instance) {
      const { browser } = instance;
      
      try {
        await browser.close();
      } catch (error) {
        console.error(`Error closing browser for session ${sessionId}:`, error);
      }
      this.instances.delete(sessionId);
    }
  }

  async shutdown() {
    console.log('Shutting down all instances...');
    for (const [sessionId, instance] of this.instances) {
      const { browser } = instance;
      try {
        await browser.close();
        console.log(`Browser for session ${sessionId} closed.`);
      } catch (error) {
        console.error(`Error closing browser for session ${sessionId}:`, error);
      }
    }
    this.instances.clear();
    this.cache.flushAll();
    console.log('All instances and cache cleared.');
  }

  async cleanupOldSessions(timeout = 30 * 60 * 1000) {
    const now = Date.now();

    for (const [sessionId, instance] of this.instances.entries()) {
      if (now - instance.createdAt > timeout) {
        console.log(`Cleaning up expired session: ${sessionId}`);
        await this.removeInstance(sessionId);
      }
    }
  }
}

export default PuppeteerInstanceManager;
