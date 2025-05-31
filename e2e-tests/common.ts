import { Page } from '@playwright/test';
import mockData from '../playwright/mock-data/simpsons/simpsons_data.json' assert { type: 'json' };
import mockAnnotations from '../playwright/mock-data/simpsons/simpsons_annotations.json' assert { type: 'json' };
import mockAltText from '../playwright/mock-data/simpsons/simpsons_alttxt.json' assert { type: 'json' };

export const alttxt = {
  upsetIntroduction:
    'This is an UpSet plot that visualizes set intersection. To learn about UpSet plots, visit https://upset.app.',
  datasetProperties: 'The dataset contains 6 sets and 44 elements, of which 6 sets are shown in the plot.',
  setProperties:
    'The set sizes are diverging a lot, ranging from 3 to 18. The largest set is Male with 18 elements, followed by School with 6, Duff Fan with 6, Evil with 6, Power Plant with 5, and Blue Hair with 3.',
  intersectionProperties:
    'The plot is sorted by size in ascending order. There are 12 non-empty intersections, all of which are shown in the plot. The largest 5 intersections are School, and Male (3), the empty intersection (3), Just Male (3), Duff Fan, Male, and Power Plant (3), and Evil, and Male (2).',
  statisticalInformation:
    'The average intersection size is 2, and the median is 2. The 90th percentile is 3, and the 10th percentile is 1. The largest set, Male, is present in 75.0% of all non-empty intersections. The smallest set, Blue Hair, is present in 16.7% of all non-empty intersections.',
  trendAnalysis:
    'The intersection sizes start from a value of 1 and then drastically rise up to 3. The empty intersection is present with a size of 3. An all set intersection is not present. The individual set intersections are large in size. The low degree set intersections lie in medium and largest sized intersections. The medium degree set intersections can be seen among small sized intersections. No high order intersections are present.',
};

/**
 * To be run before every Playwright test
 * @param param0 Page object provided by Playwright
 */
export async function beforeTest({ page }: { page: Page }) {
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
      } else if (url.includes('workspaces/Upset%20Examples/sessions/table/193/')) {
        await route.fulfill({ status: 200 });
      } else if (url.includes('workspaces/Upset%20Examples/permissions/me')) {
        // User has owner permissions, this will allow plot information editing
        await route.fulfill({ status: 200, json: { permission_label: 'owner' } });
      } else {
        await route.continue();
      }
    } else {
      await route.abort();
    }
  });
}
