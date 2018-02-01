import * as webdriver from 'selenium-webdriver';
import * as chromeDriver from 'selenium-webdriver/chrome';
import { Key } from 'selenium-webdriver';

const { By, until } = webdriver;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Use async/await instead of built in promise manager.
webdriver.promise.USE_PROMISE_MANAGER = false;

// Headless is supported in Chrome >= 58. Not currently stable, so using dev
// build.
const CHROME_BIN_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const options = new chromeDriver.Options();
options.setChromeBinaryPath(CHROME_BIN_PATH);
options.addArguments(
    //'headless',
    // Use --disable-gpu to avoid an error from a missing Mesa library, as per
    // https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
    'disable-gpu',
);

const main = async () => {
    const driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    // Navigate to Hayneedle Stage environment
    await driver.get('https://stage.hayneedle.local');

    // Search for a specific product
    await driver.findElement(By.name('Ntt')).sendKeys('cwr116', Key.RETURN);
    await driver.wait(until.titleIs('Coral Coast Paradise Cove Retro 4 pc. Metal Conversation Set | Hayneedle'), 1000);

    // Select the first available option
    await driver.findElement(By.className('pdp-option-select')).click();
    await driver.findElement(By.className('option-value-container first')).click();

    // Double-click Add to Cart button
    var addToCartButton = await driver.findElement(By.className('atc-btn btn-action ct-add-to-cart'));
    await driver.wait(until.elementIsVisible(addToCartButton));
    addToCartButton.click();
    addToCartButton.click();

    // Wait for Cart Modal to load and then click Checkout
    await sleep(3000);
    var checkoutButton = await driver.findElement(By.className('checkout-button'));
    checkoutButton.click();

    // await driver.quit();
};

main();
