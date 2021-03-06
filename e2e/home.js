/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Search developers.google.com/web for articles tagged
 * "Headless Chrome" and scrape results from the results page.
 */

'use strict';

const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 800,
  });

  // await page.goto('http://hutcake.com');
  await page.goto('http://localhost:4200');

  // Type into search box.
  await page.type('.nav-menu-mid input', 'century');

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = 'typeahead-container a';
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  await page.waitFor(3000);

  await browser.close();
})();
