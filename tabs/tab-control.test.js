import { expect, test } from '@playwright/test';

test.describe('<tab-control>', () => {

    test('tab display', async ({ page }) => {
        await page.goto('/');

        const tab1s = await page.locator('tab-window[name="tab-1"]').all()
        const tab2 = page.locator('tab-window[name="tab-2"]')

        // check initial states
        for (const tab of tab1s) {
            await expect(tab).toBeVisible();
            await expect(tab).toHaveJSProperty('open', true);
        }
        await expect(tab2).not.toBeVisible();
        await expect(tab2).not.toHaveJSProperty('open');

        // change tab
        await page.locator('input[value="tab-2"]').click();

        // check new states
        for (const tab of await page.locator('tab-window[name="tab-1"]').all()) {
            await expect(tab).not.toBeVisible();
            await expect(tab).not.toHaveJSProperty('open');
        }
        await expect(tab2).toBeVisible();
        await expect(tab2).toHaveJSProperty('open', true);
    })

})
