/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';
import mockData from '../playwright/mock-data/simpsons/simpsons_data.json';
import mockAnnotations from '../playwright/mock-data/simpsons/simpsons_annotations.json';
import mockAltText from '../playwright/mock-data/simpsons/simpsons_alttxt.json';

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/**', async (route) => {
    const url = route.request().url();
    let json;

    if (url) {
      if (url.includes('workspaces/Upset%20Examples/tables/simpsons/rows/?limit=9007199254740991')) {
        json = mockData;
        await route.fulfill({ json });
      } else if (url.includes('workspaces/Upset%20Examples/tables/simpsons/annotations/')) {
        json = mockAnnotations;
        await route.fulfill({ json });
      } else if (url.includes('alttxt')) {
        json = mockAltText;
        await route.fulfill({ json });
      } else if (url.includes('workspaces/Upset%20Examples/sessions/table/193/state/')) {
        await route.fulfill({ status: 200 });
      } else {
        await route.continue();
      }
    } else {
      await route.abort();
    }
  });
});

test('Alt Text', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  const altTextSidebarButton = page.getByLabel('Open alt text sidebar');
  await altTextSidebarButton.click();

  const altTextSidebar = page.getByLabel('Alt Text Sidebar', { exact: true });
  await expect(altTextSidebar).toBeVisible();

  const altTextHeading = page.getByRole('heading', { name: 'Alt Text' });
  await expect(altTextHeading).toBeVisible();

  /// /////////////////
  // Plot Information
  /// /////////////////
  const plotInformation = page.getByRole('button', { name: 'Plot Information' });
  await expect(plotInformation).toBeVisible();
  await plotInformation.click();

  const editPlotInformationButton = page.getByLabel('Toggle editable descriptions');
  await expect(editPlotInformationButton).toBeVisible();
  await editPlotInformationButton.click();

  const datasetDescriptionInput = page.getByPlaceholder('eg: movie genres and ratings');
  await expect(datasetDescriptionInput).toBeVisible();
  await expect(datasetDescriptionInput).toBeEditable();
  await datasetDescriptionInput.click();
  await datasetDescriptionInput.fill('Test dataset description');

  const setsInput = page.getByPlaceholder('eg: movie genres (dataset');
  await expect(setsInput).toBeVisible();
  await expect(setsInput).toBeEditable();
  await setsInput.click();
  await setsInput.fill('Test sets value');

  const itemsInput = page.getByPlaceholder('eg: movies (dataset rows)');
  await expect(itemsInput).toBeVisible();
  await expect(itemsInput).toBeEditable();
  await itemsInput.click();
  await itemsInput.fill('Test items value');

  const plotInformationOutput = page.getByText('This UpSet plot shows test');
  await expect(plotInformationOutput).toBeVisible();
  await expect(plotInformationOutput).toHaveText('This UpSet plot shows Test dataset description. The sets are Test sets value. The items are Test items value.');

  await page.getByRole('button', { name: 'Save' }).click();
  await plotInformation.click();

  /// /////////////////
  // Alt Text Output
  /// /////////////////
  const UpSetIntroduction = {
    heading: page.getByRole('heading', { name: 'UpSet Introduction' }),
    content: page.getByText('This is an UpSet plot that'),
  };
  await expect(UpSetIntroduction.heading).toBeVisible();
  await expect(UpSetIntroduction.content).toBeVisible();
  await expect(UpSetIntroduction.content).toHaveText('This is an UpSet plot that visualizes set intersection. To learn about UpSet plots, visit https://upset.app.');

  const datasetProperties = {
    heading: page.getByRole('heading', { name: 'Dataset Properties' }),
    content: page.getByText('The dataset contains 6 sets'),
  };

  await expect(datasetProperties.heading).toBeVisible();
  await expect(datasetProperties.content).toBeVisible();
  await expect(datasetProperties.content).toHaveText('The dataset contains 6 sets, and 44 elements, of which 6 are shown in the plot.');

  const setProperties = {
    heading: page.getByRole('heading', { name: 'Set Properties', exact: true }),
    content: page.getByText('The largest set is Male with'),
  };
  await expect(setProperties.heading).toBeVisible();
  await expect(setProperties.content).toBeVisible();
  await expect(setProperties.content).toHaveText('The largest set is Male with 18 elements, followed by School with 6, Duff Fan with 6, Evil with 6, Power Plant with 5, and Blue Hair with 3.');

  const intersectionProperties = {
    heading: page.getByRole('heading', { name: 'Intersection Properties' }),
    content: page.getByText('The plot is sorted by size.'),
  };
  await expect(intersectionProperties.heading).toBeVisible();
  await expect(intersectionProperties.content).toBeVisible();
  await expect(intersectionProperties.content).toHaveText('The plot is sorted by size. There are 12 non-empty intersections, all of which are shown in the plot. The largest 5 intersections are School Male (3), the empty intersection (3), Just Male (3), Duff_Fan Male Power_Plant (3), and Evil Male (2).');

  const statisticalInformation = {
    heading: page.getByRole('heading', { name: 'Statistical Information' }),
    content: page.getByText('The average intersection size'),
  };
  await expect(statisticalInformation.heading).toBeVisible();
  await expect(statisticalInformation.content).toBeVisible();
  await expect(statisticalInformation.content).toHaveText('The average intersection size is 2, and the median is 2. The 90th percentile is 3, and the 10th percentile is 1. The largest set, Male, is present in 75.0% of all non-empty intersections. The smallest set, Blue Hair, is present in 0.0% of all non-empty intersections.');
});
