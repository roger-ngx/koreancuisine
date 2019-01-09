/**
 * Created by thanhnt on 8/5/2017.
 */
import { Injectable } from '@angular/core';
import { Platform }   from 'ionic-angular';
import ImgCache       from 'imgcache.js';

/**
 * This service is charged of provide the methods to cache the images
 * https://medium.com/ninjadevs/caching-images-ionic-ccf2f4ca8d1f
 */
@Injectable()
export class ImgcacheService {

  public imgQueue: string[] = [];

  constructor(platform: Platform) {
    ImgCache.options.debug = true;
    ImgCache.options.skipURIencoding = true;
  }

  /**
   * Init imgCache library
   * @return {Promise}
   */
  public initImgCache(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (ImgCache.ready) {
        resolve();
      } else {
        ImgCache.init(() => resolve(), () => reject());
      }
    });
  }

  /**
   * Cache images
   * @param src {string} - img source
   */
  public cacheImg(src: string): Promise<any> {
    if(src == "./assets/img/food.png")
      return new Promise((resolve, reject) => resolve(src));

    return new Promise((resolve, reject) => {
      ImgCache.isCached(src, (path: string, success: boolean) => {
        // if not, it will be cached
        if (success) {
          console.log("cached, load url");

          ImgCache.getCachedFileURL(src,
            (originalUrl, cacheUrl) => {
              resolve(cacheUrl);
            },
            (e) => {
              reject(e)
            });
        } else {
          // cache img
          console.log("caching");

          ImgCache.cacheFile(src);
          // return original img URL
          resolve(src);
        }
      });
    });
  }
}
