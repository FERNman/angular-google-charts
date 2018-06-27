declare var google: {
  charts: {
    load: (version: string, config: {
      language?: string,
      packages?: Array<string>
    }) => {},
    setOnLoadCallback: (callback: Function) => {}
  },
  visualization: any
};
