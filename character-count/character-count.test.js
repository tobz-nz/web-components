import { expect, test } from '@playwright/test';

test.describe('<character-count>', () => {

    test('display & update character count', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('[for="max-length-text"]')).toHaveText('10');
        await page.locator('#max-length-text').fill('Hello world');
        await expect(page.locator('#max-length-text')).toHaveValue('Hello worl');
        await expect(page.locator('[for="max-length-text"]')).toHaveText('0');

        await expect(page.locator('[for="no-maxlength-text"]')).toHaveText('0');
        await page.locator('#no-maxlength-text').fill('Hello');
        await expect(page.locator('[for="no-maxlength-text"]')).toHaveText('5');

        await expect(page.locator('[for="maxlength-negative-text"]')).toHaveText('10');
        await page.locator('#maxlength-negative-text').fill('Hello world');
        await expect(page.locator('[for="maxlength-negative-text"]')).toHaveText('-1');
    });

});
