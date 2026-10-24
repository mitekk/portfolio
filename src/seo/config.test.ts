import {
  SITE_URL,
  breadcrumbStructuredData,
  profilePageStructuredData,
  routeSeo,
} from "./config";

describe("profilePageStructuredData", () => {
  test("describes the route and points at the shared person node", () => {
    const schema = profilePageStructuredData(routeSeo.about);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema["@id"]).toBe(`${routeSeo.about.canonical}#page`);
    expect(schema.url).toBe(routeSeo.about.canonical);
    expect(schema.name).toBe(routeSeo.about.title);
    expect(schema.description).toBe(routeSeo.about.description);
    expect(schema.isPartOf).toEqual({ "@id": `${SITE_URL}/#website` });
    // The whole point of the shared @id: three pages enrich one person entity
    // rather than minting three competing ones.
    expect(schema.mainEntity).toEqual({ "@id": `${SITE_URL}/#person` });
  });

  test("merges extra claims onto the referenced person", () => {
    const schema = profilePageStructuredData(routeSeo.experience, {
      worksFor: [{ "@type": "OrganizationRole" }],
    });

    expect(schema.mainEntity).toEqual({
      "@id": `${SITE_URL}/#person`,
      worksFor: [{ "@type": "OrganizationRole" }],
    });
  });
});

describe("breadcrumbStructuredData", () => {
  test("walks from the home page to the route", () => {
    const schema = breadcrumbStructuredData(routeSeo.toolbox);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Toolbox",
        item: routeSeo.toolbox.canonical,
      },
    ]);
  });

  // Not the title: "About Mitya Kurs | Senior Full-Stack Developer" is a search
  // result heading, not a crumb. The last path segment is what the nav calls it.
  test("names the crumb from the last path segment", () => {
    expect(
      breadcrumbStructuredData(routeSeo.about).itemListElement[1],
    ).toMatchObject({ name: "About" });
    expect(
      breadcrumbStructuredData(routeSeo.experience).itemListElement[1],
    ).toMatchObject({ name: "Experience" });
  });

  // /theBuzz 301s to /theBuzz/about, so a crumb for it would point at a redirect.
  test("skips the theBuzz segment", () => {
    const names = breadcrumbStructuredData(routeSeo.about).itemListElement.map(
      (item) => item.name,
    );
    expect(names).toEqual(["Home", "About"]);
  });
});
