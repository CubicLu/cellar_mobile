export default interface Navigation {
  navigate: (routeName: string, params?: object) => void;
  getParam: (id: string, fallbackString: any) => any;
  popToTop: () => void;
  openDrawer: () => void;
  state: {
    params: {
      onNavigateBack: (b: boolean) => void;
      onSelect: (val?: any) => void;
      onRefresh: () => void;
      onChange: (b: boolean) => void;
    };
    routeName: string;
  };
  addListener: (name: string, func: (data?: any) => void) => void;
  pop: (count: number) => void;
  goBack: () => void;
}
