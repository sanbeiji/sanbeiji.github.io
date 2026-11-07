// Lightweight Holiday Theme Scheduler & Dynamic Loader for sanbeiji.com
// Zero dependencies, zero extra assets loaded on normal non-holiday days.
// Precomputed schedule embedded for 0ms synchronous evaluation (zero flash of bass clef).
// Supports ?theme=<id> and ?date=<YYYY-MM-DD[THH:mm:ss]> overrides.

(function () {
  const VALID_THEMES = new Set([
    'mlk-day',
    'lunar-new-year',
    'lantern-festival',
    'pi-day',
    'may-fourth',
    'dragon-boat',
    'juneteenth',
    'fourth-of-july',
    'ghost-festival',
    'mid-autumn',
    'double-tenth',
    'halloween',
    'thanksgiving',
    'birthday',
    'winter-solstice',
    'christmas',
    'new-years'
  ]);

  const EMBEDDED_SCHEDULE = {"2025":[{"end":"2025-01-21T12:00:00","id":"mlk-day","start":"2025-01-19T00:00:00"},{"end":"2025-02-03T12:00:00","id":"lunar-new-year","start":"2025-01-27T00:00:00"},{"end":"2025-02-13T12:00:00","id":"lantern-festival","start":"2025-02-11T00:00:00"},{"end":"2025-03-15T12:00:00","id":"pi-day","start":"2025-03-13T00:00:00"},{"end":"2025-05-05T12:00:00","id":"may-fourth","start":"2025-05-03T00:00:00"},{"end":"2025-06-01T12:00:00","id":"dragon-boat","start":"2025-05-30T00:00:00"},{"end":"2025-06-20T12:00:00","id":"juneteenth","start":"2025-06-18T00:00:00"},{"end":"2025-07-05T12:00:00","id":"fourth-of-july","start":"2025-07-03T00:00:00"},{"end":"2025-09-07T12:00:00","id":"ghost-festival","start":"2025-09-05T00:00:00"},{"end":"2025-10-07T12:00:00","id":"mid-autumn","start":"2025-10-05T00:00:00"},{"end":"2025-10-11T12:00:00","id":"double-tenth","start":"2025-10-09T00:00:00"},{"end":"2025-11-01T12:00:00","id":"halloween","start":"2025-10-30T00:00:00"},{"end":"2025-12-01T12:00:00","id":"thanksgiving","start":"2025-11-26T00:00:00"},{"end":"2025-12-12T12:00:00","id":"birthday","start":"2025-12-10T00:00:00"},{"end":"2025-12-22T12:00:00","id":"winter-solstice","start":"2025-12-20T00:00:00"},{"end":"2025-12-26T12:00:00","id":"christmas","start":"2025-12-23T00:00:00"},{"end":"2026-01-02T12:00:00","id":"new-years","start":"2025-12-30T00:00:00"}],"2026":[{"end":"2026-01-20T12:00:00","id":"mlk-day","start":"2026-01-18T00:00:00"},{"end":"2026-02-22T12:00:00","id":"lunar-new-year","start":"2026-02-15T00:00:00"},{"end":"2026-03-04T12:00:00","id":"lantern-festival","start":"2026-03-02T00:00:00"},{"end":"2026-03-15T12:00:00","id":"pi-day","start":"2026-03-13T00:00:00"},{"end":"2026-05-05T12:00:00","id":"may-fourth","start":"2026-05-03T00:00:00"},{"end":"2026-06-20T12:00:00","id":"dragon-boat","start":"2026-06-18T00:00:00"},{"end":"2026-06-20T12:00:00","id":"juneteenth","start":"2026-06-18T00:00:00"},{"end":"2026-07-05T12:00:00","id":"fourth-of-july","start":"2026-07-03T00:00:00"},{"end":"2026-08-28T12:00:00","id":"ghost-festival","start":"2026-08-26T00:00:00"},{"end":"2026-09-26T12:00:00","id":"mid-autumn","start":"2026-09-24T00:00:00"},{"end":"2026-10-11T12:00:00","id":"double-tenth","start":"2026-10-09T00:00:00"},{"end":"2026-11-01T12:00:00","id":"halloween","start":"2026-10-30T00:00:00"},{"end":"2026-11-30T12:00:00","id":"thanksgiving","start":"2026-11-25T00:00:00"},{"end":"2026-12-12T12:00:00","id":"birthday","start":"2026-12-10T00:00:00"},{"end":"2026-12-23T12:00:00","id":"winter-solstice","start":"2026-12-20T00:00:00"},{"end":"2026-12-26T12:00:00","id":"christmas","start":"2026-12-23T00:00:00"},{"end":"2027-01-02T12:00:00","id":"new-years","start":"2026-12-30T00:00:00"}],"2027":[{"end":"2027-01-19T12:00:00","id":"mlk-day","start":"2027-01-17T00:00:00"},{"end":"2027-02-11T12:00:00","id":"lunar-new-year","start":"2027-02-04T00:00:00"},{"end":"2027-02-21T12:00:00","id":"lantern-festival","start":"2027-02-19T00:00:00"},{"end":"2027-03-15T12:00:00","id":"pi-day","start":"2027-03-13T00:00:00"},{"end":"2027-05-05T12:00:00","id":"may-fourth","start":"2027-05-03T00:00:00"},{"end":"2027-06-10T12:00:00","id":"dragon-boat","start":"2027-06-08T00:00:00"},{"end":"2027-06-20T12:00:00","id":"juneteenth","start":"2027-06-18T00:00:00"},{"end":"2027-07-05T12:00:00","id":"fourth-of-july","start":"2027-07-03T00:00:00"},{"end":"2027-08-17T12:00:00","id":"ghost-festival","start":"2027-08-15T00:00:00"},{"end":"2027-09-16T12:00:00","id":"mid-autumn","start":"2027-09-14T00:00:00"},{"end":"2027-10-11T12:00:00","id":"double-tenth","start":"2027-10-09T00:00:00"},{"end":"2027-11-01T12:00:00","id":"halloween","start":"2027-10-30T00:00:00"},{"end":"2027-11-29T12:00:00","id":"thanksgiving","start":"2027-11-24T00:00:00"},{"end":"2027-12-12T12:00:00","id":"birthday","start":"2027-12-10T00:00:00"},{"end":"2027-12-23T12:00:00","id":"winter-solstice","start":"2027-12-21T00:00:00"},{"end":"2027-12-26T12:00:00","id":"christmas","start":"2027-12-23T00:00:00"},{"end":"2028-01-02T12:00:00","id":"new-years","start":"2027-12-30T00:00:00"}],"2028":[{"end":"2028-01-18T12:00:00","id":"mlk-day","start":"2028-01-16T00:00:00"},{"end":"2028-01-31T12:00:00","id":"lunar-new-year","start":"2028-01-24T00:00:00"},{"end":"2028-02-10T12:00:00","id":"lantern-festival","start":"2028-02-08T00:00:00"},{"end":"2028-03-15T12:00:00","id":"pi-day","start":"2028-03-13T00:00:00"},{"end":"2028-05-05T12:00:00","id":"may-fourth","start":"2028-05-03T00:00:00"},{"end":"2028-05-29T12:00:00","id":"dragon-boat","start":"2028-05-27T00:00:00"},{"end":"2028-06-20T12:00:00","id":"juneteenth","start":"2028-06-18T00:00:00"},{"end":"2028-07-05T12:00:00","id":"fourth-of-july","start":"2028-07-03T00:00:00"},{"end":"2028-09-04T12:00:00","id":"ghost-festival","start":"2028-09-02T00:00:00"},{"end":"2028-10-04T12:00:00","id":"mid-autumn","start":"2028-10-02T00:00:00"},{"end":"2028-10-11T12:00:00","id":"double-tenth","start":"2028-10-09T00:00:00"},{"end":"2028-11-01T12:00:00","id":"halloween","start":"2028-10-30T00:00:00"},{"end":"2028-11-27T12:00:00","id":"thanksgiving","start":"2028-11-22T00:00:00"},{"end":"2028-12-12T12:00:00","id":"birthday","start":"2028-12-10T00:00:00"},{"end":"2028-12-22T12:00:00","id":"winter-solstice","start":"2028-12-20T00:00:00"},{"end":"2028-12-26T12:00:00","id":"christmas","start":"2028-12-23T00:00:00"},{"end":"2029-01-02T12:00:00","id":"new-years","start":"2028-12-30T00:00:00"}],"2029":[{"end":"2029-01-16T12:00:00","id":"mlk-day","start":"2029-01-14T00:00:00"},{"end":"2029-02-18T12:00:00","id":"lunar-new-year","start":"2029-02-11T00:00:00"},{"end":"2029-02-28T12:00:00","id":"lantern-festival","start":"2029-02-26T00:00:00"},{"end":"2029-03-15T12:00:00","id":"pi-day","start":"2029-03-13T00:00:00"},{"end":"2029-05-05T12:00:00","id":"may-fourth","start":"2029-05-03T00:00:00"},{"end":"2029-06-17T12:00:00","id":"dragon-boat","start":"2029-06-15T00:00:00"},{"end":"2029-06-20T12:00:00","id":"juneteenth","start":"2029-06-18T00:00:00"},{"end":"2029-07-05T12:00:00","id":"fourth-of-july","start":"2029-07-03T00:00:00"},{"end":"2029-08-25T12:00:00","id":"ghost-festival","start":"2029-08-23T00:00:00"},{"end":"2029-09-23T12:00:00","id":"mid-autumn","start":"2029-09-21T00:00:00"},{"end":"2029-10-11T12:00:00","id":"double-tenth","start":"2029-10-09T00:00:00"},{"end":"2029-11-01T12:00:00","id":"halloween","start":"2029-10-30T00:00:00"},{"end":"2029-11-26T12:00:00","id":"thanksgiving","start":"2029-11-21T00:00:00"},{"end":"2029-12-12T12:00:00","id":"birthday","start":"2029-12-10T00:00:00"},{"end":"2029-12-22T12:00:00","id":"winter-solstice","start":"2029-12-20T00:00:00"},{"end":"2029-12-26T12:00:00","id":"christmas","start":"2029-12-23T00:00:00"},{"end":"2030-01-02T12:00:00","id":"new-years","start":"2029-12-30T00:00:00"}],"2030":[{"end":"2030-01-22T12:00:00","id":"mlk-day","start":"2030-01-20T00:00:00"},{"end":"2030-02-08T12:00:00","id":"lunar-new-year","start":"2030-02-01T00:00:00"},{"end":"2030-02-18T12:00:00","id":"lantern-festival","start":"2030-02-16T00:00:00"},{"end":"2030-03-15T12:00:00","id":"pi-day","start":"2030-03-13T00:00:00"},{"end":"2030-05-05T12:00:00","id":"may-fourth","start":"2030-05-03T00:00:00"},{"end":"2030-06-06T12:00:00","id":"dragon-boat","start":"2030-06-04T00:00:00"},{"end":"2030-06-20T12:00:00","id":"juneteenth","start":"2030-06-18T00:00:00"},{"end":"2030-07-05T12:00:00","id":"fourth-of-july","start":"2030-07-03T00:00:00"},{"end":"2030-08-14T12:00:00","id":"ghost-festival","start":"2030-08-12T00:00:00"},{"end":"2030-09-13T12:00:00","id":"mid-autumn","start":"2030-09-11T00:00:00"},{"end":"2030-10-11T12:00:00","id":"double-tenth","start":"2030-10-09T00:00:00"},{"end":"2030-11-01T12:00:00","id":"halloween","start":"2030-10-30T00:00:00"},{"end":"2030-12-02T12:00:00","id":"thanksgiving","start":"2030-11-27T00:00:00"},{"end":"2030-12-12T12:00:00","id":"birthday","start":"2030-12-10T00:00:00"},{"end":"2030-12-23T12:00:00","id":"winter-solstice","start":"2030-12-20T00:00:00"},{"end":"2030-12-26T12:00:00","id":"christmas","start":"2030-12-23T00:00:00"},{"end":"2031-01-02T12:00:00","id":"new-years","start":"2030-12-30T00:00:00"}],"2031":[{"end":"2031-01-21T12:00:00","id":"mlk-day","start":"2031-01-19T00:00:00"},{"end":"2031-01-28T12:00:00","id":"lunar-new-year","start":"2031-01-21T00:00:00"},{"end":"2031-02-07T12:00:00","id":"lantern-festival","start":"2031-02-05T00:00:00"},{"end":"2031-03-15T12:00:00","id":"pi-day","start":"2031-03-13T00:00:00"},{"end":"2031-05-05T12:00:00","id":"may-fourth","start":"2031-05-03T00:00:00"},{"end":"2031-06-25T12:00:00","id":"dragon-boat","start":"2031-06-23T00:00:00"},{"end":"2031-06-20T12:00:00","id":"juneteenth","start":"2031-06-18T00:00:00"},{"end":"2031-07-05T12:00:00","id":"fourth-of-july","start":"2031-07-03T00:00:00"},{"end":"2031-09-02T12:00:00","id":"ghost-festival","start":"2031-08-31T00:00:00"},{"end":"2031-10-02T12:00:00","id":"mid-autumn","start":"2031-09-30T00:00:00"},{"end":"2031-10-11T12:00:00","id":"double-tenth","start":"2031-10-09T00:00:00"},{"end":"2031-11-01T12:00:00","id":"halloween","start":"2031-10-30T00:00:00"},{"end":"2031-12-01T12:00:00","id":"thanksgiving","start":"2031-11-26T00:00:00"},{"end":"2031-12-12T12:00:00","id":"birthday","start":"2031-12-10T00:00:00"},{"end":"2031-12-23T12:00:00","id":"winter-solstice","start":"2031-12-21T00:00:00"},{"end":"2031-12-26T12:00:00","id":"christmas","start":"2031-12-23T00:00:00"},{"end":"2032-01-02T12:00:00","id":"new-years","start":"2031-12-30T00:00:00"}],"2032":[{"end":"2032-01-20T12:00:00","id":"mlk-day","start":"2032-01-18T00:00:00"},{"end":"2032-02-16T12:00:00","id":"lunar-new-year","start":"2032-02-09T00:00:00"},{"end":"2032-02-26T12:00:00","id":"lantern-festival","start":"2032-02-24T00:00:00"},{"end":"2032-03-15T12:00:00","id":"pi-day","start":"2032-03-13T00:00:00"},{"end":"2032-05-05T12:00:00","id":"may-fourth","start":"2032-05-03T00:00:00"},{"end":"2032-06-13T12:00:00","id":"dragon-boat","start":"2032-06-11T00:00:00"},{"end":"2032-06-20T12:00:00","id":"juneteenth","start":"2032-06-18T00:00:00"},{"end":"2032-07-05T12:00:00","id":"fourth-of-july","start":"2032-07-03T00:00:00"},{"end":"2032-08-21T12:00:00","id":"ghost-festival","start":"2032-08-19T00:00:00"},{"end":"2032-09-20T12:00:00","id":"mid-autumn","start":"2032-09-18T00:00:00"},{"end":"2032-10-11T12:00:00","id":"double-tenth","start":"2032-10-09T00:00:00"},{"end":"2032-11-01T12:00:00","id":"halloween","start":"2032-10-30T00:00:00"},{"end":"2032-11-29T12:00:00","id":"thanksgiving","start":"2032-11-24T00:00:00"},{"end":"2032-12-12T12:00:00","id":"birthday","start":"2032-12-10T00:00:00"},{"end":"2032-12-22T12:00:00","id":"winter-solstice","start":"2032-12-20T00:00:00"},{"end":"2032-12-26T12:00:00","id":"christmas","start":"2032-12-23T00:00:00"},{"end":"2033-01-02T12:00:00","id":"new-years","start":"2032-12-30T00:00:00"}],"2033":[{"end":"2033-01-18T12:00:00","id":"mlk-day","start":"2033-01-16T00:00:00"},{"end":"2033-02-05T12:00:00","id":"lunar-new-year","start":"2033-01-29T00:00:00"},{"end":"2033-02-15T12:00:00","id":"lantern-festival","start":"2033-02-13T00:00:00"},{"end":"2033-03-15T12:00:00","id":"pi-day","start":"2033-03-13T00:00:00"},{"end":"2033-05-05T12:00:00","id":"may-fourth","start":"2033-05-03T00:00:00"},{"end":"2033-06-02T12:00:00","id":"dragon-boat","start":"2033-05-31T00:00:00"},{"end":"2033-06-20T12:00:00","id":"juneteenth","start":"2033-06-18T00:00:00"},{"end":"2033-07-05T12:00:00","id":"fourth-of-july","start":"2033-07-03T00:00:00"},{"end":"2033-08-10T12:00:00","id":"ghost-festival","start":"2033-08-08T00:00:00"},{"end":"2033-09-09T12:00:00","id":"mid-autumn","start":"2033-09-07T00:00:00"},{"end":"2033-10-11T12:00:00","id":"double-tenth","start":"2033-10-09T00:00:00"},{"end":"2033-11-01T12:00:00","id":"halloween","start":"2033-10-30T00:00:00"},{"end":"2033-11-28T12:00:00","id":"thanksgiving","start":"2033-11-23T00:00:00"},{"end":"2033-12-12T12:00:00","id":"birthday","start":"2033-12-10T00:00:00"},{"end":"2033-12-22T12:00:00","id":"winter-solstice","start":"2033-12-20T00:00:00"},{"end":"2033-12-26T12:00:00","id":"christmas","start":"2033-12-23T00:00:00"},{"end":"2034-01-02T12:00:00","id":"new-years","start":"2033-12-30T00:00:00"}],"2034":[{"end":"2034-01-17T12:00:00","id":"mlk-day","start":"2034-01-15T00:00:00"},{"end":"2034-02-24T12:00:00","id":"lunar-new-year","start":"2034-02-17T00:00:00"},{"end":"2034-03-06T12:00:00","id":"lantern-festival","start":"2034-03-04T00:00:00"},{"end":"2034-03-15T12:00:00","id":"pi-day","start":"2034-03-13T00:00:00"},{"end":"2034-05-05T12:00:00","id":"may-fourth","start":"2034-05-03T00:00:00"},{"end":"2034-06-21T12:00:00","id":"dragon-boat","start":"2034-06-19T00:00:00"},{"end":"2034-06-20T12:00:00","id":"juneteenth","start":"2034-06-18T00:00:00"},{"end":"2034-07-05T12:00:00","id":"fourth-of-july","start":"2034-07-03T00:00:00"},{"end":"2034-08-29T12:00:00","id":"ghost-festival","start":"2034-08-27T00:00:00"},{"end":"2034-09-28T12:00:00","id":"mid-autumn","start":"2034-09-26T00:00:00"},{"end":"2034-10-11T12:00:00","id":"double-tenth","start":"2034-10-09T00:00:00"},{"end":"2034-11-01T12:00:00","id":"halloween","start":"2034-10-30T00:00:00"},{"end":"2034-11-27T12:00:00","id":"thanksgiving","start":"2034-11-22T00:00:00"},{"end":"2034-12-12T12:00:00","id":"birthday","start":"2034-12-10T00:00:00"},{"end":"2034-12-23T12:00:00","id":"winter-solstice","start":"2034-12-20T00:00:00"},{"end":"2034-12-26T12:00:00","id":"christmas","start":"2034-12-23T00:00:00"},{"end":"2035-01-02T12:00:00","id":"new-years","start":"2034-12-30T00:00:00"}],"2035":[{"end":"2035-01-16T12:00:00","id":"mlk-day","start":"2035-01-14T00:00:00"},{"end":"2035-02-13T12:00:00","id":"lunar-new-year","start":"2035-02-06T00:00:00"},{"end":"2035-02-23T12:00:00","id":"lantern-festival","start":"2035-02-21T00:00:00"},{"end":"2035-03-15T12:00:00","id":"pi-day","start":"2035-03-13T00:00:00"},{"end":"2035-05-05T12:00:00","id":"may-fourth","start":"2035-05-03T00:00:00"},{"end":"2035-06-11T12:00:00","id":"dragon-boat","start":"2035-06-09T00:00:00"},{"end":"2035-06-20T12:00:00","id":"juneteenth","start":"2035-06-18T00:00:00"},{"end":"2035-07-05T12:00:00","id":"fourth-of-july","start":"2035-07-03T00:00:00"},{"end":"2035-08-19T12:00:00","id":"ghost-festival","start":"2035-08-17T00:00:00"},{"end":"2035-09-17T12:00:00","id":"mid-autumn","start":"2035-09-15T00:00:00"},{"end":"2035-10-11T12:00:00","id":"double-tenth","start":"2035-10-09T00:00:00"},{"end":"2035-11-01T12:00:00","id":"halloween","start":"2035-10-30T00:00:00"},{"end":"2035-11-26T12:00:00","id":"thanksgiving","start":"2035-11-21T00:00:00"},{"end":"2035-12-12T12:00:00","id":"birthday","start":"2035-12-10T00:00:00"},{"end":"2035-12-23T12:00:00","id":"winter-solstice","start":"2035-12-21T00:00:00"},{"end":"2035-12-26T12:00:00","id":"christmas","start":"2035-12-23T00:00:00"},{"end":"2036-01-02T12:00:00","id":"new-years","start":"2035-12-30T00:00:00"}],"2036":[{"end":"2036-01-22T12:00:00","id":"mlk-day","start":"2036-01-20T00:00:00"},{"end":"2036-02-02T12:00:00","id":"lunar-new-year","start":"2036-01-26T00:00:00"},{"end":"2036-02-12T12:00:00","id":"lantern-festival","start":"2036-02-10T00:00:00"},{"end":"2036-03-15T12:00:00","id":"pi-day","start":"2036-03-13T00:00:00"},{"end":"2036-05-05T12:00:00","id":"may-fourth","start":"2036-05-03T00:00:00"},{"end":"2036-05-31T12:00:00","id":"dragon-boat","start":"2036-05-29T00:00:00"},{"end":"2036-06-20T12:00:00","id":"juneteenth","start":"2036-06-18T00:00:00"},{"end":"2036-07-05T12:00:00","id":"fourth-of-july","start":"2036-07-03T00:00:00"},{"end":"2036-09-06T12:00:00","id":"ghost-festival","start":"2036-09-04T00:00:00"},{"end":"2036-10-05T12:00:00","id":"mid-autumn","start":"2036-10-03T00:00:00"},{"end":"2036-10-11T12:00:00","id":"double-tenth","start":"2036-10-09T00:00:00"},{"end":"2036-11-01T12:00:00","id":"halloween","start":"2036-10-30T00:00:00"},{"end":"2036-12-01T12:00:00","id":"thanksgiving","start":"2036-11-26T00:00:00"},{"end":"2036-12-12T12:00:00","id":"birthday","start":"2036-12-10T00:00:00"},{"end":"2036-12-22T12:00:00","id":"winter-solstice","start":"2036-12-20T00:00:00"},{"end":"2036-12-26T12:00:00","id":"christmas","start":"2036-12-23T00:00:00"},{"end":"2037-01-02T12:00:00","id":"new-years","start":"2036-12-30T00:00:00"}],"2037":[{"end":"2037-01-20T12:00:00","id":"mlk-day","start":"2037-01-18T00:00:00"},{"end":"2037-02-20T12:00:00","id":"lunar-new-year","start":"2037-02-13T00:00:00"},{"end":"2037-03-02T12:00:00","id":"lantern-festival","start":"2037-02-28T00:00:00"},{"end":"2037-03-15T12:00:00","id":"pi-day","start":"2037-03-13T00:00:00"},{"end":"2037-05-05T12:00:00","id":"may-fourth","start":"2037-05-03T00:00:00"},{"end":"2037-06-19T12:00:00","id":"dragon-boat","start":"2037-06-17T00:00:00"},{"end":"2037-06-20T12:00:00","id":"juneteenth","start":"2037-06-18T00:00:00"},{"end":"2037-07-05T12:00:00","id":"fourth-of-july","start":"2037-07-03T00:00:00"},{"end":"2037-08-26T12:00:00","id":"ghost-festival","start":"2037-08-24T00:00:00"},{"end":"2037-09-25T12:00:00","id":"mid-autumn","start":"2037-09-23T00:00:00"},{"end":"2037-10-11T12:00:00","id":"double-tenth","start":"2037-10-09T00:00:00"},{"end":"2037-11-01T12:00:00","id":"halloween","start":"2037-10-30T00:00:00"},{"end":"2037-11-30T12:00:00","id":"thanksgiving","start":"2037-11-25T00:00:00"},{"end":"2037-12-12T12:00:00","id":"birthday","start":"2037-12-10T00:00:00"},{"end":"2037-12-22T12:00:00","id":"winter-solstice","start":"2037-12-20T00:00:00"},{"end":"2037-12-26T12:00:00","id":"christmas","start":"2037-12-23T00:00:00"},{"end":"2038-01-02T12:00:00","id":"new-years","start":"2037-12-30T00:00:00"}],"2038":[{"end":"2038-01-19T12:00:00","id":"mlk-day","start":"2038-01-17T00:00:00"},{"end":"2038-02-09T12:00:00","id":"lunar-new-year","start":"2038-02-02T00:00:00"},{"end":"2038-02-19T12:00:00","id":"lantern-festival","start":"2038-02-17T00:00:00"},{"end":"2038-03-15T12:00:00","id":"pi-day","start":"2038-03-13T00:00:00"},{"end":"2038-05-05T12:00:00","id":"may-fourth","start":"2038-05-03T00:00:00"},{"end":"2038-06-08T12:00:00","id":"dragon-boat","start":"2038-06-06T00:00:00"},{"end":"2038-06-20T12:00:00","id":"juneteenth","start":"2038-06-18T00:00:00"},{"end":"2038-07-05T12:00:00","id":"fourth-of-july","start":"2038-07-03T00:00:00"},{"end":"2038-08-16T12:00:00","id":"ghost-festival","start":"2038-08-14T00:00:00"},{"end":"2038-09-14T12:00:00","id":"mid-autumn","start":"2038-09-12T00:00:00"},{"end":"2038-10-11T12:00:00","id":"double-tenth","start":"2038-10-09T00:00:00"},{"end":"2038-11-01T12:00:00","id":"halloween","start":"2038-10-30T00:00:00"},{"end":"2038-11-29T12:00:00","id":"thanksgiving","start":"2038-11-24T00:00:00"},{"end":"2038-12-12T12:00:00","id":"birthday","start":"2038-12-10T00:00:00"},{"end":"2038-12-23T12:00:00","id":"winter-solstice","start":"2038-12-20T00:00:00"},{"end":"2038-12-26T12:00:00","id":"christmas","start":"2038-12-23T00:00:00"},{"end":"2039-01-02T12:00:00","id":"new-years","start":"2038-12-30T00:00:00"}],"2039":[{"end":"2039-01-18T12:00:00","id":"mlk-day","start":"2039-01-16T00:00:00"},{"end":"2039-01-29T12:00:00","id":"lunar-new-year","start":"2039-01-22T00:00:00"},{"end":"2039-02-08T12:00:00","id":"lantern-festival","start":"2039-02-06T00:00:00"},{"end":"2039-03-15T12:00:00","id":"pi-day","start":"2039-03-13T00:00:00"},{"end":"2039-05-05T12:00:00","id":"may-fourth","start":"2039-05-03T00:00:00"},{"end":"2039-05-28T12:00:00","id":"dragon-boat","start":"2039-05-26T00:00:00"},{"end":"2039-06-20T12:00:00","id":"juneteenth","start":"2039-06-18T00:00:00"},{"end":"2039-07-05T12:00:00","id":"fourth-of-july","start":"2039-07-03T00:00:00"},{"end":"2039-09-04T12:00:00","id":"ghost-festival","start":"2039-09-02T00:00:00"},{"end":"2039-10-03T12:00:00","id":"mid-autumn","start":"2039-10-01T00:00:00"},{"end":"2039-10-11T12:00:00","id":"double-tenth","start":"2039-10-09T00:00:00"},{"end":"2039-11-01T12:00:00","id":"halloween","start":"2039-10-30T00:00:00"},{"end":"2039-11-28T12:00:00","id":"thanksgiving","start":"2039-11-23T00:00:00"},{"end":"2039-12-12T12:00:00","id":"birthday","start":"2039-12-10T00:00:00"},{"end":"2039-12-23T12:00:00","id":"winter-solstice","start":"2039-12-21T00:00:00"},{"end":"2039-12-26T12:00:00","id":"christmas","start":"2039-12-23T00:00:00"},{"end":"2040-01-02T12:00:00","id":"new-years","start":"2039-12-30T00:00:00"}],"2040":[{"end":"2040-01-17T12:00:00","id":"mlk-day","start":"2040-01-15T00:00:00"},{"end":"2040-02-17T12:00:00","id":"lunar-new-year","start":"2040-02-10T00:00:00"},{"end":"2040-02-27T12:00:00","id":"lantern-festival","start":"2040-02-25T00:00:00"},{"end":"2040-03-15T12:00:00","id":"pi-day","start":"2040-03-13T00:00:00"},{"end":"2040-05-05T12:00:00","id":"may-fourth","start":"2040-05-03T00:00:00"},{"end":"2040-06-15T12:00:00","id":"dragon-boat","start":"2040-06-13T00:00:00"},{"end":"2040-06-20T12:00:00","id":"juneteenth","start":"2040-06-18T00:00:00"},{"end":"2040-07-05T12:00:00","id":"fourth-of-july","start":"2040-07-03T00:00:00"},{"end":"2040-08-23T12:00:00","id":"ghost-festival","start":"2040-08-21T00:00:00"},{"end":"2040-09-21T12:00:00","id":"mid-autumn","start":"2040-09-19T00:00:00"},{"end":"2040-10-11T12:00:00","id":"double-tenth","start":"2040-10-09T00:00:00"},{"end":"2040-11-01T12:00:00","id":"halloween","start":"2040-10-30T00:00:00"},{"end":"2040-11-26T12:00:00","id":"thanksgiving","start":"2040-11-21T00:00:00"},{"end":"2040-12-12T12:00:00","id":"birthday","start":"2040-12-10T00:00:00"},{"end":"2040-12-22T12:00:00","id":"winter-solstice","start":"2040-12-20T00:00:00"},{"end":"2040-12-26T12:00:00","id":"christmas","start":"2040-12-23T00:00:00"},{"end":"2041-01-02T12:00:00","id":"new-years","start":"2040-12-30T00:00:00"}],"2041":[{"end":"2041-01-22T12:00:00","id":"mlk-day","start":"2041-01-20T00:00:00"},{"end":"2041-02-06T12:00:00","id":"lunar-new-year","start":"2041-01-30T00:00:00"},{"end":"2041-02-16T12:00:00","id":"lantern-festival","start":"2041-02-14T00:00:00"},{"end":"2041-03-15T12:00:00","id":"pi-day","start":"2041-03-13T00:00:00"},{"end":"2041-05-05T12:00:00","id":"may-fourth","start":"2041-05-03T00:00:00"},{"end":"2041-06-04T12:00:00","id":"dragon-boat","start":"2041-06-02T00:00:00"},{"end":"2041-06-20T12:00:00","id":"juneteenth","start":"2041-06-18T00:00:00"},{"end":"2041-07-05T12:00:00","id":"fourth-of-july","start":"2041-07-03T00:00:00"},{"end":"2041-08-12T12:00:00","id":"ghost-festival","start":"2041-08-10T00:00:00"},{"end":"2041-09-11T12:00:00","id":"mid-autumn","start":"2041-09-09T00:00:00"},{"end":"2041-10-11T12:00:00","id":"double-tenth","start":"2041-10-09T00:00:00"},{"end":"2041-11-01T12:00:00","id":"halloween","start":"2041-10-30T00:00:00"},{"end":"2041-12-02T12:00:00","id":"thanksgiving","start":"2041-11-27T00:00:00"},{"end":"2041-12-12T12:00:00","id":"birthday","start":"2041-12-10T00:00:00"},{"end":"2041-12-22T12:00:00","id":"winter-solstice","start":"2041-12-20T00:00:00"},{"end":"2041-12-26T12:00:00","id":"christmas","start":"2041-12-23T00:00:00"},{"end":"2042-01-02T12:00:00","id":"new-years","start":"2041-12-30T00:00:00"}],"2042":[{"end":"2042-01-21T12:00:00","id":"mlk-day","start":"2042-01-19T00:00:00"},{"end":"2042-01-27T12:00:00","id":"lunar-new-year","start":"2042-01-20T00:00:00"},{"end":"2042-02-06T12:00:00","id":"lantern-festival","start":"2042-02-04T00:00:00"},{"end":"2042-03-15T12:00:00","id":"pi-day","start":"2042-03-13T00:00:00"},{"end":"2042-05-05T12:00:00","id":"may-fourth","start":"2042-05-03T00:00:00"},{"end":"2042-06-23T12:00:00","id":"dragon-boat","start":"2042-06-21T00:00:00"},{"end":"2042-06-20T12:00:00","id":"juneteenth","start":"2042-06-18T00:00:00"},{"end":"2042-07-05T12:00:00","id":"fourth-of-july","start":"2042-07-03T00:00:00"},{"end":"2042-08-31T12:00:00","id":"ghost-festival","start":"2042-08-29T00:00:00"},{"end":"2042-09-29T12:00:00","id":"mid-autumn","start":"2042-09-27T00:00:00"},{"end":"2042-10-11T12:00:00","id":"double-tenth","start":"2042-10-09T00:00:00"},{"end":"2042-11-01T12:00:00","id":"halloween","start":"2042-10-30T00:00:00"},{"end":"2042-12-01T12:00:00","id":"thanksgiving","start":"2042-11-26T00:00:00"},{"end":"2042-12-12T12:00:00","id":"birthday","start":"2042-12-10T00:00:00"},{"end":"2042-12-23T12:00:00","id":"winter-solstice","start":"2042-12-20T00:00:00"},{"end":"2042-12-26T12:00:00","id":"christmas","start":"2042-12-23T00:00:00"},{"end":"2043-01-02T12:00:00","id":"new-years","start":"2042-12-30T00:00:00"}],"2043":[{"end":"2043-01-20T12:00:00","id":"mlk-day","start":"2043-01-18T00:00:00"},{"end":"2043-02-15T12:00:00","id":"lunar-new-year","start":"2043-02-08T00:00:00"},{"end":"2043-02-25T12:00:00","id":"lantern-festival","start":"2043-02-23T00:00:00"},{"end":"2043-03-15T12:00:00","id":"pi-day","start":"2043-03-13T00:00:00"},{"end":"2043-05-05T12:00:00","id":"may-fourth","start":"2043-05-03T00:00:00"},{"end":"2043-06-12T12:00:00","id":"dragon-boat","start":"2043-06-10T00:00:00"},{"end":"2043-06-20T12:00:00","id":"juneteenth","start":"2043-06-18T00:00:00"},{"end":"2043-07-05T12:00:00","id":"fourth-of-july","start":"2043-07-03T00:00:00"},{"end":"2043-08-20T12:00:00","id":"ghost-festival","start":"2043-08-18T00:00:00"},{"end":"2043-09-18T12:00:00","id":"mid-autumn","start":"2043-09-16T00:00:00"},{"end":"2043-10-11T12:00:00","id":"double-tenth","start":"2043-10-09T00:00:00"},{"end":"2043-11-01T12:00:00","id":"halloween","start":"2043-10-30T00:00:00"},{"end":"2043-11-30T12:00:00","id":"thanksgiving","start":"2043-11-25T00:00:00"},{"end":"2043-12-12T12:00:00","id":"birthday","start":"2043-12-10T00:00:00"},{"end":"2043-12-23T12:00:00","id":"winter-solstice","start":"2043-12-20T00:00:00"},{"end":"2043-12-26T12:00:00","id":"christmas","start":"2043-12-23T00:00:00"},{"end":"2044-01-02T12:00:00","id":"new-years","start":"2043-12-30T00:00:00"}],"2044":[{"end":"2044-01-19T12:00:00","id":"mlk-day","start":"2044-01-17T00:00:00"},{"end":"2044-02-04T12:00:00","id":"lunar-new-year","start":"2044-01-28T00:00:00"},{"end":"2044-02-14T12:00:00","id":"lantern-festival","start":"2044-02-12T00:00:00"},{"end":"2044-03-15T12:00:00","id":"pi-day","start":"2044-03-13T00:00:00"},{"end":"2044-05-05T12:00:00","id":"may-fourth","start":"2044-05-03T00:00:00"},{"end":"2044-06-01T12:00:00","id":"dragon-boat","start":"2044-05-30T00:00:00"},{"end":"2044-06-20T12:00:00","id":"juneteenth","start":"2044-06-18T00:00:00"},{"end":"2044-07-05T12:00:00","id":"fourth-of-july","start":"2044-07-03T00:00:00"},{"end":"2044-08-09T12:00:00","id":"ghost-festival","start":"2044-08-07T00:00:00"},{"end":"2044-10-06T12:00:00","id":"mid-autumn","start":"2044-10-04T00:00:00"},{"end":"2044-10-11T12:00:00","id":"double-tenth","start":"2044-10-09T00:00:00"},{"end":"2044-11-01T12:00:00","id":"halloween","start":"2044-10-30T00:00:00"},{"end":"2044-11-28T12:00:00","id":"thanksgiving","start":"2044-11-23T00:00:00"},{"end":"2044-12-12T12:00:00","id":"birthday","start":"2044-12-10T00:00:00"},{"end":"2044-12-22T12:00:00","id":"winter-solstice","start":"2044-12-20T00:00:00"},{"end":"2044-12-26T12:00:00","id":"christmas","start":"2044-12-23T00:00:00"},{"end":"2045-01-02T12:00:00","id":"new-years","start":"2044-12-30T00:00:00"}],"2045":[{"end":"2045-01-17T12:00:00","id":"mlk-day","start":"2045-01-15T00:00:00"},{"end":"2045-02-22T12:00:00","id":"lunar-new-year","start":"2045-02-15T00:00:00"},{"end":"2045-03-04T12:00:00","id":"lantern-festival","start":"2045-03-02T00:00:00"},{"end":"2045-03-15T12:00:00","id":"pi-day","start":"2045-03-13T00:00:00"},{"end":"2045-05-05T12:00:00","id":"may-fourth","start":"2045-05-03T00:00:00"},{"end":"2045-06-20T12:00:00","id":"dragon-boat","start":"2045-06-18T00:00:00"},{"end":"2045-06-20T12:00:00","id":"juneteenth","start":"2045-06-18T00:00:00"},{"end":"2045-07-05T12:00:00","id":"fourth-of-july","start":"2045-07-03T00:00:00"},{"end":"2045-08-28T12:00:00","id":"ghost-festival","start":"2045-08-26T00:00:00"},{"end":"2045-09-26T12:00:00","id":"mid-autumn","start":"2045-09-24T00:00:00"},{"end":"2045-10-11T12:00:00","id":"double-tenth","start":"2045-10-09T00:00:00"},{"end":"2045-11-01T12:00:00","id":"halloween","start":"2045-10-30T00:00:00"},{"end":"2045-11-27T12:00:00","id":"thanksgiving","start":"2045-11-22T00:00:00"},{"end":"2045-12-12T12:00:00","id":"birthday","start":"2045-12-10T00:00:00"},{"end":"2045-12-22T12:00:00","id":"winter-solstice","start":"2045-12-20T00:00:00"},{"end":"2045-12-26T12:00:00","id":"christmas","start":"2045-12-23T00:00:00"},{"end":"2046-01-02T12:00:00","id":"new-years","start":"2045-12-30T00:00:00"}],"2046":[{"end":"2046-01-16T12:00:00","id":"mlk-day","start":"2046-01-14T00:00:00"},{"end":"2046-02-11T12:00:00","id":"lunar-new-year","start":"2046-02-04T00:00:00"},{"end":"2046-02-21T12:00:00","id":"lantern-festival","start":"2046-02-19T00:00:00"},{"end":"2046-03-15T12:00:00","id":"pi-day","start":"2046-03-13T00:00:00"},{"end":"2046-05-05T12:00:00","id":"may-fourth","start":"2046-05-03T00:00:00"},{"end":"2046-06-09T12:00:00","id":"dragon-boat","start":"2046-06-07T00:00:00"},{"end":"2046-06-20T12:00:00","id":"juneteenth","start":"2046-06-18T00:00:00"},{"end":"2046-07-05T12:00:00","id":"fourth-of-july","start":"2046-07-03T00:00:00"},{"end":"2046-08-17T12:00:00","id":"ghost-festival","start":"2046-08-15T00:00:00"},{"end":"2046-09-16T12:00:00","id":"mid-autumn","start":"2046-09-14T00:00:00"},{"end":"2046-10-11T12:00:00","id":"double-tenth","start":"2046-10-09T00:00:00"},{"end":"2046-11-01T12:00:00","id":"halloween","start":"2046-10-30T00:00:00"},{"end":"2046-11-26T12:00:00","id":"thanksgiving","start":"2046-11-21T00:00:00"},{"end":"2046-12-12T12:00:00","id":"birthday","start":"2046-12-10T00:00:00"},{"end":"2046-12-23T12:00:00","id":"winter-solstice","start":"2046-12-20T00:00:00"},{"end":"2046-12-26T12:00:00","id":"christmas","start":"2046-12-23T00:00:00"},{"end":"2047-01-02T12:00:00","id":"new-years","start":"2046-12-30T00:00:00"}],"2047":[{"end":"2047-01-22T12:00:00","id":"mlk-day","start":"2047-01-20T00:00:00"},{"end":"2047-01-31T12:00:00","id":"lunar-new-year","start":"2047-01-24T00:00:00"},{"end":"2047-02-10T12:00:00","id":"lantern-festival","start":"2047-02-08T00:00:00"},{"end":"2047-03-15T12:00:00","id":"pi-day","start":"2047-03-13T00:00:00"},{"end":"2047-05-05T12:00:00","id":"may-fourth","start":"2047-05-03T00:00:00"},{"end":"2047-05-30T12:00:00","id":"dragon-boat","start":"2047-05-28T00:00:00"},{"end":"2047-06-20T12:00:00","id":"juneteenth","start":"2047-06-18T00:00:00"},{"end":"2047-07-05T12:00:00","id":"fourth-of-july","start":"2047-07-03T00:00:00"},{"end":"2047-09-05T12:00:00","id":"ghost-festival","start":"2047-09-03T00:00:00"},{"end":"2047-10-05T12:00:00","id":"mid-autumn","start":"2047-10-03T00:00:00"},{"end":"2047-10-11T12:00:00","id":"double-tenth","start":"2047-10-09T00:00:00"},{"end":"2047-11-01T12:00:00","id":"halloween","start":"2047-10-30T00:00:00"},{"end":"2047-12-02T12:00:00","id":"thanksgiving","start":"2047-11-27T00:00:00"},{"end":"2047-12-12T12:00:00","id":"birthday","start":"2047-12-10T00:00:00"},{"end":"2047-12-23T12:00:00","id":"winter-solstice","start":"2047-12-20T00:00:00"},{"end":"2047-12-26T12:00:00","id":"christmas","start":"2047-12-23T00:00:00"},{"end":"2048-01-02T12:00:00","id":"new-years","start":"2047-12-30T00:00:00"}],"2048":[{"end":"2048-01-21T12:00:00","id":"mlk-day","start":"2048-01-19T00:00:00"},{"end":"2048-02-19T12:00:00","id":"lunar-new-year","start":"2048-02-12T00:00:00"},{"end":"2048-02-29T12:00:00","id":"lantern-festival","start":"2048-02-27T00:00:00"},{"end":"2048-03-15T12:00:00","id":"pi-day","start":"2048-03-13T00:00:00"},{"end":"2048-05-05T12:00:00","id":"may-fourth","start":"2048-05-03T00:00:00"},{"end":"2048-06-16T12:00:00","id":"dragon-boat","start":"2048-06-14T00:00:00"},{"end":"2048-06-20T12:00:00","id":"juneteenth","start":"2048-06-18T00:00:00"},{"end":"2048-07-05T12:00:00","id":"fourth-of-july","start":"2048-07-03T00:00:00"},{"end":"2048-08-25T12:00:00","id":"ghost-festival","start":"2048-08-23T00:00:00"},{"end":"2048-09-23T12:00:00","id":"mid-autumn","start":"2048-09-21T00:00:00"},{"end":"2048-10-11T12:00:00","id":"double-tenth","start":"2048-10-09T00:00:00"},{"end":"2048-11-01T12:00:00","id":"halloween","start":"2048-10-30T00:00:00"},{"end":"2048-11-30T12:00:00","id":"thanksgiving","start":"2048-11-25T00:00:00"},{"end":"2048-12-12T12:00:00","id":"birthday","start":"2048-12-10T00:00:00"},{"end":"2048-12-22T12:00:00","id":"winter-solstice","start":"2048-12-20T00:00:00"},{"end":"2048-12-26T12:00:00","id":"christmas","start":"2048-12-23T00:00:00"},{"end":"2049-01-02T12:00:00","id":"new-years","start":"2048-12-30T00:00:00"}],"2049":[{"end":"2049-01-19T12:00:00","id":"mlk-day","start":"2049-01-17T00:00:00"},{"end":"2049-02-07T12:00:00","id":"lunar-new-year","start":"2049-01-31T00:00:00"},{"end":"2049-02-17T12:00:00","id":"lantern-festival","start":"2049-02-15T00:00:00"},{"end":"2049-03-15T12:00:00","id":"pi-day","start":"2049-03-13T00:00:00"},{"end":"2049-05-05T12:00:00","id":"may-fourth","start":"2049-05-03T00:00:00"},{"end":"2049-06-05T12:00:00","id":"dragon-boat","start":"2049-06-03T00:00:00"},{"end":"2049-06-20T12:00:00","id":"juneteenth","start":"2049-06-18T00:00:00"},{"end":"2049-07-05T12:00:00","id":"fourth-of-july","start":"2049-07-03T00:00:00"},{"end":"2049-08-14T12:00:00","id":"ghost-festival","start":"2049-08-12T00:00:00"},{"end":"2049-09-12T12:00:00","id":"mid-autumn","start":"2049-09-10T00:00:00"},{"end":"2049-10-11T12:00:00","id":"double-tenth","start":"2049-10-09T00:00:00"},{"end":"2049-11-01T12:00:00","id":"halloween","start":"2049-10-30T00:00:00"},{"end":"2049-11-29T12:00:00","id":"thanksgiving","start":"2049-11-24T00:00:00"},{"end":"2049-12-12T12:00:00","id":"birthday","start":"2049-12-10T00:00:00"},{"end":"2049-12-22T12:00:00","id":"winter-solstice","start":"2049-12-20T00:00:00"},{"end":"2049-12-26T12:00:00","id":"christmas","start":"2049-12-23T00:00:00"},{"end":"2050-01-02T12:00:00","id":"new-years","start":"2049-12-30T00:00:00"}],"2050":[{"end":"2050-01-18T12:00:00","id":"mlk-day","start":"2050-01-16T00:00:00"},{"end":"2050-01-28T12:00:00","id":"lunar-new-year","start":"2050-01-21T00:00:00"},{"end":"2050-02-07T12:00:00","id":"lantern-festival","start":"2050-02-05T00:00:00"},{"end":"2050-03-15T12:00:00","id":"pi-day","start":"2050-03-13T00:00:00"},{"end":"2050-05-05T12:00:00","id":"may-fourth","start":"2050-05-03T00:00:00"},{"end":"2050-06-24T12:00:00","id":"dragon-boat","start":"2050-06-22T00:00:00"},{"end":"2050-06-20T12:00:00","id":"juneteenth","start":"2050-06-18T00:00:00"},{"end":"2050-07-05T12:00:00","id":"fourth-of-july","start":"2050-07-03T00:00:00"},{"end":"2050-09-01T12:00:00","id":"ghost-festival","start":"2050-08-30T00:00:00"},{"end":"2050-10-01T12:00:00","id":"mid-autumn","start":"2050-09-29T00:00:00"},{"end":"2050-10-11T12:00:00","id":"double-tenth","start":"2050-10-09T00:00:00"},{"end":"2050-11-01T12:00:00","id":"halloween","start":"2050-10-30T00:00:00"},{"end":"2050-11-28T12:00:00","id":"thanksgiving","start":"2050-11-23T00:00:00"},{"end":"2050-12-12T12:00:00","id":"birthday","start":"2050-12-10T00:00:00"},{"end":"2050-12-23T12:00:00","id":"winter-solstice","start":"2050-12-20T00:00:00"},{"end":"2050-12-26T12:00:00","id":"christmas","start":"2050-12-23T00:00:00"},{"end":"2051-01-02T12:00:00","id":"new-years","start":"2050-12-30T00:00:00"}]};

  let currentThemeId = null;
  let currentUnmount = null;
  let transitionTimer = null;

  function parseLocalDate(isoString) {
    if (!isoString || typeof isoString !== 'string') return new Date(NaN);
    const trimmed = isoString.trim();
    const [datePart, timePart] = trimmed.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    if (!y || !m || !d) return new Date(isoString);
    if (!timePart) {
      return new Date(y, m - 1, d, 12, 0, 0);
    }
    const cleanTime = timePart.replace(/Z|[+-]\d{2}:?\d{2}$/, '');
    const parts = cleanTime.split(':').map(Number);
    return new Date(y, m - 1, d, parts[0] || 0, parts[1] || 0, parts[2] || 0);
  }

  function evaluateActiveHoliday(schedule, nowDate) {
    if (!schedule || !(nowDate instanceof Date) || isNaN(nowDate.getTime())) {
      return null;
    }
    const yr = nowDate.getFullYear();
    const yearEntries = [
      ...(schedule[String(yr - 1)] || []),
      ...(schedule[String(yr)] || [])
    ];

    const candidates = yearEntries.filter((item) => {
      const start = parseLocalDate(item.start);
      const end = parseLocalDate(item.end);
      return nowDate >= start && nowDate <= end;
    });

    if (candidates.length === 0) return null;

    // Conflict Resolution: Latest window start time wins
    candidates.sort((a, b) => parseLocalDate(b.start) - parseLocalDate(a.start));
    return candidates[0].id;
  }

  function replaceLogoElement(themeId) {
    const bc = document.getElementById('bc');
    if (!bc) return false;
    const logoLink = bc.querySelector('a.logo');
    if (!logoLink) return false;
    const img = logoLink.querySelector('img');
    if (!img) return false;

    if (!img.dataset.origSrc) {
      img.dataset.origSrc = img.getAttribute('src') || '/assets/img/bassclef.gif';
      img.dataset.origAlt = img.getAttribute('alt') || 'bass clef logo';
      img.dataset.origTitle = logoLink.getAttribute('title') || '';
    }

    img.src = /assets/themes/ + themeId + /logo.svg;
    img.alt = ${themeId} logo;
    img.className = 'holiday-logo-icon';
    img.classList.remove('anim');
    void img.offsetWidth;
    img.classList.add('anim');
    return true;
  }

  function restoreLogoElement() {
    const bc = document.getElementById('bc');
    if (!bc) return;
    const logoLink = bc.querySelector('a.logo');
    if (!logoLink) return;
    const img = logoLink.querySelector('img');
    if (!img) return;

    if (img.dataset.origSrc) {
      img.src = img.dataset.origSrc;
      img.alt = img.dataset.origAlt || 'bass clef logo';
      img.className = 'anim';
    }
    if (img.dataset.origTitle) {
      logoLink.setAttribute('title', img.dataset.origTitle);
    }
  }

  function unmountCurrentTheme() {
    if (typeof currentUnmount === 'function') {
      try {
        currentUnmount();
      } catch (e) {
        console.warn('Error unmounting theme:', e);
      }
      currentUnmount = null;
    }
    const existingCss = document.getElementById('holiday-theme-css');
    if (existingCss && existingCss.parentNode) {
      existingCss.parentNode.removeChild(existingCss);
    }
    if (currentThemeId) {
      document.documentElement.classList.remove('holiday-active', 	heme- + currentThemeId);
      if (document.body) {
        document.body.classList.remove(	heme- + currentThemeId);
        delete document.body.dataset.holidayTheme;
      }
      restoreLogoElement();
    }
    currentThemeId = null;
  }

  function loadTheme(themeId) {
    if (!themeId || !VALID_THEMES.has(themeId)) return Promise.resolve(null);
    if (currentThemeId === themeId) return Promise.resolve(themeId);

    unmountCurrentTheme();
    currentThemeId = themeId;

    // Apply immediate synchronous markers on <html> (prevents flash of bass clef or background)
    document.documentElement.classList.add('holiday-active', 	heme- + themeId);
    if (document.body) {
      document.body.dataset.holidayTheme = themeId;
      document.body.classList.add(	heme- + themeId);
    }

    // 1. Inject isolated theme stylesheet
    let link = document.getElementById('holiday-theme-css');
    if (!link) {
      link = document.createElement('link');
      link.id = 'holiday-theme-css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = /assets/themes/ + themeId + /theme.css;

    // 2. Fast logo replacement as soon as #bc exists in DOM
    if (!replaceLogoElement(themeId)) {
      const observer = new MutationObserver((_, obs) => {
        if (replaceLogoElement(themeId)) {
          obs.disconnect();
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      document.addEventListener('DOMContentLoaded', () => observer.disconnect(), { once: true });
    }

    // 3. Dynamically import theme ES module (particles, greetings, etc.)
    return import(/assets/themes/ + themeId + /theme.js)
      .then((mod) => {
        if (currentThemeId !== themeId) return null;
        if (typeof mod.mount === 'function') {
          currentUnmount = mod.mount({ themeId }) || null;
        }
        return themeId;
      })
      .catch((err) => {
        console.warn(Theme script for  + themeId +  optional or failed:, err);
        return themeId;
      });
  }

  // Synchronous determination in <head>
  const params = new URLSearchParams(window.location.search);
  const themeOverride = params.get('theme');
  const dateOverride = params.get('date');

  let activeTheme = null;
  if (themeOverride && VALID_THEMES.has(themeOverride)) {
    activeTheme = themeOverride;
  } else {
    const simNow = dateOverride ? parseLocalDate(dateOverride) : new Date();
    activeTheme = evaluateActiveHoliday(EMBEDDED_SCHEDULE, simNow);
  }

  if (activeTheme) {
    loadTheme(activeTheme);
  }

  // Boundary transition watcher for active theme or simulated date
  function startBoundaryWatcher() {
    if (!dateOverride && !activeTheme) return;
    const bootWallTime = Date.now();
    const baseSimulatedTime = dateOverride ? parseLocalDate(dateOverride) : new Date();

    const getEffectiveNow = () => {
      const elapsed = Date.now() - bootWallTime;
      return new Date(baseSimulatedTime.getTime() + elapsed);
    };

    if (transitionTimer) clearInterval(transitionTimer);
    transitionTimer = setInterval(() => {
      const nextActive = evaluateActiveHoliday(EMBEDDED_SCHEDULE, getEffectiveNow());
      if (nextActive !== currentThemeId) {
        if (nextActive) {
          loadTheme(nextActive);
        } else {
          unmountCurrentTheme();
        }
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBoundaryWatcher);
  } else {
    startBoundaryWatcher();
  }

  // Expose public helper API for testing and developer tooling
  window.SanbeijiHolidayTheme = {
    validThemes: Array.from(VALID_THEMES),
    parseLocalDate,
    evaluateActiveHoliday,
    loadTheme,
    unmountCurrentTheme,
    getActiveTheme: () => currentThemeId
  };
})();