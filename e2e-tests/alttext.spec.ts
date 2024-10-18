import { test, expect } from '@playwright/test';
import { beforeTest } from './common';

const alttxt = {
  upsetIntroduction: 'This is an UpSet plot that visualizes set intersection. To learn about UpSet plots, visit https://upset.app.',
  datasetProperties: 'The dataset contains 6 sets and 44 elements, of which 6 sets are shown in the plot.',
  setProperties: 'The set sizes are diverging a lot, ranging from 3 to 18. The largest set is Male with 18 elements, followed by School with 6, Duff Fan with 6, Evil with 6, Power Plant with 5, and Blue Hair with 3.',
  intersectionProperties: 'The plot is sorted by size in ascending order. There are 12 non-empty intersections, all of which are shown in the plot. The largest 5 intersections are School, and Male (3), the empty intersection (3), Just Male (3), Duff Fan, Male, and Power Plant (3), and Evil, and Male (2).',
  statisticalInformation: 'The average intersection size is 2, and the median is 2. The 90th percentile is 3, and the 10th percentile is 1. The largest set, Male, is present in 75.0% of all non-empty intersections. The smallest set, Blue Hair, is present in 16.7% of all non-empty intersections.',
  trendAnalysis: 'The intersection sizes start from a value of 1 and then drastically rise up to 3. The empty intersection is present with a size of 3. An all set intersection is not present. The individual set intersections are large in size. The low degree set intersections lie in medium and largest sized intersections. The medium degree set intersections can be seen among small sized intersections. No high order intersections are present.',
};

test.beforeEach(beforeTest);

