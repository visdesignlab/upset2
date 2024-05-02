/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';
import mockData from '../playwright/mock-data/simpsons/simpsons_data.json';
import mockAnnotations from '../playwright/mock-data/simpsons/simpsons_annotations.json';
import mockAltText from '../playwright/mock-data/simpsons/simpsons_alttxt.json';

const alttxt = {
  upsetIntroduction: 'This is an UpSet plot that visualizes set intersection. To learn about UpSet plots, visit https://upset.app.',
  datasetProperties: 'The dataset contains 6 sets and 44 elements, of which 6 sets are shown in the plot.',
  setProperties: 'The set sizes are diverging a lot, ranging from 3 to 18. The largest set is Male with 18 elements, followed by School with 6, Duff Fan with 6, Evil with 6, Power Plant with 5, and Blue Hair with 3.',
  intersectionProperties: 'The plot is sorted by size in ascending order. There are 12 non-empty intersections, all of which are shown in the plot. The largest 5 intersections are School, and Male (3), the empty intersection (3), Just Male (3), Duff Fan, Male, and Power Plant (3), and Evil, and Male (2).',
  statisticalInformation: 'The average intersection size is 2, and the median is 2. The 90th percentile is 3, and the 10th percentile is 1. The largest set, Male, is present in 75.0% of all non-empty intersections. The smallest set, Blue Hair, is present in 16.7% of all non-empty intersections.',
  trendAnalysis: 'The intersection sizes start from a value of 1 and then drastically rise up to 3. The empty intersection is present with a size of 3. An all set intersection is not present. The individual set intersections are large in size. The low degree set intersections lie in medium and largest sized intersections. The medium degree set intersections can be seen among small sized intersections. No high order intersections are present.',
};

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

  const altTextSidebarButton = await page.getByLabel('Open alt text sidebar');
  await expect(altTextSidebarButton).toBeVisible();
  await altTextSidebarButton.click();

  const altTextSidebar = await page.getByLabel('Alt Text Sidebar', { exact: true });
  await expect(altTextSidebar).toBeVisible();

  const altTextHeading = await page.getByRole('heading', { name: 'Alt Text' });
  await expect(altTextHeading).toBeVisible();

  /// /////////////////
  // Error Handling
  /// /////////////////
  /// Aggregates
  await page.getByRole('radio', { name: 'Degree' }).check();
  const aggErrMsg = await page.getByText("Alt text generation is not yet supported for aggregated plots. To generate an alt text, set aggregation to 'None' in the left sidebar.");
  await expect(aggErrMsg).toBeVisible();
  await page.getByRole('radio', { name: 'None' }).check();

  /// Attribute Sort
  await page.getByLabel('Age').locator('rect').dispatchEvent('click');
  const attrSortErrMsg = await page.getByText('Alt text generation is not yet supported for attribute sorting. To generate an alt text, sort by Size, Degree, or Deviation.');
  await expect(attrSortErrMsg).toBeVisible();
  await page.getByText('Size', { exact: true }).dispatchEvent('click');

  /// /////////////////
  // Plot Information
  /// /////////////////
  const plotInformation = await page.getByRole('button', { name: 'Plot Information' });
  await expect(plotInformation).toBeVisible();
  await plotInformation.click();

  const editPlotInformationButton = await page.getByLabel('Toggle editable descriptions');
  await expect(editPlotInformationButton).toBeVisible();
  await editPlotInformationButton.click();

  const datasetDescriptionInput = await page.getByPlaceholder('eg: movie genres and ratings');
  await expect(datasetDescriptionInput).toBeVisible();
  await expect(datasetDescriptionInput).toBeEditable();
  await datasetDescriptionInput.click();
  await datasetDescriptionInput.fill('Test dataset description');

  const setsInput = await page.getByPlaceholder('eg: movie genres (dataset');
  await expect(setsInput).toBeVisible();
  await expect(setsInput).toBeEditable();
  await setsInput.click();
  await setsInput.fill('Test sets value');

  const itemsInput = await page.getByPlaceholder('eg: movies (dataset rows)');
  await expect(itemsInput).toBeVisible();
  await expect(itemsInput).toBeEditable();
  await itemsInput.click();
  await itemsInput.fill('Test items value');

  const plotInformationOutput = await page.getByText('This UpSet plot shows test');
  await expect(plotInformationOutput).toBeVisible();
  await expect(plotInformationOutput).toHaveText('This UpSet plot shows Test dataset description. The sets are Test sets value. The items are Test items value.');

  await page.getByRole('button', { name: 'Save' }).click();
  await plotInformation.click();

  /// /////////////////
  // Short Description
  /// /////////////////
  await expect(page.getByText('This is an UpSet plot'))
    .toContainText('This is an UpSet plot which shows set intersection of 6 sets out of 6 sets and the largest intersection is School, and Male (3). The plot is sorted by size and 12 non-empty intersections are shown.');
  await page.getByRole('button', { name: 'Show More' }).click();
  await page.getByRole('button', { name: 'Show Less' }).click();
  await expect(page.getByText('This is an UpSet plot which')).toBeVisible();
  await page.getByRole('button', { name: 'Show More' }).click();

  /// /////////////////
  // Alt Text Output
  /// /////////////////
  const UpSetIntroduction = {
    heading: await page.getByRole('heading', { name: 'UpSet Introduction' }),
    content: await page.getByText('This is an UpSet plot that'),
  };
  await expect(UpSetIntroduction.heading).toBeVisible();
  await expect(UpSetIntroduction.content).toBeVisible();
  await expect(UpSetIntroduction.content).toHaveText(alttxt.upsetIntroduction);

  const datasetProperties = {
    heading: await page.getByRole('heading', { name: 'Dataset Properties' }),
    content: await page.getByText('The dataset contains 6 sets'),
  };

  await expect(datasetProperties.heading).toBeVisible();
  await expect(datasetProperties.content).toBeVisible();
  await expect(datasetProperties.content).toHaveText(alttxt.datasetProperties);

  const setProperties = {
    heading: await page.getByRole('heading', { name: 'Set Properties', exact: true }),
    content: await page.getByText('The largest set is Male with'),
  };
  await expect(setProperties.heading).toBeVisible();
  await expect(setProperties.content).toBeVisible();
  await expect(setProperties.content).toHaveText(alttxt.setProperties);

  const intersectionProperties = {
    heading: await page.getByRole('heading', { name: 'Intersection Properties' }),
    content: await page.getByText('The plot is sorted by size in'),
  };
  await expect(intersectionProperties.heading).toBeVisible();
  await expect(intersectionProperties.content).toBeVisible();
  await expect(intersectionProperties.content).toHaveText(alttxt.intersectionProperties);

  const statisticalInformation = {
    heading: await page.getByRole('heading', { name: 'Statistical Information' }),
    content: await page.getByText('The average intersection size'),
  };
  await expect(statisticalInformation.heading).toBeVisible();
  await expect(statisticalInformation.content).toBeVisible();
  await expect(statisticalInformation.content).toHaveText(alttxt.statisticalInformation);

  const trendAnalysis = {
    heading: await page.getByRole('heading', { name: 'Trend Analysis' }),
    content: await page.getByText('The intersection sizes start'),
  };
  await expect(trendAnalysis.heading).toBeVisible();
  await expect(trendAnalysis.content).toBeVisible();
  await expect(trendAnalysis.content).toHaveText(alttxt.trendAnalysis);
});
