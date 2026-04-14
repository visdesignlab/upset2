// @ts-check
import { ReflectionKind } from 'typedoc';
import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  app.renderer.on(
    MarkdownPageEvent.BEGIN,
    /** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
    (page) => {
      const model = page.model;

      // If the page is a module, set the title to the module name
      if (
        model &&
        'kind' in model &&
        'name' in model &&
        model.kind === ReflectionKind.Module
      ) {
        page.frontmatter = {
          title: model.name.replace("@visdesignlab/", ""),
          ...page.frontmatter,
        };
      }
    },
  );
}