test('Alt Text', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  const altTextSidebar = await page.getByLabel('Alt Text and Plot Information Sidebar', { exact: true });
  await expect(altTextSidebar).toBeVisible();

  const altTextHeading = await page.getByRole('heading', { name: 'Text Description' });
  await expect(altTextHeading).toBeVisible();

  /// /////////////////
  // Error Handling
  /// /////////////////
  /// Aggregates
  await page.getByRole('radio', { name: 'Degree' }).check();
  const aggErrMsg = page.getByText("Alt text generation is not yet supported for aggregated plots. To generate an alt text, set aggregation to 'None' in the left sidebar.");
  await expect(aggErrMsg).toBeVisible();
  await page.getByRole('radio', { name: 'None' }).check();

  /// Attribute Sort
  await page.getByLabel('Age').locator('rect').dispatchEvent('click');
  const attrSortErrMsg = page.getByText('Alt text generation is not yet supported for attribute sorting. To generate an alt text, sort by Size, Degree, or Deviation.');
  await expect(attrSortErrMsg).toBeVisible();

  /// Set Sort
  await page.locator('p').filter({ hasText: /^Male$/ }).click();
  const setSortErrMsg = page.getByText('Alt text generation is not yet supported for set sorting. To generate an alt text, sort by Size, Degree, or Deviation.');
  await expect(setSortErrMsg).toBeVisible();

  // reset sorting to size
  await page.getByText('Size', { exact: true }).dispatchEvent('click');
  /// /////////////////
  // Plot Information
  /// /////////////////
  // Editing
  const editPlotInformationButton = await page.getByRole('button', { name: 'Add Plot Information' });
  await expect(editPlotInformationButton).toBeVisible();
  await editPlotInformationButton.click();

  const titleInput = await page.getByPlaceholder('Title');
  await expect(titleInput).toBeVisible();
  await expect(titleInput).toBeEditable();
  await titleInput.click();
  await titleInput.fill('upset plot');

  const captionInput = await page.getByPlaceholder('Caption');
  await expect(captionInput).toBeVisible();
  await expect(captionInput).toBeEditable();
  await captionInput.click();
  await captionInput.fill('upset plot caption');

  const datasetDescriptionInput = await page.getByPlaceholder('description of this dataset, eg: "movie genres and ratings');
  await expect(datasetDescriptionInput).toBeVisible();
  await expect(datasetDescriptionInput).toBeEditable();
  await datasetDescriptionInput.click();
  await datasetDescriptionInput.fill('Test dataset description');

  const setsInput = await page.getByPlaceholder('name for the sets in this data, eg: "movie genres');
  await expect(setsInput).toBeVisible();
  await expect(setsInput).toBeEditable();
  await setsInput.click();
  await setsInput.fill('Test sets value');

  const itemsInput = await page.getByPlaceholder('name for the items in this data, eg: "movies"');
  await expect(itemsInput).toBeVisible();
  await expect(itemsInput).toBeEditable();
  await itemsInput.click();
  await itemsInput.fill('Test items value');

  const plotInformationOutput = await page.getByText('This UpSet plot shows test');
  await expect(plotInformationOutput).toBeVisible();
  await expect(plotInformationOutput).toHaveText('This UpSet plot shows Test dataset description. The sets are Test sets value. The items are Test items value.');

  await expect(page.getByLabel('Alt Text and Plot Information Sidebar')).toContainText('This UpSet plot shows Test dataset description. The sets are Test sets value. The items are Test items value.');
  await page.getByRole('button', { name: 'Save' }).click();

  // Display
  await expect(page.getByLabel('Alt Text and Plot Information Sidebar')).toContainText('upset plot');
  await expect(page.getByLabel('Alt Text and Plot Information Sidebar')).toContainText('upset plot caption');
  await expect(page.getByLabel('Alt Text and Plot Information Sidebar')).toContainText('This UpSet plot shows Test dataset description. The sets are Test sets value. The items are Test items value.');

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

  /// /////////////////
  // User Description Test
  /// /////////////////
  // User short
  await page.getByRole('button', { name: 'Show Less' }).click();
  await page.getByLabel('Alt Text Description Editor').click();
  await page.getByText('This is an UpSet plot which').click();
  await page.getByText('This is an UpSet plot which').fill('This is an UpSet plot which shows set intersection of 6 sets out of 6 sets and the abcdefg largest intersection is School, and Male (3). The plot is sorted by size and 12 non-empty intersections are shown.');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByLabel('Alt Text and Plot Information Sidebar')).toContainText('This is an UpSet plot which shows set intersection of 6 sets out of 6 sets and the abcdefg largest intersection is School, and Male (3). The plot is sorted by size and 12 non-empty intersections are shown.');

  // User long, switching while editing
  await page.getByLabel('Alt Text Description Editor').click();
  await page.getByRole('button', { name: 'Show More' }).click();
  await page.getByText('# UpSet Introduction This is').click();
  await page.getByText('# UpSet Introduction This is').fill('# UpSet Introduction\nThis is an UpSet plot that visualizes set intersection. To learn about UpSet plots, visit https://upset.app.\n\n# Dataset Properties\nThe dataset contains 6 sets and 44 elements, of which 6 sets are shown in the plot.\n\n# Set Properties\nThe set sizes are diverging a lot, ranging from 3 to 18. The largest set is Male with 18 elements, followed by School with 6, Duff Fan with 6, Evil with 6, Power Plant with 5, and Blue Hair with 3.\n\n# Intersection Properties afdegb\nThe plot is sorted by size in ascending order. There are 12 non-empty intersections, all of which are shown in the plot. The largest 5 intersections are School, and Male (3), the empty intersection (3), Just Male (3), Duff Fan, Male, and Power Plant (3), and Evil, and Male (2).\n\n# Statistical Information\nThe average intersection size is 2, and the median is 2. The 90th percentile is 3, and the 10th percentile is 1. The largest set, Male, is present in 75.0% of all non-empty intersections. The smallest set, Blue Hair, is present in 16.7% of all non-empty intersections.\n\n# Trend Analysis\n The intersection sizes start from a value of 1 and then drastically rise up to 3. The empty intersection is present with a size of 3. An all set intersection is not present. The individual set intersections are large in size. The low degree set intersections lie in medium and largest sized intersections. The medium degree set intersections can be seen among small sized intersections. No high order intersections are present.\n\n');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('[id="Intersection\\ Properties\\ afdegb"]')).toContainText('Intersection Properties afdegb');

  // Resetting descriptions
  await page.getByLabel('Alt Text Description Editor').click();
  await page.getByRole('button', { name: 'Reset Descriptions' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('[id="Intersection\\ Properties"]')).toContainText('Intersection Properties');
  await page.getByRole('button', { name: 'Show Less' }).click();
  await expect(page.getByLabel('Alt Text and Plot Information Sidebar')).toContainText('This is an UpSet plot which shows set intersection of 6 sets out of 6 sets and the largest intersection is School, and Male (3). The plot is sorted by size and 12 non-empty intersections are shown.');
});
