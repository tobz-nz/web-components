import { expect, test } from '@playwright/test';

const submitUrl = '/idempotency-submit'

// Capture the payload of every form submission
async function captureSubmissions(page)
{
    const submissions = []

    await page.route(`**${submitUrl}`, async route => {
        submissions.push(new URLSearchParams(route.request().postData() ?? ''))
        await route.fulfill({ contentType: 'text/html', body: '<h1>Submitted</h1>' })
    })

    return submissions
}

// Render a form containing <idempotency-key>, submit it and return the payload
async function submitForm(page, submissions, message = 'Hello')
{
    await page.goto('/')

    await page.evaluate(async submitUrl => {
        // index.html loads and defines the element
        await customElements.whenDefined('idempotency-key')

        document.body.innerHTML = `
            <form action="${submitUrl}" method="post">
                <input name="name" value="John Doe">
                <input name="email" value="john@example.com">
                <textarea name="message"></textarea>
                <idempotency-key></idempotency-key>
                <button type="submit">Submit</button>
            </form>
        `
    }, submitUrl)

    // typing fires the input event the hash is calculated on
    await page.fill('textarea[name="message"]', message)
    await expect(page.locator('idempotency-key')).toHaveAttribute('value', /^[0-9a-f]{64}$/)

    const count = submissions.length

    await page.click('button[type="submit"]')
    await expect.poll(() => submissions.length).toBe(count + 1)

    return submissions.at(-1)
}

test.describe('<idempotency-key>', () => {
    test('adds a hash of the form data to the payload on submit', async ({ page }) => {
        const submissions = await captureSubmissions(page)

        const payload = await submitForm(page, submissions)

        expect(payload.get('name')).toBe('John Doe')
        expect(payload.get('idempotency-key')).toMatch(/^[0-9a-f]{64}$/)
    });

    test('hash is the same for the same data and changes when the data changes', async ({ page }) => {
        const submissions = await captureSubmissions(page)

        const first = (await submitForm(page, submissions, 'Hello')).get('idempotency-key')
        const second = (await submitForm(page, submissions, 'Hello')).get('idempotency-key')
        const third = (await submitForm(page, submissions, 'Goodbye')).get('idempotency-key')

        expect(first).toMatch(/^[0-9a-f]{64}$/)
        expect(second).toBe(first)
        expect(third).not.toBe(first)
    });
});
